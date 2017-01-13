#!/bin/sh
echo "Deploying the mongo Db Instance"
echo "Step 1: Build the mongodb_instance docker image"
docker build -t mongodb_instance .
echo "Step 2: Running Docker Image"
(docker-compose up)&
