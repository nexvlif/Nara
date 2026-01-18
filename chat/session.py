from services.groq_client import GroqClient
from core.persona import NARA_PERSONALITY
from services.tts_factory import create_tts_service
from core.types import ChatMessage
from typing import Optional, Tuple
from services.translate_service import TranslateService

class ChatSession:
  def __init__(self, enable_tts: bool = False) -> None:
    self.groq = GroqClient()
    self.translator = TranslateService()
    self.tts = create_tts_service()
    self.messages: list[ChatMessage] = [
      {"role": "system", "content": NARA_PERSONALITY}
    ]

    self.enable_tts = enable_tts
    # self.tts: Optional[TTSService] = TTSService() if enable_tts else None
  
  def send(self, user_input: str) -> tuple[str, Optional[str]]:
    self.messages.append(
      {"role": "user", "content": user_input}
    )

    response = self.groq.chat(self.messages)

    self.messages.append(
      {"role": "assistant", "content": response}
    )

    audio_path: Optional[str] = None
    if self.enable_tts and self.tts:
      jp_text = self.translator.auto_to_jp(response)
      audio_path = self.tts.speak(jp_text)

    return response, audio_path