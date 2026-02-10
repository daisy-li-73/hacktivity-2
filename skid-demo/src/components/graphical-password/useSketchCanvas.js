import { useCallback, useEffect, useRef } from "react";

function getCanvasPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  // Return CSS pixel coordinates (matches ctx.setTransform(dpr,...))
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y };
}

function initCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;

  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Normalize to CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 3;

  ctx.clearRect(0, 0, cssW, cssH);
  return ctx;
}

export function drawDataUrlToCanvas(canvas, dataUrl) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = new Image();
  img.onload = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
  };
  img.src = dataUrl;
}

export function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

export function snapshotCanvas(canvas) {
  // Save at display size (consistent across DPR changes)
  const tmp = document.createElement("canvas");
  tmp.width = canvas.clientWidth;
  tmp.height = canvas.clientHeight;
  const tctx = tmp.getContext("2d");
  if (!tctx) return null;
  tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
  return tmp.toDataURL("image/png");
}

/**
 * useSketchCanvas
 * - Handles pointer drawing on a canvas (when enabled)
 * - Resizes canvas on window resize and restores an optional saved image
 */
export function useSketchCanvas({ enabled, savedDataUrl, onInkChange }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ isDrawing: false, last: null });

  const resizeAndRestore = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    initCanvas(canvas);
    if (savedDataUrl) drawDataUrlToCanvas(canvas, savedDataUrl);
  }, [savedDataUrl]);

  useEffect(() => {
    resizeAndRestore();
  }, [resizeAndRestore]);

  useEffect(() => {
    window.addEventListener("resize", resizeAndRestore);
    return () => window.removeEventListener("resize", resizeAndRestore);
  }, [resizeAndRestore]);

  const onPointerDown = useCallback(
    (e) => {
      if (!enabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.setPointerCapture?.(e.pointerId);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = getCanvasPos(e, canvas);
      stateRef.current.isDrawing = true;
      stateRef.current.last = { x, y };

      // dot for tap
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();

      onInkChange?.(true);
    },
    [enabled, onInkChange]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!enabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const s = stateRef.current;
      if (!s.isDrawing) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = getCanvasPos(e, canvas);
      const last = s.last;
      if (!last) {
        s.last = { x, y };
        return;
      }

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      s.last = { x, y };
      onInkChange?.(true);
    },
    [enabled, onInkChange]
  );

  const endDrawing = useCallback(
    (e) => {
      if (!enabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        canvas.releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
      stateRef.current.isDrawing = false;
      stateRef.current.last = null;
    },
    [enabled]
  );

  return {
    canvasRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrawing,
      onPointerCancel: endDrawing,
      onPointerLeave: endDrawing,
    },
    resizeAndRestore,
  };
}