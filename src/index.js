const express = require("express")
const redis = require("re")
const app = express()
const { join } = require("path")
const { ApolloServer } = require("apollo-server-express")
const db = require("./db")
const typeDefs = require('./schema')
const resolvers = require("./resolvers")
const models = require('./models')
const jwt = require("jsonwebtoken")
db.connect(process.env.DB_HOST)

// const db = mysql.createPool({
//     host: 'localhost',
//     user:'root',
//     password:'root',    
//     database:'srsi_bd'
// })
// const query = util.promisify(db.query).bind(db);
// app.use(cookieParser("srsi session"));

    /*app.use(session({
        secret: "session srsi admin",
        saveUninitialized: false,
        resave:false,
        cookie:{
            maxAge: 60*60*24*1000
        }
    }))*/


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
        res.sendFile(join(process.cwd(), 'views/index.html'))
    })

process.on('uncaughtException', function(err){
    console.error('This will catch at last the ' +
    'JSON parsing exception: ' + err.message);
});

const getUser = token => {
    if(token){
        try {
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (e) {
            throw new Error('session invalid')
        }
    }
}
async function startApolloServer(typeDefs, resolvers){
    const server = new ApolloServer({
        typeDefs, 
        resolvers,
        context: async ({ req })=>{
            const token = req.headers.authorization
            const user = await getUser(token)
            return {models, user}
        }
    })
    await server.start()
    server.applyMiddleware({app, path: '/api'})
}
startApolloServer(typeDefs, resolvers)
app.listen(app.get('port'), ()=>{console.log("Express server start",app.get('port'))})
