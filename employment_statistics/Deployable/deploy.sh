#!/bin/sh
echo "Deploying App"
docker build -t shits .
echo "Initiating app!"
(docker run -p 8081:8081 shits)&
echo "App is running. You may close the terminal."
