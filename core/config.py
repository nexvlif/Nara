import os
from dotenv import load_dotenv

load_dotenv()

nara_api_key = os.getenv("API_KEY")
model_name = "llama-3.3-70b-versatile"


temperature = 0.7
max_tokens = 200

# TTS Configuration
# Available modes: "groq", "edge", "hf", "off"
tts_mode = "groq"

# Groq TTS Settings
groq_tts_model = "canopylabs/orpheus-v1-english"

# Voice options for Orpheus:
# - diana: Female
# - autumn: Female
# - hannah: Female
# - austin: Male
# - daniel: Male
# - troy: Male
groq_tts_voice = "diana"