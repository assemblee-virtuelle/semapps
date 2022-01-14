---
title: Contribuer au coeur de SemApps
---

Si vous êtes développeur, vous pouvez choisir d'utiliser SemApps comme librairie pour votre propre projet. Dans ce cas, ce [guide](guides/ldp-server.md) sera pour vous d'une grande utilité.

Si vous souhaitez contribuer au coeur de SemApps, alors vous êtes au bon endroit !

## Lancer SemApps localement

En quelques commandes, vous pouvez lancer SemApps sur votre machine :
- Middleware
- Frontend ([DMS](guides/dms.md))
- A Jena Fuseki instance

### Pré-requis pour une première installation

Pour faire fonctionner SemApps simplement, vous aurez besoin :

- [docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)
- [make](https://www.gnu.org/software/make/)

Ensuite, lancez les commandes suivantes :

```
git clone https://github.com/assemblee-virtuelle/semapps.git
cd semapps
make init
make build
make start
```
### Logs

Pour avoir accès aux logs de SemApps, lancez la commande :

```
make log
```

### Stop

Pour arrêter tous les containers :

```
make stop
```

## Importer des données dans SemApps

Si vous souhaitez remplir votre SemApps avec des données de test, contactez-nous.

## Demander de l'aide

N'hésitez pas à nous poser des questions sur le **Chat des communs**, sur le [channel semapps_dev](https://chat.lescommuns.org/channel/semapps_dev).
