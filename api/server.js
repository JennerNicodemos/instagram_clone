let express = require('express')
let bodyParser = require('body-parser')
let mongodb = require('mongodb')
let objectId = require('mongodb').ObjectId

let app = express()

// body-parser
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

let db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),
    {}
)

let port = 8080

app.listen(port)

console.log('Servidor HTTP está escutando na porta ' + port)

app.get('/', function(req, res){
    let answer = { msg: "Olá"}
    res.send(answer)
    // res.send({msg: 'Olá'}) 
})

// POST (create)
app.post('/api', function(req, res){

    res.setHeader("Access-Control-Allow-Origin", "*")
    let dados = req.body
    res.send(dados)
    
    // db.open( function(err, mongoclient){
    //     mongoclient.collection('postagens', function(err, collection){
    //         collection.insert(dados, function(err, records){
    //             if(err){
    //                 res.json({'status' : 'Erro'})
    //             } else {
    //                 res.json({ 'status' : 'Inclusão realizada com sucesso'})
    //             }
    //             mongoclient.close()
    //         })
    //     })
    // })
})

// GET (ready)
app.get('/api', function(req, res){
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