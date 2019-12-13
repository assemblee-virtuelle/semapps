FROM node:12.13-alpine

# WORKDIR /data/main
WORKDIR /main

# confirm installation
RUN node -v
RUN npm -v

#install pm2 to production (monitoring)
RUN npm install pm2 -g
#install nodemon to dev (support hot realoading) (need specific command in compose)
RUN npm install nodemon -g

# install tool for npm lib compile in C
RUN apk add --update --no-cache autoconf libtool automake python alpine-sdk

# Install app dependencies
# COPY ./main/package.json /data/
COPY ./package.json /main/
RUN cd /main/ && npm cache clean --force && npm install --loglevel verbose

# add src & build configuraiton
COPY . /main/
RUN cd /main/ && npm run bootstrap
# RUN cd /main/boilerplate/runner && ls


# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

# CMD [ "ls", "./boilerplate/runner/"]
CMD [ "pm2-runtime", "./boilerplate/runner/index.js", "--name" ,"SemappSolid"]
