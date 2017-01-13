FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/mongodb_instance
WORKDIR /usr/src/mongodb_instance

# Install app dependencies
COPY package.json /usr/src/mongodb_instance/
RUN npm install
RUN npm install socket.io --save
RUN npm install mongodb --save
RUN npm install mongod --save
# Bundle app source
COPY . /usr/src/mongodb_instance

EXPOSE 27017

CMD [ "node", "app.js" ]

