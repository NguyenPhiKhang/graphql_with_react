const graphql = require('graphql');
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// dummy data
// var books = [
//     { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "2" },
//     { name: "The final Empire", genre: "Fantasy", id: "2", authorId: "3" },
//     { name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "1" },
//     { name: "The Hero of Ages", genre: "Sci-Fi", id: "4", authorId: "2" },
//     { name: "The Colour of Magic", genre: "Sci-Fi", id: "5", authorId: "2" },
//     { name: "The Light Fantasic", genre: "Sci-Fi", id: "6", authorId: "3" },
// ];

// var authors = [ 
//     { name: "ASDFG", age: 12, id: "1" },
//     { name: "jjlkjljklj", age: 86, id: "2" },
//     { name: "gnuyen phi khang", age: 22, id: "3" }
// ];

const BookType = new GraphQLObjectType({
    name: "Book",
    fields:()=>({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // console.log(parent);
                // return _.find(authors, { id: parent.id });
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                console.log(parent);
                // return _.filter(books, {authorId: parent.id});
                return Book.find({authorId: parent.id});
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: ()=>({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db/ other source
                //console.log(args);
                // return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books;
                return Book.find({});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors;
                return Author.find({});
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor:{
            type: AuthorType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook:{
            type: BookType,
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                genre: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})