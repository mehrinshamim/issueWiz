# app/schemas/issue.py
from pydantic import BaseModel
from typing import List

class File(BaseModel):
    name: str
    path: str
    download_url: str

class IssueDetails(BaseModel):
    title: str
    description: str

class InputPayload(BaseModel):
    owner: str
    repo: str
    filteredFiles: List[File]
    issueDetails: IssueDetails
