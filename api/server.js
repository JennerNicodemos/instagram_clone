let express = require('express')
let bodyParser = require('body-parser')
let mongodb = require('mongodb')

let app = express()

// body-parser
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

let port = 8080

app.listen(port)

console.log('Servidor HTTP está escutando na porta ' + port)

app.get('/', function(req, res){
    let answer = { msg: "Olá"}
    res.send(answer)
    // res.send({msg: 'Olá'}) 

})