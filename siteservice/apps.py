from django.apps import AppConfig


class SiteserviceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'siteservice'

    def ready(self) -> None:
        import os
        from tgbot.management.commands import bot

        # RUN_MAIN check to avoid running the code twice since manage.py runserver runs 'ready' twice on startup
        if os.environ.get('RUN_MAIN', None) != 'true':
            # Your function to run the bot goes here
            bot.start_bot()
