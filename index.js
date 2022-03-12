const express = require("express")
const app = express()
    app.set('trust proxy', 1) // trust first proxy
    app.set('port', process.env.PORT || 3001);
    app.set('appName', 'api-server');
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
/**
 * capture all exception
 */
process.on('uncaughtException', function(err){
    console.error('This will catch at last the ' +
    'JSON parsing exception: ' + err.message);
});
/**
 * put code here to connect Express to appolo server
 */
app.listen(app.get('port'), ()=>{console.log("Express server start",app.get('port'))})
