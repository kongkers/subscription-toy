import * as React from 'react';
import './styles.css';
import { getMainDefinition } from '@apollo/client/utilities';
import { print } from 'graphql';
import { Observable, ApolloClient, InMemoryCache, gql, useSubscription, split, ApolloLink, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-sse';
import { useEffect } from 'react'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000',
}));

class SSELink extends ApolloLink {

  constructor(options) {
    super();
    this.client = createClient(options);
  }

  request(operation) {
    return new Observable((sink) => {
      return this.client.subscribe(
        {...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        }
      )
    })
  }
}

const sseLink = new SSELink({
  url: 'http://127.0.0.1:4000/graphql/stream',
});

const splitLink = split(
  (gqlOp) => {
    const definition = getMainDefinition(gqlOp.query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  sseLink,
  httpLink,
);

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});


const client = createClient({
  singleConnection: false,
  url: 'http://127.0.0.1:4000/graphql/stream',
});

const query = `
  query {
    membership {
      number
      points
    }
  }
`;

const subscriptionQuery = `
  subscription PointsChanged {
    pointsChanged {
      points
      other
    }
  }
`;

const gqlSubscription = gql(subscriptionQuery);

export default function App() {
  const [points, setPoints] = React.useState(0);

  const { data, error, loading } = useSubscription(gqlSubscription, {
    client: apolloClient,
  });

  useEffect(() => {
    if(data) {
      setPoints(data.pointsChanged.points);
    }
  }, [data]);

  /*
  const onNext = (data) => {
    setPoints(data.data.pointsChanged.points);
  }

  const subscription = client.subscribe({
    query: subscriptionQuery,
  }, {
    next: onNext,
  })

   */

  return(
    <div className="main">
      <h1>Points</h1>
      <div className="points">{points}</div>
    </div>
  );
}
