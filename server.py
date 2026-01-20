from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from chat.session import ChatSession
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = ChatSession(enable_tts=True)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    text: str
    audio_url: str | None = None

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    audio_path = Path("audio") / filename
    if not audio_path.exists():
        return {"error": "Audio not found"}, 404
    return FileResponse(
        audio_path,
        media_type="audio/wav",
        headers={
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    text, audio_path = session.send(request.message)
    
    audio_url = None
    if audio_path:
        audio_url = f"/{audio_path}"
    
    return ChatResponse(text=text, audio_url=audio_url)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

