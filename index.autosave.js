const express = require("express")
const app = express()
const http = require('http')
const { ApolloServer, gql } = require("apollo-server-express")
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core")
const mysql = require("mysql")
var session = require("express-session")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const util = require("util")
const cors = require('cors')
const formidable = require('formidable')
const  fs_p = require ('fs/promises')
const  fs = require ('fs')
const { access, mkdir, rename } = require ('fs/promises')
const { dirname } = require("path")
const { join } = require("path")
const path = require("path")
const crypto = require('crypto')
const optionsStatic = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }
let sessions
const hash = (data)=>{
    return crypto.createHash("sha256").update(data, "binary").digest('base64')
}

// Construct a schema, using GraphQL's schema language
const typeDefs = gql`
    type Query {
        hello: String
    }`;

// Provide resolver functions for our schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!'
    }
};

// const db = mysql.createPool({
//     host: 'localhost',
//     user:'root',
//     password:'root',    
//     database:'srsi_bd'
// })
// const query = util.promisify(db.query).bind(db);
    app.use(cookieParser("srsi session"));

    app.use(session({
        secret: "session srsi admin",
        saveUninitialized: false,
        resave:false,
        cookie:{
            maxAge: 60*60*24*1000
        }
    }))


    app.set('trust proxy', 1) // trust first proxy
    app.set('port', process.env.PORT || 3001);
    app.set('appName', 'solitaire');
    app.set('views', join(__dirname,'views'));

    app.use((req, res, next)=>{
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, UPDATE, PATCH, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Credentials', false)
        next()
    })

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/static", express.static(join(__dirname, 'public')))

    app.get('/',(req, res)=>{
        res.sendFile(join(__dirname, 'views/index.html'))
    })

process.on('uncaughtException', function(err){
    console.error('This will catch at last the ' +
    'JSON parsing exception: ' + err.message);
});
async function startApolloServer(typeDefs, resolvers){
    const server = new ApolloServer({
        typeDefs, 
        resolvers
    })
    await server.start()
    server.applyMiddleware({app, path: '/api'})
}
startApolloServer(typeDefs, resolvers)
app.listen(app.get('port'), ()=>{console.log("Express server start",app.get('port'))})
