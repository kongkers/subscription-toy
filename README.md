# subscriptions-toy - a toy graphql subscription setup using Apollo
---

Contents:

 - server: graphql server implemented using Apollo
 - cli: command line interface implemented in swift

## Server Info
---

The server implementation is based on the [Apollo Subscriptions docs][apollosubs].

Build with

```sh
npm install
```
Start with

```sh
cd server
npm start
```

Default port for the server is 4000. The default endpoint for the subscriptions is `/graphql/stream`


[apollosubs]: https://www.apollographql.com/docs/apollo-server/data/subscriptions/

# React Client

This is a simple client based on Apollo-Client and graphql-sse.

Build with:

```sh

npm install
npm run build:ui
```

Once you have built the UI, you can run it with:

```sh
npm start
```

The ui will be available on [http://127.0.0.1:3010](http://127.0.0.1:3010)

## Configuration

You can change the port the UI server listens by changing the `local.yaml` file.

The default configuration is:

```
server:
  port: 3010
```


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

