const express = require("express")
const { join } = require("path")
const route = express.Router()
route.get('/',(req, res)=>{
    res.send("Connected to server")
})
module.exports = route