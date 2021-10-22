# SemApps Solid PODS provider

## Testing

POST the following JSON to the `/auth/signup` endpoint:

```json
{
  "username": "alice",
  "email": "alice@test.com",
  "password": "test",
  "name": "Alice"
}
```

You should receive back a JWT token and see this in Moleculer logs:

```
Dataset alice doesn't exist. Creating it...
Created secure dataset alice
Container http://localhost:3000/alice/events doesn't exist, creating it...
Container http://localhost:3000/alice/files doesn't exist, creating it...
Container http://localhost:3000/alice/ doesn't exist, creating it...
```

If you look in Apache Fuseki admin, you should see a `settings` dataset has been created, as well as a `alice` dataset. It contains Alice's profile, available at http://localhost:3000/alice/profile (you will need to use the JWT token in the header to see it, as WebACL are activated)

```json
{
  "@context": "http://localhost:3000/context.json",
  "id": "http://localhost:3000/alice1/profile",
  "type": "foaf:Person",
  "dc:created": "2021-10-22T18:00:16.493Z",
  "dc:modified": "2021-10-22T18:00:16.493Z",
  "foaf:name": "Alice",
  "foaf:nick": "alice1"
}
```