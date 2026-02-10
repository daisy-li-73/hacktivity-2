import React from "react";
import { clearCanvas, snapshotCanvas, useSketchCanvas } from "./useSketchCanvas";
import "./establishPassword.css";

export default function PasswordPanel({
  stepIndex,
  totalSteps,
  isActive,
  isLast,
  savedDataUrl,
  hasInk,
  setHasInk,
  onNext,
  onSubmit,
  onSaveSnapshot, // (stepIndex, dataUrl|null) => void
  canAdvance,
  submitEnabled,
}) {
  const { canvasRef, handlers } = useSketchCanvas({
    enabled: isActive,
    savedDataUrl,
    onInkChange: (v) => {
      if (!isActive) return;
      if (v && !hasInk) setHasInk(true);
    },
  });

  const handleClear = () => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    clearCanvas(canvas);
    setHasInk(false);
    onSaveSnapshot(stepIndex, null);
  };

  const saveCurrent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return snapshotCanvas(canvas);
  };

  const handleNext = () => {
    if (!isActive || !canAdvance) return;
    const dataUrl = saveCurrent();
    if (!dataUrl) return;
    onSaveSnapshot(stepIndex, dataUrl);
    onNext();
  };

  const handleSubmit = () => {
    if (!isActive || !submitEnabled) return;
    const dataUrl = saveCurrent();
    if (!dataUrl) return;
    onSaveSnapshot(stepIndex, dataUrl);
    onSubmit();
  };

  return (
    <div className="gp-card">
      <div className="gp-cardHeader">
        <span className="gp-cardHeaderText">
          Draw your password ({stepIndex + 1}/{totalSteps})
        </span>
      </div>

      <div className="gp-canvasWrap">
        <canvas
          ref={canvasRef}
          className={`gp-canvas ${isActive ? "isActive" : "isLocked"}`}
          aria-label={`Password drawing ${stepIndex + 1} of ${totalSteps}`}
          {...handlers}
        />
      </div>

      <div className="gp-actions">
        <button
          type="button"
          className="gp-btn gp-btnSecondary"
          onClick={handleClear}
          disabled={!isActive}
        >
          Clear
        </button>

        {!isLast ? (
          <button
            type="button"
            className="gp-btn gp-btnPrimary"
            onClick={handleNext}
            disabled={!isActive || !canAdvance}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="gp-btn gp-btnPrimary"
            onClick={handleSubmit}
            disabled={!isActive || !submitEnabled}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
