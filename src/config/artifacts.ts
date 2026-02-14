/**
 * Artifact storage configuration.
 *
 * Reads the base URL from VITE_ARTIFACT_BASE_URL environment variable.
 * - Local dev:   "/Artifacts"  (Vite serves from public/)
 * - Production:  "https://<account>.blob.core.windows.net/<container>"
 */
export const ARTIFACT_BASE_URL = (
  import.meta.env.VITE_ARTIFACT_BASE_URL || '/Artifacts'
).replace(/\/+$/, '');
