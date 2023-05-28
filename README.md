# CSE 412 Spring 2023, Group 5 Project Phase III

A repository to hold the code for Group 5's CSE 412 Project

## What does this project do?

In short, this project contains:

1. A Docker image for a MySQL Database
2. a Flask App to act as an API to retrieve data from / send data to that
   Database
3. A React JS Front-End application

## How do I run this app?

### Prerequisites

To run this app, you'll first need:

1.  Docker (Platform-specific instructions
    [here](https://www.docker.com/products/docker-desktop/)).
2.  Ports 5174, 5000, and 3306 on your system need to be available for binding.

### Standing up

Once you have all the prerequisites, you can stand up this project with:

```sh
cd build
docker-compose up -d
```

1.
2. Make sure there are no docker images active on your Docker dashboard
   - if so delete any that are showing
3. Run command below to start container and application in detach mode

```sh
docker-compose up -d
```

You now have a MySQL Database running at `localhost:3306`, an API to interface
with that database at `127.0.0.1:5000`, and a React app at `localhost:5174`. The
react app is intended to be the primary point of interaction with our system.

### Tearing down

When you are done with your deployment, run:

```sh
docker-compose down
```

You will also likely want to go to Docker Desktop and delete any remaining
Images and Volumes.

### Can I run it another way?

Unfortunately, no. We wrote our API code in such a way that it can only connect
to the Database if it is within the same Docker network as it (due to the way
that networking functions within Docker containers).

If you are unable to use Docker to test our project, please see the demo video
[here](https://drive.google.com/file/d/1LtTDmcfhVniaOfdyL-KGJR8d5h6hphKB/view?usp=sharing)
for a full walkthrough of our project.

## UPDATE AS OF 05/28/2023

This project remains public for the sake of archival / resumes. However, it is
now missing Firebase credentials. In order for this project to fully function, Firebase API credentials are needed to access images.
