# pull official base image
FROM python:alpine3.20

# set work directory inside image
WORKDIR /home/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install any image system dependencies
RUN apk update

# install project dependencies
RUN pip install --upgrade pip
COPY ./requirements/base.txt .
COPY ./requirements/dev.txt .
RUN pip install -r dev.txt

# copy init script and set permissions
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /home/app/entrypoint.sh
RUN chmod +x /home/app/entrypoint.sh

# copy project source
COPY . .

# run init script
ENTRYPOINT ["/home/app/entrypoint.sh"]