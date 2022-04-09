import { ApolloServer } from "apollo-server-express"
import collection from "./models"
async function startApolloServer(app, typeDefs, resolvers){
    const server = new ApolloServer({
        typeDefs, 
        resolvers
    })
    await server.start()
    server.applyMiddleware({app, path: '/api'})
}
module.exports = {startApolloServer}