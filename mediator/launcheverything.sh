docker run -d --net=mediator-bridge -p 3001:3001 --ip 222.222.222.221 --name express boron nodejs /home/express.js
docker run -d --net=mediator-bridge -p 8082:8082 --ip 222.222.222.222 -v /var/docker/packages:/packages --name server boron nodejs /home/server.js
docker run -d --net=mediator-bridge -p 8092:8092 --ip 222.222.222.223 -v /var/docker/packages:/packages --name merge boron nodejs /home/merge.js

