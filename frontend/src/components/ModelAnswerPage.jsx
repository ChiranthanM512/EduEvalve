import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import eduImg from "../assets/image2.jpg";

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
      model_text: text,
    });

    setTitle("");
    setText("");
    loadAnswers();
  }

  async function updateAnswer() {
    if (!editTitle || !editText) return alert("Enter title and model answer!");

    await API.put(`/model-answers/${editing}`, {
      question_title: editTitle,
      model_text: editText,
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
      {/* ✅ TOP BANNER (Dashboard Style) */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "22px",
          alignItems: "center",
          padding: "22px",
          marginBottom: "22px",
        }}
      >
        {/* LEFT SIDE */}
        <div>
          <h1 style={{ margin: 0, fontSize: "34px", fontWeight: 800 }}>
            Create Model Answer 📘
          </h1>

          <p style={{ marginTop: "8px", fontSize: "15px", opacity: 0.85 }}>
            Add model answers to evaluate student responses using Hybrid OCR and
            semantic scoring.
          </p>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const el = document.getElementById("create-form");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            style={{ marginTop: "14px" }}
          >
            Start Creating
          </motion.button>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <img
            src={eduImg}
            alt="Education Banner"
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              borderRadius: "18px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ✅ CREATE FORM CARD */}
      <motion.div
        id="create-form"
        className="card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h2>Create Model Answer</h2>

        <label>Question Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Model Answer</label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <br />
        <br />

        <motion.button
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createAnswer}
        >
          Save Model Answer
        </motion.button>
      </motion.div>

      {/* ✅ TABLE CARD */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
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
                  <td style={{ maxWidth: "300px", wordWrap: "break-word" }}>
                    {a.model_text}
                  </td>
                  <td>
                    <motion.button
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startEdit(a)}
                      style={{ marginRight: "5px" }}
                    >
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => deleteAnswer(a.id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* ✅ EDIT CARD */}
      {editing && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            backgroundColor: "#f9f9f9",
            borderLeft: "4px solid #007bff",
          }}
        >
          <h2>Edit Model Answer</h2>

          <label>Question Title</label>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <label>Model Answer</label>
          <textarea
            rows={6}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <br />
          <br />

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={updateAnswer}
            style={{ marginRight: "5px" }}
          >
            Update Answer
          </motion.button>

          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={cancelEdit}
            style={{ backgroundColor: "#6c757d" }}
          >
            Cancel
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
