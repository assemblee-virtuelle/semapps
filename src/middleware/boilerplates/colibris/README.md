# Colibris ActivityPub server

## Importing data

Launch Moleculer in REPL mode and import the data like this:

```bash
$ call importer.import --action createOrganization --fileName groupes-locaux.json
$ call importer.import --action createProject --fileName projets-pc.json --groupSlug 60-pays-creillois
$ call importer.import --action createProject --fileName projets-rcc.json --groupSlug 60-compiegnois
$ call importer.import --action createUser --fileName users.json
$ call importer.import --action followProject --fileName followers.json
$ call importer.import --action postNews --fileName actualites-pc.json
$ call importer.import --action postNews --fileName actualites-rcc.json
```
