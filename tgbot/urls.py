from django.urls import path, include
import tgbot
from tgbot.management.commands import bot

from tgbot.views import ready

urlpatterns = [
    path('', ready),

]





