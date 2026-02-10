from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils import get_db
from schema import EvaluateRequest, EvaluateResponse
from models import ModelAnswer, Result

from services.hybrid_ocr import hybrid_ocr
from services.scoring import semantic_score
from services.feedback import gen_feedback, missing_keywords

router = APIRouter(prefix="/eval", tags=["Evaluation"])


@router.post("/", response_model=EvaluateResponse)
def evaluate(req: EvaluateRequest, db: Session = Depends(get_db)):
    # 1) load model answer
    model_ans = db.query(ModelAnswer).filter(ModelAnswer.id == req.model_answer_id).first()
    if not model_ans:
        raise HTTPException(status_code=404, detail="Model answer not found")

    # 2) OCR
    extracted_text, engine, lang = hybrid_ocr(req.file_path)

    if not extracted_text or len(extracted_text.strip()) < 3:
        raise HTTPException(status_code=400, detail="OCR failed: no readable text found")

    # 3) semantic score
    score = semantic_score(extracted_text, model_ans.model_text)

    # 4) feedback + missing keywords
    fb = gen_feedback(score)
    missing = missing_keywords(extracted_text, model_ans.model_text)

    # 5) store in DB
    row = Result(
        file_path=req.file_path,
        extracted_text=extracted_text,
        ocr_engine=engine,
        language=lang,
        score=score,
        feedback=fb,
        missing_keywords=",".join(missing) if missing else None,
        model_answer_id=model_ans.id,
    )

    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "text": extracted_text,
        "score": score,
        "feedback": fb,
        "language": lang,
        "ocr_engine": engine,
        "missing_keywords": missing,
    }
