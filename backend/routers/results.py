from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from utils import get_db
from models import Result
from schema import ResultOut

router = APIRouter(prefix="/results", tags=["Results"])


@router.get("/", response_model=List[ResultOut])
def get_all(db: Session = Depends(get_db)):
    return db.query(Result).order_by(Result.id.desc()).all()

@router.delete("/{result_id}")
def delete_result(result_id: int, db: Session = Depends(get_db)):
    result = db.query(Result).filter(Result.id == result_id).first()

    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    db.delete(result)
    db.commit()

    return {"message": "Deleted successfully"}