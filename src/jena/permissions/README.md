# Permissions JAR file containing the ShiroEvaluator class for Fuseki Permissions implementation

How to build the JAR file (optional, the last version is already built and present in the Docker image). 

### Install maven

You will need to install the Maven command-line build tool. For more information, go to Maven. If you are using Linux, check your package manager.

```
sudo apt-get install mvn
```

if you are using Homebrew

```
brew install maven
```

### Build

```
mvn package
```

### copy

Copy the resulting jar `target/semapps-jena-permissions-1.0.0.jar` to `src/jena/fuseki-docker/extra/`
