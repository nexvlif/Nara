import os
import subprocess

def play_audio(file_path: str) -> None:
  try:
    subprocess.run(
      [
        "mpv",
        "--no-video",
        "--really-quiet",
        "--force-window=no",
        file_path
      ],
      check=False
    )
  finally:
    try:
      os.remove(file_path)
    except Exception as e:
      print(f"[AUDIO CLEANUP ERROR] {e}")