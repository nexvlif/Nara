import shutil
import time
import uuid
from pathlib import Path
from gradio_client import Client
from typing import Optional


AUDIO_DIR = Path("audio")
AUDIO_DIR.mkdir(exist_ok=True)

class TTSService:
  def __init__(self) -> None:
    self.client = Client("Plachta/VITS-Umamusume-voice-synthesizer", httpx_kwargs={"timeout": 60.0})

    self.default_speaker = "特别周 Special Week (Umamusume Pretty Derby)"
  
  def speak(
      self, 
      text: str,
      speaker: Optional[str] = None,
      language: str = "日本語",
      speed: float = 1.0,
  ) -> str:
    for attempt in range(3):
      try:
        result = self.client.predict(
          text=text,
          speaker=speaker or self.default_speaker,
          language=language,
          is_symbol=False,
          api_name="/tts_fn"
        )

        _, gradio_audio_path = result
        if not gradio_audio_path:
          raise RuntimeError("No audio file returned from TTS service")
        
        local_path = AUDIO_DIR / f"nara_{uuid.uuid4().hex}.wav"
        shutil.copy(gradio_audio_path, local_path)
        return str(local_path)
      
      except Exception as e:
        print(f"TTS attempt {attempt + 1} failed: {e}")
        time.sleep(1)

    raise RuntimeError("TTS synthesis failed after 3 attempts")