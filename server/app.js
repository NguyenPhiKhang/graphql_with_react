const express = require("express");
const {createServer} = require("http");
const {graphqlExpress, graphiqlExpress} = require("graphql-server-express");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

// allow cross-origin requests
app.use(cors());

app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-wpib7.mongodb.net/databaseGraphql?retryWrites=true&w=majority`;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
mongoose.connection.once("open", ()=>{
    console.log("connected to database");
});

// app.use("/graphql", graphqlHTTP({
//     schema,
// }));

app.use('/graphql', graphqlExpress({
    schema
}))

app.use("/graphiql",graphiqlExpress({
    endpointURL: '/graphql'
}))

const server = createServer(app);

server.listen(4000, ()=>{
    console.log("now listening for request on port 4000");
});