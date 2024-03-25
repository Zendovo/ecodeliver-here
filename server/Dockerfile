# syntax=docker/dockerfile:1

FROM python:3

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN chmod 1777 /tmp
RUN apt-get update && apt-get --allow-unautheneticated install -y netcat-traditional

#RUN useradd --user-group --create-home --no-log-init --shell /bin/bash app

ENV APP_HOME=/home/app/web

WORKDIR $APP_HOME

RUN mkdir -p $APP_HOME/staticfiles
RUN mkdir -p $APP_HOME/media
COPY requirements.txt $APP_HOME

RUN pip install -r requirements.txt

COPY . $APP_HOME
#RUN chown -R app:app $APP_HOME

#USER app

ENTRYPOINT [ "/home/app/web/entrypoint.sh" ]
