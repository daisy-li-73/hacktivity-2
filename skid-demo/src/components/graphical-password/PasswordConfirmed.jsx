import React from "react";
import "./establishPassword.css";

export default function PasswordConfirmed({ onRestart }) {
  return (
    <div className="gp-page">
      <h1 className="gp-title">Password confirmed</h1>

      <div className="gp-confirmCard" role="status" aria-live="polite">
        <div className="gp-confirmIcon" aria-hidden="true">✓</div>
        <div className="gp-confirmText">
          Your graphical password has been saved.
        </div>

        {onRestart ? (
          <button className="gp-btn gp-btnPrimary gp-confirmBtn" onClick={onRestart}>
            Draw again
          </button>
        ) : null}
      </div>
    </div>
  );
}