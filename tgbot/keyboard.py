import types

from telebot.types import KeyboardButton, ReplyKeyboardMarkup, InlineKeyboardButton, InlineKeyboardMarkup
from siteservice import models

# btn_folower = KeyboardButton('Подписка')
from siteservice.models import iPhone

button1 = KeyboardButton('Ремонт ')
button2 = KeyboardButton('Покупка')
button3 = KeyboardButton('Продажа')
button4 = KeyboardButton('Другое')
markup_menu = ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
markup_menu.add(button1, button2, button3, button4)

btn_add_price = KeyboardButton('Обновить')
add_price_btn = ReplyKeyboardMarkup(resize_keyboard=True).add(btn_add_price)

"""Инлайн кнопки для меню покупки тел"""
inline_btn_iphone = InlineKeyboardButton('iPhone', callback_data='sale_new_iphone')
inline_btn_ipad = InlineKeyboardButton('iPad', callback_data='sale_new_ipad')
inline_btn_macbook = InlineKeyboardButton('MacBook', callback_data='sale_new_macbook')
inline_btn_airpods = InlineKeyboardButton('AirPods', callback_data='sale_new_airpods')
inline_btn_apple_watch = InlineKeyboardButton('Apple Watch', callback_data='sale_new_watch')
inline_btn_pencil = InlineKeyboardButton('Apple Pencil 2', callback_data='sale_new_pencil')
inline_btn_macsafe = InlineKeyboardButton('Apple MacSafe', callback_data='sale_new_macsafe')
inline_btn_20w = InlineKeyboardButton('Apple 20W USB-C Power', callback_data='sale_new_adapter20w')
# inline_btn_samsung = InlineKeyboardButton('Samsung', callback_data='sale_new_samsa')
# inline_btn_xiaomi = InlineKeyboardButton('Xiaomi', callback_data='sale_new_xiaomi')
# inline_btn_huawei = InlineKeyboardButton('Huawei', callback_data='sale_new_huawei')
# inline_btn_back = InlineKeyboardButton('Назад', callback_data='button_back')
inline_kb_sale_menu = InlineKeyboardMarkup(row_width=2).add(inline_btn_iphone, inline_btn_ipad, inline_btn_macbook,
                                                            inline_btn_airpods, inline_btn_apple_watch,
                                                            inline_btn_pencil,
                                                            inline_btn_macsafe, inline_btn_20w)

