FROM python:3

WORKDIR /usr/src/app

RUN pip install --no-cache-dir mysql-connector-python flask

COPY . .

EXPOSE 5000

CMD ["python", "./http_service.py"]