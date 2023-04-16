FROM python:3

WORKDIR /usr/src/app

# Not sure if firebase-admin is needed
RUN pip install --no-cache-dir mysql-connector-python flask firebase_admin

COPY . .

EXPOSE 5000

CMD ["python", "./http_service.py"]