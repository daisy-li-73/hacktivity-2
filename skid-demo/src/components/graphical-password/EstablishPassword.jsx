import React, { useMemo, useState } from "react";
import PasswordPanel from "./PasswordPanel";
import PasswordConfirmed from "./PasswordConfirmed";
import "./establishPassword.css";

const STEPS = 5;

export default function EstablishPassword({ onComplete }) {
  const title = useMemo(() => "Establish Password", []);

  const [screen, setScreen] = useState("draw"); // "draw" | "confirmed"
  const [currentStep, setCurrentStep] = useState(0);

  const [saved, setSaved] = useState(Array(STEPS).fill(null)); // dataURL per step
  const [hasInk, setHasInk] = useState(Array(STEPS).fill(false)); // per step

  const updateHasInk = (idx, v) => {
    setHasInk((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
  };

  const saveSnapshot = (idx, dataUrlOrNull) => {
    setSaved((prev) => {
      const next = [...prev];
      next[idx] = dataUrlOrNull;
      return next;
    });
  };

  const handleNext = () => {
    // advance only if current step has a saved drawing
    setCurrentStep((s) => Math.min(STEPS - 1, s + 1));
  };

  const handleSubmit = () => {
    const complete = saved.every(Boolean);
    if (!complete) return;

    onComplete?.(saved);
    setScreen("confirmed");
  };

  const restart = () => {
    setScreen("draw");
    setCurrentStep(0);
    setSaved(Array(STEPS).fill(null));
    setHasInk(Array(STEPS).fill(false));
  };

  if (screen === "confirmed") {
    return <PasswordConfirmed onRestart={restart} />;
  }

  return (
    <div className="gp-page">
      <h1 className="gp-title">{title}</h1>

      <div className="gp-row" role="group" aria-label="Draw password five times">
        {Array.from({ length: STEPS }).map((_, i) => {
          const isActive = i === currentStep;
          const isLast = i === STEPS - 1;

          return (
            <PasswordPanel
              key={i}
              stepIndex={i}
              totalSteps={STEPS}
              isActive={isActive}
              isLast={isLast}
              savedDataUrl={saved[i]}
              hasInk={hasInk[i]}
              setHasInk={(v) => updateHasInk(i, v)}
              onSaveSnapshot={saveSnapshot}
              onNext={handleNext}
              onSubmit={handleSubmit}
              // controls for enabling buttons
              canAdvance={hasInk[i]}
              submitEnabled={hasInk[i] && saved.slice(0, STEPS - 1).every(Boolean)}
            />
          );
        })}
      </div>
    </div>
  );
}
