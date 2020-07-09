---
title: Create an ActivityPub server
---

In this guide you will setup a SemApps-powered [ActivityPub](https://www.w3.org/TR/activitypub/) server, you will create an actor and communicate with another [Mastodon](https://joinmastodon.org/) actor.

## Setup a new Moleculer project

You will need to have [NodeJS](https://nodejs.org/en/) installed on your computer.

First install the [moleculer-cli](https://github.com/moleculerjs/moleculer-cli) tool globally.

```bash
npm install -g moleculer-cli
```

Then initialize a new project based on this template with this command:

```bash
moleculer init assemblee-virtuelle/semapps-template-activitypub my-activitypub-server
```

Choose `yes` to all questions:
```
? Do you need a local instance of Jena Fuseki (with Docker)? Yes
Create 'semapps' folder...
? Would you like to run 'npm install'? Yes
```

You can now go to the newly-created directory:

```bash
cd my-activitypub-server
```

### Launch your local Jena Fuseki instance

Jena Fuseki is a semantic triple store. It is where your app's data will be stored.

You need [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine.

```bash
docker-compose up
```

Jena Fuseki is now available at the URL http://localhost:3030.

Please login - by default, the login is `admin` and the password is also `admin`.

Please start by create a new dataset and name it `localData` (case sensitive). Your data will be stored there.

### Run Moleculer in dev mode

```bash
npm run dev
```

Your instance of SemApps is available at http://localhost:3000

However, since we will want to communicate with a Mastodon instance later on this guide, we need to provide a publicly-accessible server, and we need it to handle HTTPS, as required by the ActivityPub protocol.

Luckily, this can be done easily with the [Serveo](http://serveo.net) service. All you need to do is run the following command:

```bash
ssh -o ServerAliveInterval=60 -R alice-server:80:localhost:3000 serveo.net
```

This will create a publicly-accessible https://alice-server.serveousercontent.com domain which will point to your local computer (If `alice-server` is already taken, choose another login !)

> You could also use a service like [Ngrok](https://ngrok.com), but with the free version you will have a different domain name on every session, which can make testing more difficult.

Now, to make sure all your resources will use this domain, add a `.env.local` file at the root of the SemApps instance and write this:

```env
SEMAPPS_HOME_URL=https://alice-server.serveousercontent.com/
```

And launch again your server so that it takes into account this change.

## Create an ActivityPub actor

By default, the ActivityPub service will create a LDP container in the `/actors` path.

You can create an ActivityPub actor by POSTing to this LDP container with a tool like [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/downloads/) or the [RESTClient add-on for Firefox](https://addons.mozilla.org/fr/firefox/addon/restclient/).

```
POST /actors HTTP/1.1
Host: alice-server.serveousercontent.com
Content-Type: application/json
Accept: */*
Slug: alice

{
 "@context": "https://www.w3.org/ns/activitystreams",
 "type": "Person",
 "preferredUsername": "alice"
}
```

Note the `Slug` header. It allows you to specify the URI of the actor.

In return, you will receive informations about the created actor:

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1"
  ],
  "id": "https://alice-server.serveousercontent.com/actors/alice",
  "type": "Person",
  "inbox": "https://alice-server.serveousercontent.com/actors/alice/inbox",
  "publicKey": {
    "owner": "https://alice-server.serveousercontent.com/actors/alice",
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAy1cCXaqr99REmt2X9b3F\nOFJxuXXvhN+qe9qzyx9nVUtCPLUsAdEcstnUtvny9VOOyMoYa87yx21ns8PxQINE\nfKNlkHWc6zQrTfy8blEvcD7WGHLe2cWX9y5Lc604YsUhyWsmiBMAu2CPK80rQC/6\nXH4wKt2ad7GLO9lSlM2WNNUFehHgDHlNouNBUaxlpGVgcOpjjMSO/iQv6Xjbrfab\n/oukG47D7H+J66PE7R8kyjD9/tX5WwGkthLlzDAxoCNP4+DzBa2D5Wuu/dDJ50jc\nkDMnC07gjg2Zgs4PcKW5DF7ZOKBHtyUxgnabHjEYxSc7amy+enYONjNEzar2dkPD\nJL0OtRbMq28/J0/UCDEpH5hrTdi/7ja6aLlxX9Aqt6bc7TX0MQzVF7yCOJ4sjDDX\nnAF4fimUp2unedAgfexlacEky5HbDuBrEw6DiEmwgSrbhd8paS01haow5TSNSxgV\nUN/xPPb0XUqvuoeaAfoEuuPgRtsQ/zGoSVklx2h+dEbmPuS010pYQEwbucTFaGMH\nvE6aBs7UeMxmHKNkpqziU/G6DlVzrAp91vd3+BRwceyEtoY8ZczDrPSAyD+g9gSG\neRGQFBwpYuattfc6bzR4NdTv2S4pcdvP9q/an8GAMzFb0OwBYTXF1TQ4UtCylvpp\nruuVqWmyIXzM7v6gi1u3alsCAwEAAQ==\n-----END PUBLIC KEY-----\n"
  },
  "followers": "https://alice-server.serveousercontent.com/actors/alice/followers",
  "following": "https://alice-server.serveousercontent.com/actors/alice/following",
  "outbox": "https://alice-server.serveousercontent.com/actors/alice/outbox",
  "preferredUsername": "alice"
}
```

Note that the ActivityPub service (or rather, the ActorService) has appended all the required properties for actors: the outbox, the inbox, the list of followers and following, as well as a `publicKey` field which will be used to verify messages sent by this actor.

> If you look inside the `/actors` subdirectory, you should see two files: `alice.key` and `alice.key.pub`. The first one is the private key and it should never get out of your server. The second is the public key that we saw just before.

## Create a Mastodon user

Mastodon is federated social network to exchange Twitter-like short communications. Unlike Twitter, Mastodon can be installed on many different servers, which use the ActivityPub protocol to communicate with each others. And since ActivityPub is an universal protocol, many different softwares can exchange with Mastodon instances.

This is what we will do now: exchange informations with a Mastodon user. To do that, create an account on any of the instances that you can find on the [Mastodon homepage](https://joinmastodon.org).

For this guide, we will create an user `bob` on the [Framapiaf](https://framapiaf.org) instance. 

## Make the two actors follow each others

Send a POST request to Alice's outbox with the following informations.

```
POST /actors/alice/outbox HTTP/1.1
Host: alice-server.serveousercontent.com
Content-Type: application/json
Accept: */*

{
  "@context": "https://www.w3.org/ns/activitystreams",
  "actor": "https://alice-server.serveousercontent.com/actors/alice",
  "type": "Follow",
  "object": "https://framapiaf.org/users/bob",
  "to": "https://framapiaf.org/users/bob"
}
```

> We use the URL https://framapiaf.org/users/bob for Bob's account, because that's the standard URL for Mastodon actors. However we could have found this information through the [Webfinger](../packages/webfinger.md) protocol. 
>
> If you do a GET with an `Accept: application/json` header to this URL, you should have all the informations about Bob.

`Follow` activities must usually be followed by an `Accept` activity to confirm that the remote actor has accepted the request. If the magic happened, you should see it on Alice's inbox: https://alice-server.serveousercontent.com/actors/alice/inbox. Furthermore, Bob should appear in her following list: https://alice-server.serveousercontent.com/actors/alice/inbox

If you now go to Bob's Mastodon account, you should see a notification that the user `@alice@alice-server.serveousercontent.com` wants to follow him. Click on the icon on the right to follow her back.

## Send a Note to your followers

You're almost there ! Now that the two users follow each others, you can post a message as Alice, and Bob should view it on his Mastodon feed.

```
POST /actors/alice/outbox HTTP/1.1
Host: alice-server.serveousercontent.com
Content-Type: application/json
Accept: */*

{
 "@context": "https://www.w3.org/ns/activitystreams",
 "type": "Note",
 "attributedTo": "https://alice-server.serveousercontent.com/actors/alice",
 "content": "Hello to all my followers !",
 "to": [ "https://alice-server.serveousercontent.com/actors/alice/followers" ]
}
```

The message is not sent directly to Bob (otherwise it would appear as a direct message), but to all of Alice's followers. If everything went well, this message should appear right at the top of Bob's Mastodon feed !

> Mastodon, being a Twitter clone, only accept two types of objects: Notes and Questions. Other types of objects are converted but you cannot be sure of the result. For more information, see [this page](https://docs.joinmastodon.org/spec/activitypub/).

Much more could be done, but with this little guide, we hope you had a taste of what is possible with a simple ActivityPub server !