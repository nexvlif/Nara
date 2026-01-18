from deep_translator import GoogleTranslator

class TranslateService:
  def __init__(self) -> None:
    self.translator = GoogleTranslator(
      source='auto',
      target='ja'
    )
  
  def auto_to_jp(self, text: str) -> str:
    try:
      return self.translator.translate(text)
    except Exception as e:
      print(f"Translation failed: {e}")
      return text