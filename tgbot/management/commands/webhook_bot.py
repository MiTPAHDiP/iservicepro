import json

import requests
from django.core.management.base import BaseCommand
import telebot
from django.conf import settings

URL = 'https://api.telegram.org/bot1689112007:AAEujiNAdtUsZkoH86_dfPF15M6NIuhM4FU/'



def get_updates():
    url = URL + 'getUpdates'
    r = requests.get(url)
    write_json(r.json())

# Записываем полученый json в файл
def write_json(data, filename='answer.json'):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def send_message(chat_id, text):
    url = URL + 'sendMessage'


# Функция для гет запрос боту по url
def main():
    r = requests.get(URL + 'getMe')
    # Вызывает метод json передаем r
    write_json(r.json())
    get_updates()


if __name__ == '__main__':
    main()

