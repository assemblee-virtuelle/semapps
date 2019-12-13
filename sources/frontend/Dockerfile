FROM node:12.13-alpine

WORKDIR /app

# This is necessary to run Yarn
RUN apk add --no-cache git

RUN apk add yarn

COPY . /app/

CMD "./entrypoint.sh"
