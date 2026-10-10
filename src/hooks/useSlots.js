import { useCallback, useEffect, useState } from "react";
import { getSlots } from "../services/bookingService";

// Loading is derived (is the stored result for the current request?),
// so no state is set synchronously inside the effect.
export function useSlots(practitionerId) {
  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = `${practitionerId}:${reloadKey}`;
  const [result, setResult] = useState({ key: null, slots: [], failed: false });

  useEffect(() => {
    let cancelled = false;

    getSlots(practitionerId)
      .then((slots) => {
        if (!cancelled) setResult({ key: requestKey, slots, failed: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ key: requestKey, slots: [], failed: true });
      });

    return () => {
      cancelled = true; // ignore a slow response from a previous request
    };
  }, [practitionerId, requestKey]);

  const loading = result.key !== requestKey;
  const reload = useCallback(() => setReloadKey((n) => n + 1), []);

  return {
    slots: loading ? [] : result.slots,
    status: loading ? "loading" : result.failed ? "error" : "ready",
    reload,
  };
}
