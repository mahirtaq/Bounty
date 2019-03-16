const graphql = require('graphql');

module.exports = graphql.buildSchema(`
  type Bounty {
    _id: ID!,
    price: Float!,
    class: String,
    description: String!,
    creator: User!
  }

  type User {
    _id: ID!,
    name: String!,
    email: String!,
    password: String,
    createdBounties: [Bounty!]
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
`);