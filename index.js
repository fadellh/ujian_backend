const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const port = 2000;
const util = require('util')
const {uploader} = require('./helper/uploader')
const fs = require('fs')


app.use(bodyParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(cors())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'fadellh',
    password: 'mysql',
    database: 'moviesxxi',
    port: 3306
});

const dba = util.promisify(db.query).bind(db);


app.get('/', (req,res)=> {
    res.status(200).send('<h1>Welcome to Homepage</h1>')
})




app.listen(port, ()=> console.log(`API active at port ${port}` ))
