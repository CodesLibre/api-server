import { ApolloServer } from "apollo-server-express"
import { verify } from "jsonwebtoken"
import * as collection from "./models"
import env from '../.env/config.json'
const getUser = token =>{
    try {
        return verify(token, env.server.auth.JWTSECRET);
    } catch (err) {
        return null
    }
}
async function startApolloServer(app, typeDefs, resolvers){
    const server = new ApolloServer({
        typeDefs, 
        resolvers,
        context: ({req})=>{
            let auth = req.headers.authorization
            // get user token authorization from headers
            
            const token = req.headers.authorization
            //retreive a user with the token
            const user = getUser(token)
            // add user context
            return {user}
        }
    })
    await server.start()
    server.applyMiddleware({app, path: '/api'})
}
export default startApolloServer