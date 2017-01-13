#!/bin/sh
echo "Deploying the Analyzer_Visualizer"
echo "Step 1: Building Docker Image"
docker build -t analyzer_visualizer .
echo "Step 2: Running Docker Image and linking it with mongo container"
#(docker run -p 80:3012 --link mongodbinstance_mongo_1:mongo --net mongodbinstance_default analyzer_visualizer)&
(docker run -p 80:3012 analyzer_visualizer)&