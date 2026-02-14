import { useState, useEffect, useMemo } from 'react';
import type { ArtifactFile, OfferingArtifacts } from '../data/artifactManifest';
import type { IBMOffer } from '../types/navigator.types';
import { ARTIFACT_BASE_URL } from '../config/artifacts';
import { fetchArtifacts } from '../services/artifactService';

/**
 * React hook that dynamically fetches artifacts for an offering group
 * from Azure Blob Storage and converts them to IBMOffer objects.
 *
 * Falls back to provided fallbackOffers on error or while loading.
 */
export function useArtifacts(
  offeringGroup: string | undefined,
  fallbackOffers: IBMOffer[],
): { offers: IBMOffer[]; isLoading: boolean } {
  const [artifacts, setArtifacts] = useState<OfferingArtifacts | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!offeringGroup) {
      setArtifacts(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchArtifacts(offeringGroup)
      .then((data) => {
        if (!cancelled) {
          setArtifacts(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('[useArtifacts] Falling back to static data:', err);
          setArtifacts(null);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [offeringGroup]);

  // Convert OfferingArtifacts → IBMOffer[]
  const offers = useMemo((): IBMOffer[] => {
    if (!artifacts || !offeringGroup) return fallbackOffers;

    const list: IBMOffer[] = [];
    let counter = 0;

    const toOffer = (
      artifact: ArtifactFile,
      offerType: IBMOffer['type'],
    ): IBMOffer => ({
      id: `${offeringGroup}_dyn_${counter++}`,
      title: artifact.title,
      description: artifact.description,
      type: offerType,
      mediaUrl: encodeURI(`${ARTIFACT_BASE_URL}/${artifact.path}`),
      referenceUrl: encodeURI(`${ARTIFACT_BASE_URL}/${artifact.path}`),
      fileType: artifact.fileType,
      fileSize: artifact.fileSize,
    });

    for (const a of artifacts.video) list.push(toOffer(a, 'video'));
    for (const a of artifacts.architecture) list.push(toOffer(a, 'architecture'));
    for (const a of artifacts.tools) list.push(toOffer(a, 'tool'));

    return list.length > 0 ? list : fallbackOffers;
  }, [artifacts, offeringGroup, fallbackOffers]);

  return { offers, isLoading };
}
