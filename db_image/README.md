# CSE 412 Spring 2023, Group 5 Project Phase III - Database Image

This directory contains our Database Schema and a Dockerfile that defines the
image used to host our Database.

## How do I use this?

To create the image described by this direcotorie's `Dockerfile`, simply execute
the following command from this diRectory:

```sh
docker build -t group5_database:latest .
```

To _actually run_ the image, you'll use the following command:

```sh
docker run -p 3306:3306 --name running_db -d group5_database:latest
```

Alternatively, you can use Docker Desktop to start a container once you've build the image.

To stop the container, use:

```sh
docker stop running_db
```