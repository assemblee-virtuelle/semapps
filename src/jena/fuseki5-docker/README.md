# Fuseki 5 fixed docker image

This is an extension of `stain/jena-fuseki:5.1.0` docker image for Fuseki 5

## Why the fix ?

When creating a service with docker compose and mounting a volume for Fuseki data, there is a permissions issue.

### The issue

```yaml
  fuseki_tests:
    image: stain/jena-fuseki:5.1.0
    container_name: fuseki_tests
    restart: always
    volumes:
      - ./data/fuseki_tests:/fuseki:z
    ports:
      - '3040:3030'
    expose:
      - '3040'
    environment:
      ADMIN_PASSWORD: 'admin'
```
```
sylvain@UP222:~/virtual-assembly/activitypods/semapps/src/middleware/tests$ docker compose up -d 
[+] Running 6/6
 ✔ Network middleware_tests_network  Created                                                                       0.0s 
 ✔ Container redis_middleware_tests  Started                                                                       0.8s 
 ✔ Container ng_tests                Started                                                                       0.8s 
 ✔ Container fuseki_tests            Started                                                                       0.8s 
 ✔ Container arena_tests             Started                                                                       1.5s 
 ✔ Container tripleadmin             Started                                                                       1.5s 
sylvain@UP222:~/virtual-assembly/activitypods/semapps/src/middleware/tests$ docker logs fuseki_tests
###################################
Initializing Apache Jena Fuseki

cp: cannot create regular file '/fuseki/shiro.ini': Permission denied
```

### Temp fix during development 

1. That issue could to be fixed with a `chmod 777` from the host computer then relaunching the container.

2. It could also be fixed by forcing the container to run as root : 
```yaml 
  fuseki_tests:
    image: stain/jena-fuseki:5.1.0
    container_name: fuseki_tests
    restart: always
    volumes:
      - ./data/fuseki_tests:/fuseki:z
    ports:
      - '3040:3030'
    expose:
      - '3040'
    environment:
      ADMIN_PASSWORD: 'admin'
    user: "0:0" # run as root
```

### Unsatisfying fixes
1. Solution one : implied a manual step, deterrent for devX
2. Solution two : could lead to security or technical issues as the original image wasn't designed to run as root

## The fix
We extended the docker image to start as root and created an entry point that fixes the permissions on the mounted volume before running the original entrypoint as the fuseki user from the image.

### Build and publish the image
```
docker build -t semapps/fuseki5-permissions-fix -f Dockerfile .
```
### Use the new image

```yaml
  fuseki_tests:
    image: semapps/fuseki5-permissions-fix
    container_name: fuseki_tests
    restart: always
    volumes:
      - ./data/fuseki_tests:/fuseki:z
    ports:
      - '3040:3030'
    expose:
      - '3040'
    environment:
      ADMIN_PASSWORD: 'admin'
```