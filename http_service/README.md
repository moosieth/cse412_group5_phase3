# CSE 412 Spring 2023, Group 5 Project Phase III - HTTP Service

This directory contains an Flask App that acts as an API between application and
our Database.

## How do I use this?

Eventually, the entire app will be deployable via docker compose, so this will
be containerized. In the meantime, though, you can stand up locally.

Firstly, you'll need:

1. Python (platform-specific instructions
   [here](https://www.python.org/downloads/))
2. Flask
3. Python's MySQL Connector
4. The Database Image

You can get 3 and 4 by executing the following command once you
have Python installed:

```sh
pip install flask flask-cors mysql-connector-python
```

To build the Database Image, do the following (from this directory):

```sh
docker build -t 412_db:latest ../db_image/ 
docker run -d -p 3306:3306 --name database 412_db:latest
```

You now have access to our Database through `127.0.0.1:3306`.

Once you've got all our dependencies, you can stand up the service with the
following command:

```sh
python http_service.py
```

At this point, you'll have access to the API at `http://127.0.0.1:5000`. To stop
the service, hit `Ctl + C`. To stop the Database, do the following:

```sh
docker stop database
```