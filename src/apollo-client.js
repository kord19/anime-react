import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphql.anilist.co', // URL do endpoint GraphQL da AniList
  }),
  cache: new InMemoryCache(),
});

export default client;
