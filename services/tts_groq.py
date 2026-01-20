import uuid
from pathlib import Path
from groq import Groq, BadRequestError
from core.config import nara_api_key, groq_tts_model, groq_tts_voice

AUDIO_DIR = Path("audio")
AUDIO_DIR.mkdir(exist_ok=True)


class GroqTTSService:    
    def __init__(self):
        self.client = Groq(api_key=nara_api_key)
        self.model = groq_tts_model
        self.voice = groq_tts_voice
    
    def speak(self, text: str) -> str:
        path = AUDIO_DIR / f"nara_{uuid.uuid4().hex}.wav"
        
        try:
            response = self.client.audio.speech.create(
                model=self.model,
                voice=self.voice,
                input=text,
                response_format="wav"
            )
        except BadRequestError as e:
            if "terms" in str(e).lower():
                print(f"\n\n\033[91m[Groq TTS Error] You need to accept the terms of service for the model '{self.model}'.\033[0m")
                print(f"\033[93mPlease visit this URL to accept them:\033[0m")
                print(f"https://console.groq.com/playground?model={self.model.replace('/', '%2F')}\n")
            raise e
        
        response.write_to_file(path)
        return str(path)
