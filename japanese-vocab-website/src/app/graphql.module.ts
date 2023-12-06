import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from '@env/environment';
import { HttpHeaders } from '@angular/common/http';

const graphqlUrl = environment.graphqlApiRoute;
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({
      uri: graphqlUrl,
      headers: new HttpHeaders({
        // 'x-hasura-admin-secret': environment.hasuraAdmin ?? 'NOT AN ADMIN',
        'x-hasura-role': environment.hasuraRole ?? 'NO ROLE WAS DEFINED'
      }),
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
      mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
