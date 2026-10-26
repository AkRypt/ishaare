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

// Handling swipe events (refs avoid stale state between touchstart/end)
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
  const endX = useRef(0);
  const active = useRef(true);

  useEffect(() => {
    active.current = !gameOver && !loading;
  }, [gameOver, loading]);

  useEffect(() => {
    const touchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].screenX;
      endX.current = e.touches[0].screenX;
    };

    const touchMove = (e: TouchEvent) => {
      endX.current = e.touches[0].screenX;
    };

    const touchEnd = () => {
      if (!active.current) return;
      const delta = endX.current - startX.current;
      if (Math.abs(delta) < 50) {
        startX.current = 0;
        endX.current = 0;
        return;
      }
      if (delta < 0) {
        skipFunc();
      } else {
        correctFunc();
      }
      startX.current = 0;
      endX.current = 0;
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
