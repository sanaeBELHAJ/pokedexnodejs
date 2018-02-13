const express = require('express');
const app = express();
const crud = require('./crud.js');

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/pokemons',function(req, res){
    
});

app.get('/pokemons/:id',function(req, res){
    
});

app.get('',function(req, res){
    
});

app.get('',function(req, res){
    
});

app.get('',function(req, res){
    
});

app.get('',function(req, res){
    
});