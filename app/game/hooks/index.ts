import { useCallback, useEffect, useRef } from "react";

// Handling keyboard inputs
export function keyboardHandler({
  gameOver,
  isMobile,
  correctFunc,
  skipFunc,
}: {
  gameOver: boolean;
  isMobile: boolean;
  correctFunc: () => void;
  skipFunc: () => void;
}) {
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;
      if (isMobile) return;

      if (e.key === "Enter") {
        correctFunc();
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        skipFunc();
      }
    },
    [gameOver, isMobile, correctFunc, skipFunc]
  );

  useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);
}

// Preventing reload on swipe
export function preventReload() {
  useEffect(() => {
    document.body.style.overscrollBehaviorY = "contain";
    return () => {
      document.body.style.overscrollBehaviorY = "auto";
    };
  }, []);
}

const SWIPE_THRESHOLD = 50;

function isLandscapeOrientation() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: landscape)").matches;
}

// Portrait: up = skip, down = correct
// Landscape: left = skip, right = correct
export function swipeHandler({
  gameOver,
  loading,
  correctFunc,
  skipFunc,
}: {
  gameOver: boolean;
  loading: boolean;
  correctFunc: () => void;
  skipFunc: () => void;
}) {
  const startX = useRef(0);
  const startY = useRef(0);
  const endX = useRef(0);
  const endY = useRef(0);
  const active = useRef(true);

  useEffect(() => {
    active.current = !gameOver && !loading;
  }, [gameOver, loading]);

  useEffect(() => {
    const touchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX.current = t.screenX;
      startY.current = t.screenY;
      endX.current = t.screenX;
      endY.current = t.screenY;
    };

    const touchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      endX.current = t.screenX;
      endY.current = t.screenY;
    };

    const touchEnd = () => {
      if (!active.current) return;

      const dx = endX.current - startX.current;
      const dy = endY.current - startY.current;
      const landscape = isLandscapeOrientation();

      if (landscape) {
        if (Math.abs(dx) < SWIPE_THRESHOLD) {
          startX.current = 0;
          startY.current = 0;
          endX.current = 0;
          endY.current = 0;
          return;
        }
        if (dx < 0) {
          skipFunc();
        } else {
          correctFunc();
        }
      } else {
        if (Math.abs(dy) < SWIPE_THRESHOLD) {
          startX.current = 0;
          startY.current = 0;
          endX.current = 0;
          endY.current = 0;
          return;
        }
        // screenY decreases upward → negative dy = swipe up = skip
        if (dy < 0) {
          skipFunc();
        } else {
          correctFunc();
        }
      }

      startX.current = 0;
      startY.current = 0;
      endX.current = 0;
      endY.current = 0;
    };

    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: true });
    window.addEventListener("touchend", touchEnd);
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [correctFunc, skipFunc]);
}
