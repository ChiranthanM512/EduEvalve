import React, { useEffect, useState } from "react";
import API from "../api";

export default function ResultsTable() {
  const [rows, setRows] = useState([]);

  async function loadResults() {
    try {
      const res = await API.get("/results/");
      setRows(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load results");
    }
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/results/${id}`);
      alert("Deleted Successfully!");
      loadResults();
    } catch (err) {
      console.log(err);
      alert("Failed to delete");
    }
  }

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Evaluation History</h2>

        {rows.length === 0 ? (
          <p>No results yet.</p>
        ) : (
          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Score</th>
                <th>OCR Engine</th>
                <th>Language</th>
                <th>Feedback</th>
                <th>Extracted Text</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.score}</td>
                  <td>{r.ocr_engine}</td>
                  <td>{r.language}</td>
                  <td>{r.feedback}</td>
                  <td style={{ maxWidth: "350px" }}>{r.extracted_text}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{
                        background: "red",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <br />
        <button onClick={loadResults}>Refresh</button>
      </div>
    </div>
  );
}
