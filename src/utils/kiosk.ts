/**
 * Kiosk mode utilities for touchscreen kiosk lockdown.
 * Prevents pinch-zoom, pull-to-refresh, edge swipes, context menu, and text selection.
 */

function preventMultiTouch(e: TouchEvent) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}

function preventEdgeSwipe(e: TouchEvent) {
  const x = e.touches[0]?.clientX ?? 0;
  if (x < 20 || x > window.innerWidth - 20) {
    e.preventDefault();
  }
}

function preventDefault(e: Event) {
  e.preventDefault();
}

function preventKeyboardShortcuts(e: KeyboardEvent) {
  // Prevent Ctrl+/- zoom, Ctrl+R refresh, F5, etc.
  if (
    (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === 'r')) ||
    e.key === 'F5' ||
    e.key === 'F11'
  ) {
    e.preventDefault();
  }
}

export function enableKioskMode() {
  // Prevent overscroll (pull-to-refresh)
  document.body.style.overscrollBehavior = 'none';

  // Prevent pinch-zoom
  document.addEventListener('touchmove', preventMultiTouch, { passive: false });

  // Prevent edge swipe (back/forward navigation)
  document.addEventListener('touchstart', preventEdgeSwipe, { passive: false });

  // Prevent context menu (long press)
  document.addEventListener('contextmenu', preventDefault);

  // Prevent text selection
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';

  // Prevent keyboard shortcuts
  document.addEventListener('keydown', preventKeyboardShortcuts);

  // Request fullscreen (wrapped in try-catch for kiosk browsers that are already fullscreen)
  requestFullscreen();
}

export function disableKioskMode() {
  document.body.style.overscrollBehavior = '';
  document.removeEventListener('touchmove', preventMultiTouch);
  document.removeEventListener('touchstart', preventEdgeSwipe);
  document.removeEventListener('contextmenu', preventDefault);
  document.body.style.userSelect = '';
  document.body.style.webkitUserSelect = '';
  document.removeEventListener('keydown', preventKeyboardShortcuts);
}

function requestFullscreen() {
  try {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        // Fullscreen request failed — likely already in kiosk browser mode
      });
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  } catch {
    // Silently fail — kiosk browser may already be fullscreen
  }
}
