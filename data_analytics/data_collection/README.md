------
Docker Run:
------

Build the data Collection docker image

docker build -t data_collection

Then to run and link with mongo container run the following:

docker run -d --link mongodbinstance_mongo_1:mongo --net mongodbinstance_default data_collection
 