FROM node:24

WORKDIR /usr/src/app

COPY . .

ENV VITE_BACKEND_URL=http://localhost:8080/api

RUN npm install

CMD ["npm","run","dev","--","--host"]