const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

// const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://khangse616:khangse616@cluster0-wpib7.mongodb.net/databaseGraphql?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect(uri, {useNewUrlParser: true});
mongoose.connection.once("open", ()=>{
    console.log("connected to database");
});

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, ()=>{
    console.log("now listening for request on port 4000");
});