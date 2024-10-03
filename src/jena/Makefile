init-container-builder:
	docker buildx create --name container-builder --driver docker-container --use --bootstrap

publish:
	export TAG=`git describe --tags --abbrev=0 | sed 's/frontend-v/v/' | sed 's/middleware-v/v/'`
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose build --push fuseki

publish-latest:
	export TAG="latest"
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose build --push fuseki
