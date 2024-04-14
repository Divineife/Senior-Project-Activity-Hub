# from . import config  # -Line 1
# from ActivityHub.server.myServer.config import create_app
from .config import create_app
from celery import shared_task
from time import sleep

# create_app = config.create_app

flask_app = create_app()  # -Line 2
celery_app = flask_app.extensions["celery"]  # -Line 3


@shared_task(ignore_result=False)  # -Line 4
def long_running_task(iterations) -> int:  # -Line 5
    result = 0
    for i in range(iterations):
        result += i
        sleep(2)
    print("\n BACKGROUND \n", result)
    return result  # -Line 6