FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/data_collection
WORKDIR /usr/src/data_collection

# Install app dependencies
COPY package.json /usr/src/data_collection/
RUN npm install
RUN npm install socket.io --save
RUN npm install socket.io-client --save
RUN npm install mongodb --save
# Bundle app source
COPY . /usr/src/data_collection
EXPOSE 8080

CMD [ "node", "app.js" ]

