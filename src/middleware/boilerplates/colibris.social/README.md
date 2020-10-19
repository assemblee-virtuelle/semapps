[![SemApps](https://badgen.net/badge/Powered%20by/SemApps/28CDFB)](https://semapps.org)

# Colibris ActivityPub server

## Getting started

Requirements:
- Node (v13+ recommended)
- Docker
- Docker-compose

### 1. Launch Jena Fuseki

```bash
docker-compose up
```

Go to `http://localhost:3030` and create a new dataset called `colibris`.

### 2. Generate the JWT keys

```bash
./initialize.sh
```

### 3. Configure the CAS URL

Edit the `.env` file or add a `.env.local` file.

Add the URL to your CAS server.


### 4. Launch in dev mode
```bash
npm install
npm run dev
```
