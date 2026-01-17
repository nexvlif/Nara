import asyncio
import uuid
from pathlib import Path
import edge_tts

AUDIO_DIR = Path("audio")
AUDIO_DIR.mkdir(exist_ok=True)

class EdgeTTSService:
  VOICE = "ja-JP-NanamiNeural"

  async def _speak_async(self, text: str) -> str:
    path = AUDIO_DIR / f"nara_{uuid.uuid4().hex}.mp3"
    tts = edge_tts.Communicate(text, self.VOICE)
    await tts.save(str(path))
    return str(path)
  
  def speak(self, text: str) -> str:
    return asyncio.run(self._speak_async(text))