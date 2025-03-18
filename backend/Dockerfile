
FROM python:3.9


ENV PYTHONUNBUFFERED=1 \
    DATABASE_URL=${DATABASE_URL}


WORKDIR /app


COPY requirements.txt /app/


RUN pip install --upgrade pip
RUN pip install -r requirements.txt


COPY . /app/


EXPOSE 8000


CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]
