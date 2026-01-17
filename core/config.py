import os
from dotenv import load_dotenv

load_dotenv()

nara_api_key = os.getenv("API_KEY")
model_name = "llama-3.3-70b-versatile"


temperature = 0.7
max_tokens = 200

tts_mode = "edge" #hf #off