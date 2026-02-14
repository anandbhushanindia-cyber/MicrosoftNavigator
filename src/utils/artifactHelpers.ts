import { ARTIFACT_MANIFEST, type ArtifactFile } from '../data/artifactManifest';
import type { IBMOffer } from '../types/navigator.types';

/**
 * Given an offering group (DT, AMM, DPDE), builds an array of IBMOffer
 * objects from the artifact manifest. Each file becomes one IBMOffer entry.
 * Falls back to the provided fallback offers if no manifest match is found.
 */
export function buildOffersFromArtifacts(
  offeringGroup: string,
  fallbackOffers: IBMOffer[],
): IBMOffer[] {
  const artifacts = ARTIFACT_MANIFEST[offeringGroup];
  if (!artifacts) return fallbackOffers;

  const offers: IBMOffer[] = [];
  let counter = 0;

  const toOffer = (
    artifact: ArtifactFile,
    offerType: IBMOffer['type'],
  ): IBMOffer => ({
    id: `${offeringGroup}_art_${counter++}`,
    title: artifact.title,
    description: artifact.description,
    type: offerType,
    // Encode URI to handle spaces & special chars in file names
    mediaUrl: encodeURI(artifact.path),
    referenceUrl: encodeURI(artifact.path),
    fileType: artifact.fileType,
    fileSize: artifact.fileSize,
  });

  // Video artifacts → 'video' type (shown in Video carousel)
  for (const a of artifacts.video) {
    offers.push(toOffer(a, 'video'));
  }

  // Architecture artifacts → 'architecture' type
  for (const a of artifacts.architecture) {
    offers.push(toOffer(a, 'architecture'));
  }

  // Tool artifacts → 'tool' type
  for (const a of artifacts.tools) {
    offers.push(toOffer(a, 'tool'));
  }

  return offers.length > 0 ? offers : fallbackOffers;
}
