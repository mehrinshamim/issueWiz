# app/routers/issues.py
from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.issue_schemas import InputPayload
import json
from nlp.keyword_extractor import keyword_extractor
from nlp.file_match import keyword_matcher

router = APIRouter()

@router.post("/match-keywords", tags=["Issues"])
def match_keywords(payload: InputPayload):
    try:
        # Combine issue title and description for keyword extraction
        issue_text = f"{payload.issueDetails.title} {payload.issueDetails.description}"

        # Extract keywords
        extracted_keywords = keyword_extractor(issue_text)

        # Ensure keywords were extracted
        if not extracted_keywords:
            raise HTTPException(status_code=400, detail="No keywords could be extracted.")

        # Match keywords to files
        match_result = keyword_matcher(payload.dict(), extracted_keywords)

        # Parse match result if it's a JSON string
        if isinstance(match_result, str):
            match_result = json.loads(match_result)

        # Ensure the match result is valid
        if not isinstance(match_result, dict):
            raise HTTPException(status_code=500, detail="Invalid match result format.")

        return {"matchedFiles": match_result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
