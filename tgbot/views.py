import os
from tgbot.management.commands import bot


def ready(self) -> None:
    if os.environ.get('RUN_MAIN', None) != 'true':
        bot.main()
