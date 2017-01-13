#!/bin/sh
echo "Deploying the data Collection"
echo "Step 1: Build the data Collection docker image"
docker build -t data_collection .
echo "Step 2: Running Docker Image and linking it with mongo container"
#(docker run --link mongodbinstance_mongo_1:mongo --net mongodbinstance_default data_collection)&
(docker run data_collection)&