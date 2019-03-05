const express = require('express');
const graphqlHttp = require('express-graphql');
const graphql = require('graphql');

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/graphql', graphqlHttp({
  //FIX SHCHEMA
  schema: graphql.buildSchema(`
    type RootQuery {
      bounties: [String!]!
    }

    type RootMutation {
      createBounty(poster: String!, value: Int!, 
        class: String!, description: String!): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    bounties: () => {
      return ['OHDd', 'dfadsf', 'adfd'];
    },
    createBounty: (args) => {
      return args.poster;
    }
  },
  graphiql: true
}));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
