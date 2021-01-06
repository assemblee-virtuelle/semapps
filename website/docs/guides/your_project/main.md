---
title:  main
---

## Purpose

init, configure, debug, contribute, deploy your semapps application

- configuration of environment variables
- configuration of ontologies, context, resources, etc.
- docker + docker-compose
- connection to the source code of the semapps kernel for debugging and to be able to contribute
- deployment on a production environment (https, environment configuration)

## Navigation

<table>
  <tr>
    <th>&nbsp;</th>
    <th><a href="./minimal"><div>minimal&nbsp;stack</div><div>+simple</div><div>-automate</div></a></th>
    <th><a href="./docker"><div>docker&nbsp;stack</div><div>-simple</div><div>+automate</div></a></th>
    <th><a href="./workbench"><div>semapps&nbsp;workbench</div><div>+simple</div><div>+automate</div></a></th>
  </tr>
  <tr>
    <td><a href="./init_main">init a Project</a></td>
    <td><a href="./init_minimal">lien</a></td>
    <td><a href="./init_docker">lien</a></td>
    <td rowspan="3"><a href="./workbench">lien</a></td>
  </tr>
  <tr>
    <td><a href="./kernel_main">use semapps kernel source</a></td>
    <td><a href="./kernel_minimal">lien</a></td>
    <td><a href="./kernel_docker">lien</a></td>
  </tr>
  <tr>
    <td><a href="./production_main">production environment</a></td>
    <td><a href="./production_minimal">lien</a></td>
    <td><a href="./proction_docker">lien</a></td>
  </tr>
</table>

## general

Semmapps kernel contains server component and ui components. You have to create your own project (recomandation : git) which requiere them.
Semapps provides template and tools to create server and ui projects.



### production environment
#### difference whith developpment environnement
##### server
SEMAPPS_HOME_URL environment variable have to considere accessible external url. ex : https://yourdomain/middleware/ or https://middleware.yourdomain/

##### client
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
#### https
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
#### semapps-workbench
update docker-compose.prod replacing yourdomain by your real domain.
```bash
make start-prod
make log-prod
make stop-prod
```
### developpment tool
- [optional] set up a Makefile at the root to trigger executions more easily. exemples at [Makefile](https://github.com/assemblee-virtuelle/semapps-workbench/blob/main/Makefile) of semapps-workbench
