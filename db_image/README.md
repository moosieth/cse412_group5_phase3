# CSE 412 Spring 2023, Group 5 Project Phase III - Database Image

This directory contains our Database Schema and a Dockerfile that defines the
image used to host our Database.

## How do I use this?

To create the image described by this directory's `Dockerfile`, simply execute
the following command from this directory:

```sh
docker build -t 412_db:latest .
```

To _actually run_ the image, you'll use the following command:

```sh
docker run -p 3306:3306 --name database -d 412_db:latest
```

Alternatively, you can use Docker Desktop to start a container once you've build the image.

To stop the container, use:

```sh
docker stop database
```

## Where is this used in-context?

The primary use of this image is to host the Database that our API connects to.

Our API can be found in the [http_service directory](../http_service/README.md)