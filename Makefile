.DEFAULT_GOAL := help
.PHONY: docker-build docker-up build start log stop restart

DOCKER_COMPOSE=docker-compose -f docker-compose.yaml
DOCKER_COMPOSE_PROD=docker-compose -f docker-compose-prod.yaml
# Docker
docker-build:
	$(DOCKER_COMPOSE) build

docker-build-prod:
	$(DOCKER_COMPOSE_PROD) build

docker-up:
	$(DOCKER_COMPOSE) up -d

docker-stop:
	$(DOCKER_COMPOSE) kill
	$(DOCKER_COMPOSE) rm -fv

docker-stop-prod:
		$(DOCKER_COMPOSE_PROD) kill
		$(DOCKER_COMPOSE_PROD) rm -fv

docker-clean:
	$(DOCKER_COMPOSE) kill
	$(DOCKER_COMPOSE) rm -fv

docker-start:
	$(DOCKER_COMPOSE) up -d --force-recreate

docker-start-prod:
	$(DOCKER_COMPOSE_PROD) up -d --force-recreate

docker-restart:
	$(DOCKER_COMPOSE) up -d --force-recreate

log:
	$(DOCKER_COMPOSE) logs -f solid fuseki

log-prod:
	$(DOCKER_COMPOSE_PROD) logs -f solid fuseki

start: docker-start

start-prod: docker-start-prod

stop: docker-stop

stop-prod: docker-stop-prod

restart: docker-restart

init :
	npm install --prefix ./src/middleware
	make bootstrap

build:docker-build

build-prod: docker-build-prod

prettier:
	npm run prettier --prefix ./src/middleware
	npm run prettier --prefix ./src/frontend

bootstrap:
	npm run bootstrap --prefix ./src/middleware
