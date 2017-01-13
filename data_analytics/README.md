Praktikum: Cloud Computing WS16-17

Project: Application 4, Data Analytics and Visualization

------
TO-DO:
------
- Distributed core functionality (server requesting to app2) to several vms (for scaling)
- For the above functionality we can use the nginx ("engine 'X'") reverse proxy 
- Cloud Deployment Stragey 
- Testing

------
DONE:
------
- Dockerize the app4 application
- Add mongoDB (or other NoSQL db) for the universities storing
- Created a Data Analyzer module which will analyze data
- Timestamping functionality for client requests on analyzer_visualizer  

------
GUIDE:
------

Our application lives under the app4 folder.
We are using npm for the server's module dependencies 
and bower for the client's depencendencies.

To install a new module do the following (in the app4 directory):
For bower:
    > bower install <package> --save (installs the package and updates bower.json dependencies)
    > npm istall <package> --save (installs the package and updates packages.json dependencies)

For client side dependencies use bower :)

Run the each application using
>node app.js

