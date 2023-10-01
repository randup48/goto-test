'use client';

import { ApolloProvider } from '@apollo/client';
import client from './apollo';

export const ApolloProviders = (props: React.PropsWithChildren) => {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
