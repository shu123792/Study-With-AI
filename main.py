import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="StudyWithAI")

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)


class ChatRequest(BaseModel):
    message: str
    subject: str = "General"


def demo_answer(message: str, subject: str) -> str:
    return f"""
## StudyWithAI Demo Answer

**Subject:** {subject}

Your question was:

> {message}

### Explanation

1. Read the question carefully.
2. Identify the important information.
3. Select the correct formula or concept.
4. Solve the problem step by step.
5. Check whether your final answer makes sense.

### Exam Tip

Write every important step clearly. This helps you receive marks even if the final answer has a small mistake.

This is a demo answer. Add an OpenAI API key to receive real AI-generated explanations.
"""


def ask_ai(message: str, subject: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return demo_answer(message, subject)

    try:
        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            instructions=(
                "You are StudyWithAI, a helpful academic tutor. "
                "Explain answers clearly and step by step. "
                "Use simple language. Do not help with cheating in exams. "
                "For mathematics and physics, show formulas and calculations."
            ),
            input=f"Subject: {subject}\nStudent question: {message}"
        )

        return response.output_text

    except Exception as error:
        return f"AI connection error: {error}"


@app.get("/")
def home():
    return FileResponse(BASE_DIR / "templates" / "index.html")


@app.get("/api/health")
def health():
    return {"status": "online", "app": "StudyWithAI"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    if not request.message.strip():
        return JSONResponse(
            status_code=400,
            content={"error": "Please write a question first."}
        )

    answer = ask_ai(request.message, request.subject)

    return {
        "answer": answer,
        "subject": request.subject
    }