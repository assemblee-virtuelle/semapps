#   Licensed to the Apache Software Foundation (ASF) under one or more
#   contributor license agreements.  See the NOTICE file distributed with
#   this work for additional information regarding copyright ownership.
#   The ASF licenses this file to You under the Apache License, Version 2.0
#   (the "License"); you may not use this file except in compliance with
#   the License.  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.


#FROM alpine:3.4
#RUN apk add --update openjdk8-jre pwgen bash wget ca-certificates && rm -rf /var/cache/apk/*
FROM openjdk:8-jre-alpine
RUN apk add --update nodejs npm pwgen bash curl ca-certificates procps && rm -rf /var/cache/apk/*

MAINTAINER Niko PLP <info@parlepeuple.fr>

ENV JAVA_MX_RAM="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75"

# Update below according to https://jena.apache.org/download/ and
# corresponding *.tar.gz.sha512 from https://www.apache.org/dist/jena/binaries/
ENV FUSEKI_SHA512 2b92f3304743da335f648c1be7b5d7c3a94725ed0a9b5123362c89a50986690114dcef0813e328126b14240f321f740b608cc353417e485c9235476f059bd380
ENV FUSEKI_VERSION 3.17.0
# Tip: No need for https as we've coded the sha512 above
ENV ASF_MIRROR_EU https://www.eu.apache.org/dist/
ENV ASF_MIRROR_US https://downloads.apache.org/
ENV ASF_ARCHIVE https://archive.apache.org/dist/
#

ENV JENA_SHA512 321c763fa3b3532fa06bb146363722e58e10289194f622f2e29117b610521e62e7ea51b9d06cd366570ed143f2ebbeded22e5302d2375b49da253b7ddef86d34

# Config and data
VOLUME /fuseki
ENV FUSEKI_BASE /fuseki


# Installation folder
ENV FUSEKI_HOME /jena-fuseki

WORKDIR /tmp
# sha512 checksum
RUN echo "$FUSEKI_SHA512  fuseki.tar.gz" > fuseki.tar.gz.sha512
# Download/check/unpack/move in one go (to reduce image size)
RUN     curl -sSL --fail $ASF_ARCHIVE/jena/binaries/apache-jena-fuseki-$FUSEKI_VERSION.tar.gz > fuseki.tar.gz && \
        sha512sum -c fuseki.tar.gz.sha512 && \
        tar zxf fuseki.tar.gz && \
        mv apache-jena-fuseki* $FUSEKI_HOME && \
        rm fuseki.tar.gz* && \
        cd $FUSEKI_HOME && rm -rf fuseki.war

RUN chmod 755  /jena-fuseki/fuseki-server

RUN sed -i 's/JVM_ARGS=${JVM_ARGS:--Xmx4G}/JVM_ARGS=${JVM_ARGS:--Xmx${JAVA_MX_RAM}}\nexport LOG4J_FORMAT_MSG_NO_LOOKUPS=true/g' /jena-fuseki/fuseki-server 

RUN echo "$JENA_SHA512  jena.tar.gz" > jena.tar.gz.sha512

RUN     curl -sS --fail $ASF_ARCHIVE/jena/binaries/apache-jena-$FUSEKI_VERSION.tar.gz > jena.tar.gz && \
        sha512sum -c jena.tar.gz.sha512 && \
        tar zxf jena.tar.gz && \
        cp -R apache-jena-$FUSEKI_VERSION/bin/* $FUSEKI_HOME/bin && \
        cp -R apache-jena-$FUSEKI_VERSION/lib $FUSEKI_HOME/ && \
        rm jena.tar.gz* && \
        rm -r  apache-jena-$FUSEKI_VERSION

RUN chmod 755 $FUSEKI_HOME/bin/tdb2.*

# Test the install by testing it's ping resource
#RUN  /jena-fuseki/fuseki-server & \
#     sleep 4 && \
#     curl -sS --fail 'http://localhost:3030/$/ping' 

# No need to kill Fuseki as our shell will exit

# As "localhost" is often inaccessible within Docker container,
# we'll enable basic-auth with a random admin password
# (which we'll generate on start-up)

COPY shiro.ini /jena-fuseki/
COPY migration /jena-fuseki/migration
COPY extra/commons-collections4-4.4.jar /jena-fuseki/extra/commons-collections4-4.4.jar
COPY extra/jena-permissions-3.17.0.jar /jena-fuseki/extra/jena-permissions-3.17.0.jar
COPY extra/semapps-jena-permissions-1.0.0.jar /jena-fuseki/extra/semapps-jena-permissions-1.0.0.jar
#COPY configuration/localData.ttl /jena-fuseki/configuration/localData.ttl
#COPY configuration/testData.ttl /jena-fuseki/configuration/testData.ttl
COPY docker-entrypoint.sh /
COPY docker-compact-entrypoint.sh /
COPY docker-delete-old-data-entrypoint.sh /
COPY docker-migration-entrypoint.sh /
RUN chmod 755 /docker-entrypoint.sh
RUN chmod 755 /docker-compact-entrypoint.sh
RUN chmod 755 /docker-delete-old-data-entrypoint.sh
RUN chmod 755 /docker-migration-entrypoint.sh

COPY load.sh /jena-fuseki/
COPY tdbloader /jena-fuseki/
RUN chmod 755 /jena-fuseki/load.sh /jena-fuseki/tdbloader
#VOLUME /staging


# Where we start our server from
WORKDIR /jena-fuseki
EXPOSE 3030
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/jena-fuseki/fuseki-server"]
