import os
import pygame
import time

pygame.mixer.init()

def play_audio(file_path):
  pygame.mixer.music.load(file_path)
  pygame.mixer.music.play()

  while pygame.mixer.music.get_busy():
    time.sleep(0.1)

  pygame.mixer.music.stop()
  pygame.mixer.music.unload()

  try: 
    os.remove(file_path)
  except Exception as e:
    print(f"[AUDIO CLEANUP FAILED] {e}")