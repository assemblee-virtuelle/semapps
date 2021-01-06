---
title: deploy server for production usage in docker stack
---

## Purpose

deploy server

## Prerequisites


## production environment
### difference whith developpment environnement
#### server
SEMAPPS_HOME_URL environment variable have to considere accessible external url. ex : https://yourdomain/middleware/ or https://middleware.yourdomain/

#### client
REACT_APP_MIDDLEWARE_URL environment variable have to considere accessible external url of server and is usally same as  SEMAPPS_HOME_URL.  
Dockerfile have to include serve install and run it on dockerfile CMD or docker-compose command
- Dockerfile.prod
```bash
npm install -g serve
CMD serve -s build -l 5000
```
- docker-compose.prod
```
middleware:
  command: bash -c "npm install && serve -s build -l 5000"
```
### https
most of production configuration have to include https. We recommend you to set up traefik in docker compose.
```
traefik:
  image: "traefik:v2.3"
  container_name: "traefik-workbench"
  networks:
    - semapps
  command:
    # - "--log.level=DEBUG"
    - "--api.insecure=true"
    - "--providers.docker=true"
    - "--providers.docker.exposedbydefault=false"
    - "--entrypoints.web.address=:80"
    - "--entrypoints.websecure.address=:443"
    - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
    - "--certificatesresolvers.myresolver.acme.email=yourmail"
    - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
  ports:
    - "80:80"
    - "443:443"
    - "8080:8080"
  volumes:
    - "./letsencrypt:/letsencrypt"
    - "/var/run/docker.sock:/var/run/docker.sock:ro"
middleware:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.middleware.rule=Host(`yourdomain`) && PathPrefix(`/middleware/`)"
    - "traefik.http.routers.middleware.entrypoints=websecure"
    - "traefik.http.routers.middleware.tls.certresolver=myresolver"

frontend:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.frontend.rule=Host(`yourdomain`)"
    - "traefik.http.routers.frontend.entrypoints=websecure"
    - "traefik.http.routers.frontend.tls.certresolver=myresolver"
```
