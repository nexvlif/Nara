from groq import Groq
from core.config import nara_api_key, model_name, temperature, max_tokens
from groq.types.chat import ChatCompletionMessageParam
from typing import List, cast
from core.types import ChatMessage

class GroqClient: 
  def __init__(self):
    self.client = Groq(api_key=nara_api_key)

  def chat(self, messages: List[ChatMessage]) -> str:
    completion = self.client.chat.completions.create(
      model=model_name,
      messages=cast(List[ChatCompletionMessageParam], messages),
      temperature=temperature,
      max_tokens=max_tokens
    )
    content = completion.choices[0].message.content

    if content is None:
      raise RuntimeError("Qroq returned empty response")
    return content