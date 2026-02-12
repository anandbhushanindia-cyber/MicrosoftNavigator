import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIdleTimeoutOptions {
  /** Idle timeout in milliseconds before warning appears. Default: 120000 (2 min) */
  timeoutMs?: number;
  /** Warning duration in milliseconds before auto-reset. Default: 15000 (15 sec) */
  warningMs?: number;
  /** Whether the timeout is enabled. Default: true */
  enabled?: boolean;
}

interface UseIdleTimeoutReturn {
  /** Whether the idle warning modal should be shown */
  showWarning: boolean;
  /** Seconds remaining on the warning countdown */
  warningSecondsLeft: number;
  /** Dismiss the warning and reset the idle timer */
  dismissWarning: () => void;
}

export function useIdleTimeout(
  onIdle: () => void,
  options: UseIdleTimeoutOptions = {}
): UseIdleTimeoutReturn {
  const { timeoutMs = 120000, warningMs = 15000, enabled = true } = options;

  const [showWarning, setShowWarning] = useState(false);
  const [warningSecondsLeft, setWarningSecondsLeft] = useState(Math.ceil(warningMs / 1000));

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);

  // Keep callback ref current
  onIdleRef.current = onIdle;

  const clearAllTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearInterval(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (warningEndRef.current) {
      clearTimeout(warningEndRef.current);
      warningEndRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    setWarningSecondsLeft(Math.ceil(warningMs / 1000));

    if (!enabled) return;

    idleTimerRef.current = setTimeout(() => {
      // Show warning
      setShowWarning(true);
      let secondsLeft = Math.ceil(warningMs / 1000);
      setWarningSecondsLeft(secondsLeft);

      // Countdown every second
      warningTimerRef.current = setInterval(() => {
        secondsLeft -= 1;
        setWarningSecondsLeft(secondsLeft);
        if (secondsLeft <= 0 && warningTimerRef.current) {
          clearInterval(warningTimerRef.current);
          warningTimerRef.current = null;
        }
      }, 1000);

      // Auto-reset after warning period
      warningEndRef.current = setTimeout(() => {
        setShowWarning(false);
        onIdleRef.current();
      }, warningMs);
    }, timeoutMs);
  }, [timeoutMs, warningMs, enabled, clearAllTimers]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    if (!enabled) {
      clearAllTimers();
      return;
    }

    const events = ['touchstart', 'touchmove', 'pointerdown', 'pointermove', 'mousemove', 'keydown'];

    const handleActivity = () => {
      // Only reset timer if warning is not showing
      if (!showWarning) {
        startIdleTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Start initial timer
    startIdleTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearAllTimers();
    };
  }, [enabled, startIdleTimer, clearAllTimers, showWarning]);

  return { showWarning, warningSecondsLeft, dismissWarning };
}
