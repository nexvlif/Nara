from chat.session import ChatSession
from utils.console import print_header
from utils.audio import play_audio

def main():
  print_header()
  session = ChatSession(enable_tts=True)

  while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
      print("Nara: okayy, see you later!")
      break

    # reply = session.send(user_input)
    text, audio = session.send(user_input)
    print(f"Nara: {text}\n")

    if audio:
      play_audio(audio)
    

if __name__ == "__main__":
  main()