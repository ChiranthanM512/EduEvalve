import React from "react";

export default function Dashboard() {
  return (
    <div className="container">
      <div className="card">
        <h1>EduEvalve Dashboard</h1>
        <p>
          Use the navigation bar to:
        </p>
        <ul>
          <li>Create model answers</li>
          <li>Upload student sheets</li>
          <li>Evaluate using Hybrid OCR</li>
          <li>View score history</li>
        </ul>
      </div>
    </div>
  );
}
