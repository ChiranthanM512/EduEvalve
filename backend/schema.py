from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ---------- AUTH ----------
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=4, max_length=128)



class Login(BaseModel):
    username: str
    password: str


# ---------- MODEL ANSWERS ----------
class ModelAnswerCreate(BaseModel):
    question_title: str
    model_text: str


class ModelAnswerOut(BaseModel):
    id: int
    question_title: str
    model_text: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- EVALUATION ----------
class EvaluateRequest(BaseModel):
    file_path: str
    model_answer_id: int


class EvaluateResponse(BaseModel):
    text: str
    score: float
    feedback: str
    language: str
    ocr_engine: str
    missing_keywords: Optional[List[str]] = None


# ---------- RESULTS ----------
class ResultOut(BaseModel):
    id: int
    file_path: str
    extracted_text: str
    score: float
    feedback: str
    language: str
    ocr_engine: str
    missing_keywords: Optional[str]
    model_answer_id: int
    created_at: datetime

    class Config:
        from_attributes = True
from pydantic import BaseModel



# ✅ ADD THIS
class ModelAnswerUpdate(BaseModel):
    question_title: str
    model_text: str
