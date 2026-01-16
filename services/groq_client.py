from groq import Groq
from core.config import nara_api_key, model_name, temperature, max_tokens

class GroqClient: 
  def __init__(self):
    self.client = Groq(api_key=nara_api_key)

  def chat(self, messages):
    completion = self.client.chat.completions.create(
      model=model_name,
      messages=messages,
      temperature=temperature,
      max_tokens=max_tokens
    )
    return completion.choices[0].message.content