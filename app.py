import threading
import os
import time
from colorama import Fore


def start_flask():
    exit_code = os.system("python backend.py")


def start_react():
    os.chdir("chatbot-frontend")
    exit_code = os.system("npm start")


if __name__ == "__main__":
    flask_thread = threading.Thread(target=start_flask)
    react_thread = threading.Thread(target=start_react)

    flask_thread.start()

    time.sleep(10)

    react_thread.start()

    flask_thread.join()
    react_thread.join()
