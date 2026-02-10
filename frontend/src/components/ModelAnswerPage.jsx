import React, { useEffect, useState } from "react";
import API from "../api";

export default function ModelAnswerPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  async function loadAnswers() {
    const res = await API.get("/model-answers/");
    setAnswers(res.data);
  }

  async function createAnswer() {
    if (!title || !text) return alert("Enter title and model answer!");

    await API.post("/model-answers/", {
      question_title: title,
      model_text: text
    });

    setTitle("");
    setText("");
    loadAnswers();
  }

  async function updateAnswer() {
    if (!editTitle || !editText) return alert("Enter title and model answer!");

    await API.put(`/model-answers/${editing}`, {
      question_title: editTitle,
      model_text: editText
    });

    setEditing(null);
    setEditTitle("");
    setEditText("");
    loadAnswers();
  }

  async function deleteAnswer(id) {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    await API.delete(`/model-answers/${id}`);
    loadAnswers();
  }

  function startEdit(answer) {
    setEditing(answer.id);
    setEditTitle(answer.question_title);
    setEditText(answer.model_text);
  }

  function cancelEdit() {
    setEditing(null);
    setEditTitle("");
    setEditText("");
  }

  useEffect(() => {
    loadAnswers();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Create Model Answer</h2>

        <label>Question Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Model Answer</label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <br /><br />
        <button onClick={createAnswer}>Save Model Answer</button>
      </div>

      <div className="card">
        <h2>Saved Model Answers</h2>

        {answers.length === 0 ? (
          <p>No model answers created yet.</p>
        ) : (
          <table border="1" cellPadding="10" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Question Title</th>
                <th>Model Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.question_title}</td>
                  <td style={{ maxWidth: "300px", wordWrap: "break-word" }}>{a.model_text}</td>
                  <td>
                    <button onClick={() => startEdit(a)} style={{ marginRight: "5px" }}>Edit</button>
                    <button onClick={() => deleteAnswer(a.id)} style={{ color: "red" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="card" style={{ backgroundColor: "#f9f9f9", borderLeft: "4px solid #007bff" }}>
          <h2>Edit Model Answer</h2>

          <label>Question Title</label>
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />

          <label>Model Answer</label>
          <textarea
            rows={6}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <br /><br />
          <button onClick={updateAnswer} style={{ marginRight: "5px" }}>Update Answer</button>
          <button onClick={cancelEdit} style={{ backgroundColor: "#6c757d" }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
