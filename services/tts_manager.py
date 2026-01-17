class TTSManager:
  def __init__(self, primary, fallback = None):
    self.primary = primary
    self.fallback = fallback

  def speak(self, text: str) -> str | None:
    try: 
      return self.primary.speak(text)
    except Exception as e:
      print(f"[TTS Primary Failed] {e}")

      if self.fallback:
        print("[TTS] switching to fallback")
        return self.fallback.speak(text)
      return None