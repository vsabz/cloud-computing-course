FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/analyzer_visualizer
WORKDIR /usr/src/analyzer_visualizer

# Install app dependencies
COPY package.json /usr/src/analyzer_visualizer/
RUN npm install
RUN npm install socket.io --save
RUN npm install socket.io-client --save
# Bundle app source
COPY . /usr/src/analyzer_visualizer

EXPOSE 80

CMD [ "node", "app.js" ]

