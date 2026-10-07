# StudyWithAI

StudyWithAI is an AI-powered study assistant website built with FastAPI, HTML, CSS, and JavaScript.

## Features

- AI Tutor chat
- Step-by-step problem solver
- AI notes generator
- Practice quiz prompts
- Study planner
- Progress tracking
- Responsive design
- Demo mode without an API key

## Technologies

- Python
- FastAPI
- HTML
- CSS
- JavaScript
- OpenAI API

## Run locally

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install packages:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
python -m uvicorn main:app --reload --port 8001
```

Open this address in your browser:

```text
http://127.0.0.1:8001
```

## API key

Copy `.env.example` and rename the copy to `.env`.

Then add your API key:

```text
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Never upload `.env` to GitHub.