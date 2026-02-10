import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/app.css";

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <div className="pg">
      <h1 className="pg-title">Landing Page</h1>

      <div className="lp-card">
        <div className="lp-col">
          <div className="lp-question">Already signed up?</div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              // ignored for now (no-op)
            }}
          >
            Login with SkiD
          </button>
        </div>

        <div className="lp-divider" />

        <div className="lp-col">
          <div className="lp-question">Need to make an account?</div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => nav("/signup")}
          >
            Signup with SkiD
          </button>
        </div>
      </div>
    </div>
  );
}
