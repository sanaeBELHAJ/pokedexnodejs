const express = require('express');
const app = express();
const crud = require('./crud.js');
const bringPkm = require('./script.js');

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/pokemons',function(req, res){
  res.send('test');
});

app.get('/pokemons/:id',function(req, res){
  //req.query.id
});

app.post('/pokemons',function(req, res){

});

app.put('/pokemons/:id',function(req, res){

});

app.patch('/pokemons/:id',function(req, res){

});

app.delete('/pokemons/:id',function(req, res){

});

app.get('/bringPokemons', async function(req, res){
  let liste = await bringPkm(res);
  console.log(liste);
  res.json(JSON.parse(JSON.stringify(liste)));
  
});