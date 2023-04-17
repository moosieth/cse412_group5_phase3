FROM python:3

ENV ENABLE_CORS=true

WORKDIR /usr/src/app

RUN pip install --no-cache-dir mysql-connector-python flask firebase_admin flask-cors

COPY . .

EXPOSE 5000

CMD ["python", "./http_service.py"]