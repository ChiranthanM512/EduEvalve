import React, { useEffect, useState } from "react";
import API from "../api";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [modelAnswers, setModelAnswers] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [output, setOutput] = useState(null);

  async function loadModelAnswers() {
    const res = await API.get("/model-answers/");
    setModelAnswers(res.data);
  }

  async function uploadAndEval() {
    try {
      if (!file) return alert("Upload an answer sheet first!");
      if (!selectedModel) return alert("Select a model answer!");

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await API.post("/files/upload", formData);
      const path = uploadRes.data.path;

      const evalRes = await API.post("/eval/", {
        file_path: path,
        model_answer_id: parseInt(selectedModel)
      });

      setOutput(evalRes.data);
    } catch (err) {
      alert(err?.response?.data?.detail || "Evaluation failed");
    }
  }

  useEffect(() => {
    loadModelAnswers();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Upload & Evaluate</h2>

        <label>Upload Answer Sheet (JPG/PNG/PDF)</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <label>Select Model Answer</label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="">-- Select --</option>
          {modelAnswers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id} - {m.question_title}
            </option>
          ))}
        </select>

        <br /><br />
        <button onClick={uploadAndEval}>Evaluate</button>
      </div>

      {output && (
        <div className="card">
          <h2>Evaluation Output</h2>

          <p><b>OCR Engine:</b> {output.ocr_engine}</p>
          <p><b>Language:</b> {output.language}</p>
          <p><b>Score:</b> {output.score}</p>
          <p><b>Feedback:</b> {output.feedback}</p>

          <p><b>Extracted Text:</b></p>
          <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
            {output.text}
          </div>

          {output.missing_keywords?.length > 0 && (
            <>
              <p><b>Missing Keywords:</b></p>
              <ul>
                {output.missing_keywords.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
