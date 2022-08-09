from django.core.management.base import BaseCommand
import telebot
from telebot import apihelper, types  # Нужно для работы Proxy

from iservicepro.settings import TOKEN, proxy
from tgbot.models import Profile, Message
from siteservice.models import Phone
from siteservice import keyboard as kb

import urllib.request  # request нужен для загрузки файлов от пользователя

bot = telebot.TeleBot(TOKEN)  # Передаём токен из файла config.py
apihelper.proxy = {'http': proxy}  # Передаём Proxy из файла config.py

print(bot.get_me())

user_repear = ['ремонт', 'починить', 'отремонтировать', 'почистить', 'замена', 'заменить']
user_buy = ['покупка', 'купить', 'покупать']
user_sale = ['продать', 'продажа', 'продаю', 'продавать']
user_other = ['другое']


def log_errors(f):
    def inner(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            error_message = f'Произошла ошибка: {e}'
            print(error_message)
            raise e

    return inner


# Тут работаем с командой start
@bot.message_handler(commands=['start'])
def welcome_start(message):
    user_name = message.from_user.first_name
    chat_id = message.chat.id
    try:
        # Добавляем пользователя после запуска бота
        profile, _ = Profile.objects.get_or_create(external_id=chat_id, defaults={'name': message.from_user.first_name})
        user_id = Message(profile=profile)
        user_id.save()
        #print('Логин добавлен')
        bot.send_message(message.chat.id, f'Приветствую вас {user_name}', reply_markup=kb.markup_menu)

    except Exception as m:
        error_message = f'Произошла ошибка: {m}'
        print(error_message)
        raise m


# Тут улавливает тексты пользователей
@bot.message_handler(content_types=["text"])
def text(message):
    chat_id = message.chat.id
    text_user = message.text.lower()
    if text_user in user_buy:
        bot.send_message(chat_id, text="Прайc на Apple", reply_markup=kb.inline_kb_sale_menu)

    elif text_user in user_repear:
        bot.send_message(chat_id, text='Я так понимаю вас интересует ремонт, мы работаем над этим')

    elif text_user in user_sale:
        bot.send_message(chat_id, text='Я так понимаю вы хотите что-то продать, мы работаем над этим')

    elif text_user in user_other:
        bot.send_message(chat_id, text='Если не нашли то, что вам нужно вы можете написать:\n @leaderisaev')

    else:
        bot.send_message(chat_id, text='А вот это мне не знакомо, пожалуй запомню ☺️')
        try:
            # Передаем текст пользователя в бд
            user_name, _ = Profile.objects.get_or_create(external_id=chat_id,
                                                         defaults={'name': message.from_user.first_name})
            user_message = Message(profile=user_name, text=text_user)
            user_message.save()
            print(message.text)
        # Улавливаем ошибки
        except Exception as m:
            error_message = f'Произошла ошибка: {m}'
            print(error_message)
            raise m


@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    try:
        if call.message:
            if call.data == 'sale_new_iphone':
                bot.send_message(call.message.chat.id, text="iPhone",
                                 reply_markup=kb.inline_kb_chose_new_model_iphone)
            elif call.data == 'sale_iphone13':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name=f'13')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, text=f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone13pro':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='13 Pro')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone13promax':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='13 Pro Max')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)


            elif call.data == 'sale_iphone13mini':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='13 Mini')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_12promax':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='12 Pro Max')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_12pro':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='12 Pro')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_12':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='12')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_12mini':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='12 Mini')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_se2':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='SE (2-го поколения)')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_11pro':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='11 Pro')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_11promax':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='11 Pro Max')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_11':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='11')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_xs':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='XS')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'iPhone_xsmax':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='XS Max')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_xr':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='XR')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_x':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='X')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_8':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='8')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_8plus':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='8 Plus')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_7':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='7')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_7plus':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='7 Plus')
                    if not model:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)

            elif call.data == 'sale_iphone_se1':
                try:
                    model = Phone.objects.filter(model_phone__iphone_name='SE (1-го поколения)')
                    if Phone.status[0]:
                        bot.send_message(call.message.chat.id, 'Увы! Пока в наличии нет')
                    else:
                        bot.send_message(call.message.chat.id, 'Отлично! Отправляю прайс')
                        for item in model:
                            bot.send_message(call.message.chat.id, f'iPhone {item}')
                except Phone.DoesNotExist as s:
                    print(s)
            else:
                bot.send_message(call.message.chat.id, 'Мы работаем над этим 🤧')

    except Exception as e:
        bot.send_message(call.message.chat.id, 'Упс 🤧 что-то не работает ⚙️')
        print(repr(e))


class Command(BaseCommand):
    help = 'Телеграм-бот'
    def handle(self, *args, **options):
        try:
            bot.polling(none_stop=True, timeout=123, interval=2)
        except Exception as e:
            print(f'Error {e}')


# __gt для сравнений если больше
# __ls если меньше
# __gte больше или равно
# exclude не равно
# __isnull true or false