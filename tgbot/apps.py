from django.apps import AppConfig


class TgbotConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tgbot'



    # def ready(self) -> None:
    #     import os
    #     from tgbot.management.commands import bot
    #     bot.main()
    #     if os.environ.get('RUN_MAIN', None) != 'true':
    #         bot.main()
