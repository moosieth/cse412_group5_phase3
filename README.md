# CSE 412 Spring 2023, Group 5 Project Phase III

A repository to hold the code for Group 5's CSE 412 Project

## What does this project do?

In short, this project contains:

1. A Docker image for a MySQL Database
2. a Flask App to act as an API to retrieve data from / send data to that
   Database
3. A React JS Front-End application (eventually)

We're still developing, though! Come back later to see what it looks like once
its finished!



To run:
   1. Navigate to build folder
   2. Make sure there are no docker images active on your Docker dashboard
         - if so delete any that are showing
   3. Run command below to start container and application
   ```sh 
   docker-compose up -d
   ```
   4. Make sure ports 5174, 5000, and 3306 are available to use
   5. Navigate to localhost:5174
   6. Once you are done to stop running run command "docker-compose down"
