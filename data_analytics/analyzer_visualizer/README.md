------
Docker Run:
------
-Build the docker Image
docker build –t analyzer_visualizer .

-Run the docker container
docker run -d -p 8080:8080 --link mongodbinstance_mongo_1:mongo --net mongodbinstance_default analyzer_visualizer
