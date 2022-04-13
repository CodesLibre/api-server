import {Router} from "express"
import { join } from "path"
const route = Router()
route.get('/',(req, res)=>{
    res.send("Connected to server")
})
export default route