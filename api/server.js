let express = require('express')
let bodyParser = require('body-parser')
let multiparty = require('connect-multiparty')
let mongodb = require('mongodb')
let objectId = require('mongodb').ObjectId
let fs = require('fs')
const { timeStamp } = require('console')

let app = express()

// body-parser
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())
app.use(multiparty())

let db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),
    {}
)

let port = 8080

app.listen(port)

console.log('Servidor HTTP está escutando na porta ' + port)

app.get('/', function(req, res){
    let dados = { msg: "Olá"}
    res.send(dados)
    // res.send({msg: 'Olá'}) 
})

// POST (create)
app.post('/api', function(req, res){

    res.setHeader("Access-Control-Allow-Origin", "*")

    let date = new Date()
    time_stamp = date.getTime()
    let url_imagen = time_stamp + '_' + req.files.arquivo.originalFilename

    console.log(req.files)

    let path_origem = req.files.arquivo.path
    let path_destino = './uploads/' + url_imagen

    

    /* fs.rename(path_origem, path_destino, function(err){
        if (err) {
            res.status(500)
            // res.json({ erro: err })
            return
        }
    }) */

    // Lê o arquivo original
    fs.readFile(path_origem, function(err, data) {
    
        // Grava o novo arquivo
        fs.writeFile(path_destino, data, function(err) {
            
            let dados = {
                url_imagen: url_imagen,
                titulo: req.body.titulo
            }
            
            if (!err) {

                // Inserção dos dados no banco
                db.open( function(err, mongoclient){
                    mongoclient.collection('postagens', function(err, collection){
                        collection.insert(dados, function(err, records){
                            if(err){
                                res.json({'status' : 'Erro'})
                            } else {
                                res.json({ 'status' : 'Inclusão realizada com sucesso'})
                            }
                            mongoclient.close()
                        })
                    })
                })
            }
        });
        // Remove o arquivo original
        fs.unlink(path_origem, (err) => {  
            if (err) {
              return console.log(err)
            }
            console.log('arquivo deletado com sucesso!')
          })
    });
})

// GET (ready)
app.get('/api', function(req, res){

    res.setHeader("Access-Control-Allow-Origin", "*")

    db.open( function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.find().toArray(function(err, results){
                if(err){
                    res.json(err)
                } else {
                    res.json(results)
                }
                mongoclient.close()
            })
        })
    })
})

// GET by ID (ready)
app.get('/api/:id', function(req, res){
    db.open( function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.find(objectId(req.params.id)).toArray(function(err, results){
                if(err){
                    res.json(err)
                } else {
                    res.json(results)
                }
                mongoclient.close()
            })
        })
    })
})

// PUT by ID (update)
app.put('/api/:id', function(req, res){
    db.open( function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.update(
                { _id : objectId(req.params.id) },
                { $set : { titulo : req.body.titulo}},
                {},
                function(err, records) {
                    if (err) {
                        res.json(err)
                    } else {
                        res.json(records)
                    }
                    mongoclient.close()
                }
            )
        })
    })
})

// DELETE by ID (remover)
app.delete('/api/:id', function(req, res){
    db.open( function(err, mongoclient){
        mongoclient.collection('postagens', function(err, collection){
            collection.remove({ _id : objectId(req.params.id) }, function(err, records){
                if (err) {
                    res.json(err)
                } else {
                    res.json(records)
                }
                mongoclient.close()
            })
        })
    })
})