"""Инлайн кнопки для меню покупки тел"""
inline_iphone_14 = InlineKeyboardButton('iPhone 14', callback_data='sale_iphone14')
inline_iphone_14max = InlineKeyboardButton('iPhone 14 Max', callback_data='sale_iphone14max')
inline_iphone_14pro = InlineKeyboardButton('iPhone 14 Pro', callback_data='sale_iphone14pro')
inline_iphone_14promax = InlineKeyboardButton('iPhone 14 Pro Max', callback_data='sale_iphone14promax')
inline_iphone_13 = InlineKeyboardButton('iPhone 13', callback_data='sale_iphone13')
inline_iphone_13pro = InlineKeyboardButton('iPhone 13 Pro', callback_data='sale_iphone13pro')
inline_iphone_13promax = InlineKeyboardButton('iPhone 13 Pro Max', callback_data='sale_iphone13promax')
inline_iphone_13mini = InlineKeyboardButton('iPhone 13 Mini', callback_data='sale_iphone13mini')
inline_iphone_se2 = InlineKeyboardButton('iPhone SE (2-го поколения)', callback_data='sale_iphone_se2')
inline_iphone_12 = InlineKeyboardButton('iPhone 12', callback_data='sale_iphone12')
inline_iphone_12pro = InlineKeyboardButton('iPhone 12 Pro', callback_data='sale_iphone_12pro')
inline_iphone_12promax = InlineKeyboardButton('iPhone 12 Pro Max', callback_data='sale_iphone_12promax')
inline_iphone_12mini = InlineKeyboardButton('iPhone 12 Mini', callback_data='sale_iphone_12mini')
inline_iphone_11 = InlineKeyboardButton('iPhone 11', callback_data='sale_iphone_11')
inline_iphone_11pro = InlineKeyboardButton('iPhone 11 Pro', callback_data='sale_iphone11pro')
inline_iphone_11promax = InlineKeyboardButton('iPhone 11 Pro Max', callback_data='sale_iphone_11promax')
inline_iphone_xs = InlineKeyboardButton('iPhone XS', callback_data='sale_iphone_xs')
inline_iphone_xsmax = InlineKeyboardButton('iPhone XS Max', callback_data='sale_iphone_xsmax')
inline_iphone_xr = InlineKeyboardButton('iPhone XR', callback_data='sale_iphone_xr')
inline_iphone_x = InlineKeyboardButton('iPhone X', callback_data='sale_iphone_x')
inline_iphone_8 = InlineKeyboardButton('iPhone 8', callback_data='sale_iphone_8')
inline_iphone_se1 = InlineKeyboardButton('iPhone SE (1-го поколения)', callback_data='sale_iphone_se1')
inline_iphone_8plus = InlineKeyboardButton('iPhone 8 Plus', callback_data='sale_iphone_8plus')
inline_iphone_7 = InlineKeyboardButton('iPhone 7', callback_data='sale_iphone_7')
inline_iphone_7plus = InlineKeyboardButton('iPhone 7 Plus', callback_data='sale_iphone_7plus')
# inline_iphone_7 = InlineKeyboardButton('iPhone 7', callback_data='sale_iphone_7')
# inline_iphone_7 = InlineKeyboardButton('iPhone 7', callback_data='sale_iphone_7')
# inline_iphone_7 = InlineKeyboardButton('iPhone 7', callback_data='sale_iphone_7')
# inline_iphone_7 = InlineKeyboardButton('iPhone 7', callback_data='sale_iphone_7')
# inline_iphone_7 = InlineKeyboardButton('iPhone 7', callback_data='sale_iphone_7')
# inline_iphone_7 = InlineKeyboardButton('iPhone 7', callback_data='sale_iphone_7')
inline_kb_chose_new_model_iphone = InlineKeyboardMarkup(row_width=2).add(inline_iphone_14, inline_iphone_14max,
                                                                         inline_iphone_14pro, inline_iphone_14promax,
                                                                         inline_iphone_13, inline_iphone_13pro,
                                                                         inline_iphone_13promax, inline_iphone_13mini,
                                                                         inline_iphone_12, inline_iphone_12pro,
                                                                         inline_iphone_12promax, inline_iphone_12mini,
                                                                         inline_iphone_11, inline_iphone_11,
                                                                         inline_iphone_11pro, inline_iphone_se2,
                                                                         inline_iphone_11promax,
                                                                         inline_iphone_xs, inline_iphone_se1,
                                                                         inline_iphone_xr, inline_iphone_x,
                                                                         inline_iphone_8, inline_iphone_8plus,
                                                                         inline_iphone_7, inline_iphone_7plus)

'''model_from_phone = iPhone.objects.all()
keyb_temp = InlineKeyboardMarkup(row_width=3)
for model in model_from_phone:
    keyb_temp.add(InlineKeyboardButton(f'{model}', callback_data=f'{model}'))
    if 'Темп' in text:
        call_temp = text.split('Темп_')[-1]
        print(call_temp)'''

'''def callback_Func(callback_query):
    message = callback_query.message
    text = callback_query.data

    temp = ["36-37",  "37.1-38", "38.1-39"]
    keyb_temp = telebot.types.InlineKeyboardMarkup()
    for i in temp:
         keyb_temp.add(telebot.types.InlineKeyboardButton(f'{i}', callback_data = f'Темп_{i}'))
    #------отправили юзеру кнопки
     if 'Темп' in text:
            call_temp = text.split('Темп_')[-1]
            print(call_temp)
            con.execute('INSERT INTO Temp VALUES(str(call_temp))')'''

# extract_phone_name()
