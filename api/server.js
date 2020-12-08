let express = require('express')
let bodyParser = require('body-parser')
let mongodb = require('mongodb')

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

app.post('/api', function(req, res){
    let dados = req.body
    
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
})