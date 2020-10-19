[![SemApps](https://badgen.net/badge/Powered%20by/SemApps/28CDFB)](https://semapps.org)

# ActivityPub Mailer

## Getting started

Requirements:
- Node (v13+ recommended)
- Docker
- Docker-compose

### 1. Launch Jena Fuseki

If you don't have access to a Jena Fuseki instance, you can create a local one with Docker using the following commands:

```bash
docker-compose up
```

Go to `http://localhost:3030` and create a new dataset called `mailer`.

### 2. Edit the configurations

Edit the `.env` file (or create a `.env.local` file which will overwrite the default configurations) to configure the SMTP account, as well as the actor the Match Bot will be following.

```env
# Email
SEMAPPS_FROM_EMAIL=account@test.com
SEMAPPS_FROM_NAME=Test account
SEMAPPS_SMTP_HOST=
SEMAPPS_SMTP_USER=
SEMAPPS_SMTP_PASS=

# Match Bot
SEMAPPS_FOLLOWING=
```

### 3. Launch in dev mode
```bash
npm install
npm run dev
```

## Testing

Create a `mailerTest` dataset in your Jena Fuseki instance and run this command:

```
npm run test
```

By default this will use the [ethereal.email](https://ethereal.email) service to test the emails. The URL of the generated emails will be displayed in the console at the end of the test.
