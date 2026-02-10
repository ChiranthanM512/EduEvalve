from sentence_transformers import SentenceTransformer, util

# multilingual SBERT model (works for many languages)
embedder = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")


def semantic_score(student_text: str, model_text: str) -> float:
    # Embeddings
    emb1 = embedder.encode(student_text, convert_to_tensor=True)
    emb2 = embedder.encode(model_text, convert_to_tensor=True)

    # Similarity (0 to 1)
    sim = util.cos_sim(emb1, emb2).item()
    sim = max(0.0, min(sim, 1.0))

    # Convert to 0–100
    base_score = sim * 100

    # ---- Length Ratio Adjustment ----
    length_ratio = min(len(student_text) / max(len(model_text), 1), 1.0)

    # Meaning based score + small completeness factor
    final_score = base_score * (0.6 + 0.4 * length_ratio)

    return round(final_score, 2)
