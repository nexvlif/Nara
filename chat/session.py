from services.groq_client import GroqClient
from core.persona import NARA_PERSONLITY

class ChatSession:
  def __init__(self):
    self.groq = GroqClient()
    self.messages = [
      {"role": "system", "content": NARA_PERSONLITY}
    ]
  
  def send(self, user_input: str) -> str:
    self.messages.append(
      {"role": "user", "content": user_input}
    )

    response = self.groq.chat(self.messages)

    self.messages.append(
      {"role": "assistant", "content": response}
    )

    return response