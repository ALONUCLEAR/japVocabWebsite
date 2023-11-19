import type { CodegenConfig } from '@graphql-codegen/cli';

const graphqlUrl = 'https://japanese-vocab-graphql-api.onrender.com/graphql';

const config: CodegenConfig = {
  schema: graphqlUrl,
  documents: './src/**/*.graphql.ts',
  generates: {
    './src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
    },
  },
};
export default config;
