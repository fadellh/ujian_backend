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
    database: 'storesus',
    port: 3306
});

const dba = util.promisify(db.query).bind(db);


app.get('/', (req,res)=> {
    res.status(200).send('<h1>Welcome to Homepage</h1>')
})

// ============ CRUD PRODUCT ============ CRUD PRODUCT============ CRUD PRODUCT============ CRUD PRODUCT============ CRUD PRODUCT
// ============ CRUD PRODUCT ============ CRUD PRODUCT============ CRUD PRODUCT============ CRUD PRODUCT============ CRUD PRODUCT
// ============ CRUD PRODUCT ============ CRUD PRODUCT============ CRUD PRODUCT============ CRUD PRODUCT============ CRUD PRODUCT

app.get('/product', async (req,res)=> {
    let sql = `select * from product`
    try{
        let result = await dba(sql)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.post('/product-add',(req,res)=> {
    try{
        let path = '/image'
        let upload = uploader(path, 'PRT').fields([{name: 'image'}])
        upload(req,res, async (err)=> {
            const {image} = req.files
            const {nama,harga} = JSON.parse(req.body.data)
            console.log(JSON.parse(req.body.data))

            const imagePath = image?`${path}/${image[0].filename}`:null
            let sql = `INSERT INTO product (nama, harga, imagePath) values ('${nama}',${harga},'${imagePath}')`
             await dba(sql)
                if(err){
                    fs.unlinkSync(`./public${imagePath}`)
                    res.status(500).send(err.message)
                }
                res.status(201).send({
                    status : 'created',
                    message: 'Data Created!'
                })
            
        })
    }catch(err){
        res.status(500).send(err.message)
    }
})

app.patch('/product-update/:id', (req,res)=>{
    let {id} = req.params
    let sql = `select * from product where product_id=${id}`
    db.query(sql, (err,result)=>{
        if(err) res.status(400).send(err.message)
        let oldImagePath = result[0].imagePath
        try{
            let path = '/image'
            let upload = uploader(path,'PRT').fields([{name: 'image'}])

            upload(req,res, (err)=>{
                const {image} = req.files
                const {nama, harga} = JSON.parse(req.body.data)
                console.log(req.files)

                const imagePath = image?`${path}/${image[0].filename}`:oldImagePath
                let sql = `update product set nama='${nama}',harga=${harga},imagePath='${imagePath}' where product_id=${id}`
                db.query(sql ,(err,update)=>{
                    if(err){
                        fs.unlinkSync(`./public${imagePath}`) //../pu
                        res.status(500).send(err.message)
                    }
                    if(image){
                        // console.log(`./public/${imagePath}`)
                        fs.unlinkSync(`./public${oldImagePath}`)//./public/image/MVT73473467
                    }
                    res.status(201).send({
                        status : 'Success',
                        message: 'Data Edited!'
                    })
                })
            })
        }catch(err){ 
            res.status(500).send(err.message)
          }
    })
})

app.delete('/product-delete/:id', (req,res)=>{
    let {id} = req.params
    let sql = `select * from product where product_id=${id}`
    db.query(sql, (err,result)=>{
        if(err) res.status(400).send(err.message)
        let oldImagePath = result[0].imagePath
        try{

            let sql = `delete from product where product_id=${req.params.id}`
            db.query(sql, (err,del)=>{
                if(err){
                    res.status(500).send(err.message)
                }
                if(oldImagePath){
                    // console.log(`./public/${imagePath}`)
                    fs.unlinkSync(`./public${oldImagePath}`)//./public/image/MVT73473467
                }
                res.status(201).send({
                    status : 'Deleted Succsee',
                    message: 'Data Deleted!'
                })
            })
        }catch(err){
            res.status(500).send(err.message)
        }
    })
})


// ====== CRUD Store ====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store
// ====== CRUD Store ====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store
// ====== CRUD Store ====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store
// ====== CRUD Store ====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store====== CRUD Store

app.get('/store', async (req,res)=> {
    let sql = `select * from store`
    try{
        let result = await dba(sql)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.post('/store-add', async (req,res)=>{
    let sql = `INSERT INTO store SET ?`
    try{
        await dba(sql,req.body)
        let get = `Select * from store`
        let result = await dba(get)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.patch('/store-update/:id', async (req,res)=>{
    let {id} = req.params
    let sql = `UPDATE store SET ? where store_id=${id}`
    try{
        await dba(sql,req.body)
        let get = `Select * from store`
        let result = await dba(get)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.delete('/store-delete/:id',async (req,res)=>{
    let sql = `DELETE from store where store_id=${req.params.id}`
    try{
        await dba(sql)
        let get = `Select * from store`
        let result = await dba(get)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

//No.3
// ===== CRUD INVENTORY ===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY
// ===== CRUD INVENTORY ===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY
// ===== CRUD INVENTORY ===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY
// ===== CRUD INVENTORY ===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY===== CRUD INVENTORY


app.get('/inventory', async (req,res)=> {
    let sql = `SELECT 
                    i.inventory_id,
                    p.nama AS Product,
                    s.branch_name AS 'Branch Name',
                    i.inventory AS Stock
                FROM inventory i
                    JOIN product p
                    ON i.product_id=p.product_id
                    JOIN store s
                    ON i.store_id=s.store_id;`
    try{
        let result = await dba(sql)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.post('/inventory-add/:product_id/:store_id/:inventory', async (req,res)=>{
    let sql = `INSERT INTO inventory SET ?`
    try{
        await dba(sql,req.params)
        let get = `Select * from inventory`
        let result = await dba(get)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.patch('/inventory-update/:id/:inventory', async (req,res)=>{
    let {id} = req.params
    let sql = `UPDATE inventory SET inventory=${req.params.inventory} where inventory_id=${id}`
    try{
        await dba(sql,req.body)
        let get = `Select * from inventory`
        let result = await dba(get)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.delete('/inventory-delete/:inventory_id',async (req,res)=>{
    let sql = `DELETE from inventory where inventory_id=${req.params.inventory_id}`
    try{
        await dba(sql)
        let get = `Select * from inventory`
        let result = await dba(get)
        res.status(200).send(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})


app.listen(port, ()=> console.log(`API active at port ${port}` ))


