FROM node:12

WORKDIR ./docker


ADD . /docker


RUN npm install


EXPOSE 8080


CMD ["nodemon"]
