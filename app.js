//UPDATE MONGODB IPWHITELIST WITH UMICH IPS
const express = require('express');
const graphqlHttp = require('express-graphql');
const graphql = require('graphql');
const mongoose = require('mongoose');

const Bounty = require('./models/bounty');

const app = express();


// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Graphql schema
app.use('/graphql', graphqlHttp({
  //FIX SHCHEMA
  schema: graphql.buildSchema(`
    type Bounty {
      _id: ID!,
      price: Float!,
      class: String,
      description: String!
    }

    type RootQuery {
      bounties: [Bounty!]!
    }

    input BountyInput {
      price: Float!,
      class: String,
      description: String!
    }

    type RootMutation {
      createBounty(bountyInput: BountyInput): Bounty
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    bounties: () => {
      return Bounty.find()
      .then(bounties => {
        return bounties.map(bounty => {
          return { ...bounty._doc };
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    },
    createBounty: (args) => {
      const bounty = new Bounty({
        price: +args.bountyInput.price,
        class: args.bountyInput.class,
        description: args.bountyInput.description
      });
      return bounty.save()
      .then(result => {
        console.log(result);
        return { ...result._doc };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    }
  },
  graphiql: true
}));

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@bount-cluster0-reeyh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
).then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  
})
.catch(err => {
  console.log(err);
});
