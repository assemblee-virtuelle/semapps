FROM stain/jena-fuseki:5.1.0

# Switch to root first (base image ends with USER fuseki)
USER root

# Install su-exec for switching users (Alpine package)
RUN apk add --no-cache su-exec

# Copy the wrapper entrypoint
COPY docker-entrypoint-wrapper.sh /docker-entrypoint-wrapper.sh
RUN chmod +x /docker-entrypoint-wrapper.sh

# Use our wrapper as the entrypoint (it will switch to fuseki user)
ENTRYPOINT ["/docker-entrypoint-wrapper.sh"]

# Preserve the CMD from the base image (required when overriding ENTRYPOINT)
CMD ["/jena-fuseki/fuseki-server"]
