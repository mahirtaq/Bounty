// UPDATE MONGODB IPWHITELIST WITH UMICH IPS
// ADD DATES, TIME WHEN BOUNTIES WERE CREATED
const express = require('express');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Graphql schema
app.use('/graphql', graphqlHttp({
  //FIX SHCHEMA
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
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
