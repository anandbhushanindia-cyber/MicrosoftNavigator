/**
 * Dynamic artifact discovery from Azure Blob Storage.
 *
 * Lists blobs at runtime via the REST API, merges with optional
 * metadata.json for curated titles/descriptions, and falls back
 * to the static manifest when running locally or on error.
 */
import { ARTIFACT_BASE_URL } from '../config/artifacts';
import {
  ARTIFACT_MANIFEST,
  type ArtifactFile,
  type OfferingArtifacts,
} from '../data/artifactManifest';

// ── Types ───────────────────────────────────────────────────────────────────

interface BlobEntry {
  name: string;
  contentLength: number;
  contentType: string;
  metadata: Record<string, string>;
}

interface ArtifactMetadata {
  title: string;
  description: string;
}

type MetadataMap = Record<string, ArtifactMetadata>;

// ── Helpers ─────────────────────────────────────────────────────────────────

const FILE_TYPE_MAP: Record<string, ArtifactFile['fileType']> = {
  mp4: 'mp4',
  png: 'png',
  jpg: 'jpg',
  jpeg: 'jpg',
  pdf: 'pdf',
  pptx: 'pptx',
  xlsx: 'xlsx',
};

/** Extract file extension and map to known fileType. */
function deriveFileType(blobName: string): ArtifactFile['fileType'] {
  const ext = blobName.split('.').pop()?.toLowerCase() ?? '';
  return FILE_TYPE_MAP[ext] ?? 'pdf'; // safe fallback
}

/** Convert raw byte count to human-readable string. */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Derive a human-readable title from a blob path / filename. */
function deriveTitle(blobName: string): string {
  // Extract filename after last "/"
  const fileName = blobName.split('/').pop() ?? blobName;

  // Strip extension
  const name = fileName.replace(/\.[^.]+$/, '');

  // Replace common separators with spaces
  return name
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Determine the artifact category from the blob path. */
function deriveCategory(
  blobName: string,
): 'video' | 'architecture' | 'tools' | null {
  const lower = blobName.toLowerCase();
  if (lower.includes('/video/')) return 'video';
  if (lower.includes('/architecture/')) return 'architecture';
  if (lower.includes('/tools/')) return 'tools';
  return null;
}

// ── XML Parsing ─────────────────────────────────────────────────────────────

/** Parse the Azure Blob Storage list-blobs XML response. */
function parseBlobListXml(xmlText: string): BlobEntry[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const entries: BlobEntry[] = [];

  doc.querySelectorAll('Blob').forEach((blob) => {
    const name = blob.querySelector('Name')?.textContent ?? '';
    const contentLength = parseInt(
      blob.querySelector('Properties > Content-Length')?.textContent ?? '0',
      10,
    );
    const contentType =
      blob.querySelector('Properties > Content-Type')?.textContent ?? '';

    // Custom metadata
    const metadata: Record<string, string> = {};
    const metaEl = blob.querySelector('Metadata');
    if (metaEl) {
      for (const child of Array.from(metaEl.children)) {
        metadata[child.tagName.toLowerCase()] = child.textContent ?? '';
      }
    }

    if (name) entries.push({ name, contentLength, contentType, metadata });
  });

  return entries;
}

// ── Network ─────────────────────────────────────────────────────────────────

/**
 * List blobs from the Azure container using the REST API.
 * Requires container-level public access.
 */
async function listBlobs(prefix: string): Promise<BlobEntry[]> {
  const url =
    `${ARTIFACT_BASE_URL}?restype=container&comp=list` +
    `&prefix=${encodeURIComponent(prefix)}&include=metadata`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Blob list failed: ${res.status}`);

  const xml = await res.text();
  return parseBlobListXml(xml);
}

/**
 * Fetch optional metadata.json for a given offering group.
 * Returns empty map on 404 or any error (metadata is optional).
 */
async function fetchMetadataJson(group: string): Promise<MetadataMap> {
  try {
    const url = encodeURI(
      `${ARTIFACT_BASE_URL}/${group}-Artifacts/metadata.json`,
    );
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return {};
    return (await res.json()) as MetadataMap;
  } catch {
    return {};
  }
}

// ── Cache ───────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<
  string,
  { data: OfferingArtifacts; timestamp: number }
>();

// ── Main Entry Point ────────────────────────────────────────────────────────

/**
 * Discover artifacts dynamically from Azure Blob Storage.
 *
 * - In **production** (ARTIFACT_BASE_URL starts with `http`):
 *   Fetches blob listing + metadata.json, merges them.
 * - In **local dev** (ARTIFACT_BASE_URL starts with `/`):
 *   Returns the static manifest immediately (no network calls).
 */
export async function fetchArtifacts(
  offeringGroup: string,
): Promise<OfferingArtifacts> {
  // Local dev → use static manifest (Vite serves local files)
  const isRemote = ARTIFACT_BASE_URL.startsWith('http');
  if (!isRemote) {
    return ARTIFACT_MANIFEST[offeringGroup] ?? { video: [], architecture: [], tools: [] };
  }

  // Check cache
  const cached = cache.get(offeringGroup);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Fire both requests in parallel
  const prefix = `${offeringGroup}-Artifacts/`;
  const [blobs, metadataMap] = await Promise.all([
    listBlobs(prefix),
    fetchMetadataJson(offeringGroup),
  ]);

  // Build OfferingArtifacts from discovered blobs
  const result: OfferingArtifacts = { video: [], architecture: [], tools: [] };

  for (const blob of blobs) {
    // Skip metadata.json itself and any "folder" entries
    if (blob.name.endsWith('/') || blob.name.endsWith('metadata.json')) continue;

    // Skip files in etc/ folders (not displayed in main offerings)
    if (blob.name.includes('/etc/')) continue;

    const category = deriveCategory(blob.name);
    if (!category) continue; // skip files not in video/architecture/tools

    const fileType = deriveFileType(blob.name);
    const fileName = blob.name.split('/').pop() ?? blob.name;

    // Resolve metadata: metadata.json > blob custom metadata > auto-derived
    const jsonMeta = metadataMap[blob.name];
    const title =
      jsonMeta?.title ||
      blob.metadata.title ||
      deriveTitle(blob.name);
    const description =
      jsonMeta?.description ||
      blob.metadata.description ||
      '';

    const artifact: ArtifactFile = {
      fileName,
      path: blob.name,
      fileType,
      title,
      description,
      fileSize: formatFileSize(blob.contentLength),
    };

    result[category].push(artifact);
  }

  // Cache the result
  cache.set(offeringGroup, { data: result, timestamp: Date.now() });

  return result;
}
