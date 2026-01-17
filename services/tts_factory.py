from core.config import tts_mode
from services.tts_service import TTSService
from services.tts_edge import EdgeTTSService
from services.tts_manager import TTSManager

def create_tts_service():
    if tts_mode == "off":
        return None
    if tts_mode == "edge":
        return EdgeTTSService()
    if tts_mode == "hf":
        return TTSService()
    return TTSManager(
        primary=EdgeTTSService(),
        fallback=TTSService()
    )