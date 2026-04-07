# backend/backend.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

import search_core

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        search_core.load_index_and_chain()
        print("✅ Backend is ready.")
    except Exception as e:
        print("⚠️ Failed to load data:", e)
    yield


app = FastAPI(title="ASK_MAJOR API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CourseIn(BaseModel):
    course_code: str


class CourseOut(BaseModel):
    Credits: str
    prerequisites: str
    description: str


@app.get("/api/health")
def health():
    return {"status": "ok" if search_core.is_index_ready() else "not_ready"}


@app.post("/api/course", response_model=CourseOut)
def course(payload: CourseIn):
    if not search_core.is_index_ready():
        raise HTTPException(status_code=503, detail="Course data is not ready.")

    data = search_core.find_by_course_code(payload.course_code or "")
    ans = data.get("answer", {}) if isinstance(data, dict) else {}

    return CourseOut(
        Credits=ans.get("Credits", "") or "",
        prerequisites=ans.get("prerequisites", "") or "",
        description=ans.get("description", "") or "",
    )