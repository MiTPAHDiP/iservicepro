from django.urls import path, include

from tgbot.views import start_bot


urlpatterns = [
    path('', start_bot),
    #path('', include('tgbot.urls')),

]








