------
Docker Run:
------

-Build the docker image

docker build -t mongodb_instance

-Run the container

docker-compose up

------
Running not from Docker:
------

mkdir data\app4_data

run the mongodb instance first 

mongod --dbpath data\app4_data