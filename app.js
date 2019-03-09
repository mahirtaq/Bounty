//UPDATE MONGODB IPWHITELIST WITH UMICH IPS
const express = require('express');
const graphqlHttp = require('express-graphql');
const graphql = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Bounty = require('./models/Bounty');
const User = require('./models/User');

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

    type User {
      _id: ID!,
      name: String!,
      email: String!,
      password: String
    }

    type RootQuery {
      bounties: [Bounty!]!
    }

    input BountyInput {
      price: Float!,
      class: String,
      description: String!
    }

    input UserInput {
      name: String!,
      email: String!,
      password: String!
    }

    type RootMutation {
      createBounty(bountyInput: BountyInput): Bounty,
      createUser(userInput: UserInput): User
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
        description: args.bountyInput.description,
        creator: '5c8301ee10e7af2c782f648e'
      });
      let createdBounty;
      return bounty.save()
        .then(result => {
          createdBounty = { ...result._doc };
          return User.findById('5c8301ee10e7af2c782f648e')
        })
        .then(user => {
          if (!user){
            throw new Error('User not found.');
          }
          user.createdBounties.push(bounty);
          return user.save();
        })
        .then(result => {
          return createdBounty;
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    },
    createUser: (args) => {
      // Check if email already exists in db
      return User.findOne({ email: args.userInput.email })
        .then(user => {
          if (user){
            throw new Error('Email already exists.');
          }
          return bcrypt.hash(args.userInput.password, 12)
        })
        // Hash password
        .then(hashedPass => {
          const user = new User({
            name: args.userInput.name,
            email: args.userInput.email,
            password: hashedPass
          });
          // Save into db, return null password for security
          return user.save()
            .then(result => {
              console.log(result);
              return { ...result._doc, password: null };
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }
  },
  graphiql: true
}));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@bount-cluster0-reeyh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  
  })
  .catch(err => {
    console.log(err);
  });
