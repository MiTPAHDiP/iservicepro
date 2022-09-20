from tgbot.management.commands import bot
from django.shortcuts import render



def start_bot(request):
    bot.main()
    return render(request, 'bot.py')