
import { join } from "path"
import mongoose from "mongoose"
import env from "../.env/config.json";
/**
 * @description 
 * chargement des configurations et integration
 * de la base de données
 */


export   function connect(){
    try{
        // charrgement des configuration
        const DBpath = `${env.db.protocol}://${env.db.host}:${env.db.port}/${env.db.database}`
        mongoose.connect(DBpath)
        mongoose.connection.on('error', err =>{
            console.log(err)
            console.log('MongoDB connection error. Please make sure MongoDB is running.')
            process.exit()
        })
    }catch(e){  
        console.log(e)
    }
}
export    function close(){
    mongoose.connection.close()
}
