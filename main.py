from chat.session import ChatSession
from utils.console import print_header


def main():
  print_header()
  session = ChatSession()

  while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
      print("Nara: okayy, see you later!")
      break

    reply = session.send(user_input)
    print(f"Nara: {reply}\n")

if __name__ == "__main__":
  main()