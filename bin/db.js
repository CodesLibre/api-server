import { readFileSync } from "fs"
import { join } from "path"
import mongoose from "mongoose"

/**
 * @description 
 * chargement des configurations et integration
 * de la base de données
 */

try{
    // charrgement des configuration
    const file = readFileSync(join(process.cwd(),'.env/config.json'),"utf8")
    const config = JSON.parse(file)
    console.log(config)
    const DBpath = `${config.db.protocol}://${config.db.host}:${config.db.port}/${config.db.database}`
    mongoose.connect(DBpath)
    mongoose.connection.on('error', err =>{
        console.log(err)
        console.log('MongoDB connection error. Please make sure MongoDB is running.')
        process.exit()
    })
    process.on('close', ()=>{
        mongoose.connection.close()
    })
}catch(e){  
    console.log(e)
}