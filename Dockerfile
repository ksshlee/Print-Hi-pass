FROM node:12
COPY . .
RUN npm install
EXPOSE 8080
WORKDIR /


CMD node app.js
