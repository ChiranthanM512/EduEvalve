from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)


class ModelAnswer(Base):
    __tablename__ = "model_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_title = Column(String(255), nullable=False)
    model_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    results = relationship("Result", back_populates="model_answer")


class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)

    # file info
    file_path = Column(String(500), nullable=False)

    # extracted output
    extracted_text = Column(Text, nullable=False)
    ocr_engine = Column(String(50), nullable=False)  # "trocr" or "paddle"
    language = Column(String(30), nullable=False)

    # scoring
    score = Column(Float, nullable=False)
    feedback = Column(Text, nullable=False)

    # keywords
    missing_keywords = Column(Text, nullable=True)

    # relationship
    model_answer_id = Column(Integer, ForeignKey("model_answers.id"))
    model_answer = relationship("ModelAnswer", back_populates="results")

    created_at = Column(DateTime, default=datetime.utcnow)
