import express from "express"
import { readFileSync } from "fs"
import { join } from "path"
import {startApolloServer} from "../graphql"
import { typeDefs, resolvers } from "../graphql/args"
import route from "../router"
import * as db from './db'

const app = express()
const file = readFileSync(join(process.cwd(),'.env/config.json'),"utf8")
const config = JSON.parse(file)
/**
 * configuration du serveur express
 * accessibilités aux ressources
 */

app.set('trust proxy', 1) // trust first proxy
app.set('port', config.server.port || 4000);
app.set('appName', 'api-server');
// Configuration du CORS
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, UPDATE, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Credentials', false)
    next()
})

app.use(express.json());
app.use(express.urlencoded({extended: false}));
//Acces aux ressources statiques
app.use("/static", express.static(join(__dirname, 'public')))
/**
 * routage des requêtes http
 */
app.use(route)
/**
 * demarrage du serveur graphql-appolo
 */
startApolloServer(app, typeDefs, resolvers)
/**
 * demarrage du serveur express
 */
app.listen(app.get('port'), ()=>{console.log(`
web server running at http://localhost:${app.get('port')}
API GraphQL Server running at http://localhost:${app.get('port')}/api\n`)})
/**
 * capture des exceptions
 */
process.on('uncaughtException', function(err){
    console.error('This will catch at last the ' +
    'JSON parsing exception: ' + err.message);
});