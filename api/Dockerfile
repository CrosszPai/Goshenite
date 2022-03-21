FROM node:alpine3.14 as BUILDER

WORKDIR /app

COPY package.json .

RUN npm i --legacy-peer-deps

COPY . .

RUN npm run build:ts

FROM node:alpine3.14

WORKDIR /app

COPY package.json .

COPY wait-for.sh .

RUN npm i --only=prod --legacy-peer-deps

COPY --from=BUILDER /app/dist /app/dist

COPY ./pv-key.pem /app/pv-key.pem