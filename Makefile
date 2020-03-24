.DEFAULT_GOAL := help
.PHONY: docker-build docker-up build start log stop restart

DOCKER_COMPOSE=docker-compose -f docker-compose.yaml
DOCKER_COMPOSE_PROD=docker-compose -f docker-compose-prod.yaml
DOCKER_COMPOSE_TEST=docker-compose -f docker-compose-test.yaml

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
	$(DOCKER_COMPOSE) logs -f middleware frontend

log-prod:
	$(DOCKER_COMPOSE_PROD) logs -f middleware fuseki frontend mongo

start: docker-start

start-prod: docker-start-prod

stop: docker-stop

stop-prod: docker-stop-prod

restart: docker-restart

init :
	make install
	make bootstrap

install :
	npm install --prefix ./src/frontend
	npm install --prefix ./src/middleware

build:docker-build

build-prod: docker-build-prod

prettier:
	npm run prettier --prefix ./src/frontend
	npm run prettier --prefix ./src/middleware

bootstrap:
	npm run bootstrap --prefix ./src/middleware

# For tests we currently only need fuseki and mongodb
test:
	$(DOCKER_COMPOSE_TEST) build
	$(DOCKER_COMPOSE_TEST) up -d
	npm run test --prefix ./src/middleware/tests
	$(DOCKER_COMPOSE_TEST) kill
	$(DOCKER_COMPOSE_TEST) rm -fv

repl:
	$(DOCKER_COMPOSE) restart middleware
	docker attach middleware
	# Restart the container, since leaving the console will stop it
	$(DOCKER_COMPOSE) restart middleware
