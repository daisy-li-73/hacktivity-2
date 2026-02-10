import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/app.css";

export default function CreateAccountPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const canProceed = username.trim().length > 0 && email.trim().length > 0;

  return (
    <div className="pg">
      <div className="ca-card">
        <h1 className="ca-title">Create an account</h1>

        <div className="ca-field">
          <input
            className="ca-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="ca-field">
          <input
            className="ca-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary ca-btn"
          type="button"
          disabled={!canProceed}
          onClick={() => {
            // frontend-only: keep it for demo
            localStorage.setItem("skid_signup", JSON.stringify({ username, email }));
            nav("/signup/password"); // goes to the 1st of 5 canvas pages
          }}
        >
          Create your password
        </button>
      </div>
    </div>
  );
}