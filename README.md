# subscriptions-toy - a toy graphql subscription setup using Apollo
---

Contents:

 - server: graphql server implemented using Apollo
 - cli: command line interface implemented in swift

## Server Info
---

The server implementation is based on the [Apollo Subscriptions docs][apollosubs].

Start with

```sh
cd server
npm start
```

or `./server/runserver.sh`

[apollosubs]: https://www.apollographql.com/docs/apollo-server/data/subscriptions/

# Swift Client
---

The client is implemented using Apollo's swift client with the generated
code checked in.

To issue a graphql query for points:

```sh
cd cli
swift run client get
```

To subscribe and monitor points changes

```sh
cd cli
swift run client watch --use-websockets
```

**NOTE** the `--use-websockets` flag is optional and not enabled by
default since it's undesireable for us HOWEVER it is currently required
for the example to function.

