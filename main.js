const express = require("express");
const app = express();
const crud = require("./crud.js");
const bringPkm = require("./script.js");
//const user = require('./user.js');

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

//Liste de tous les pokemons en BDD
app.get('/pokemons',function(req, res){
  res.send('test');
  crud.findAll();
});

//Rechercher un pokemon avec son ID
app.get('/pokemons/:id',function(req, res){
  //req.query.id
});

//Créer un pokemon
app.post('/pokemons',function(req, res){

});

//Mettre à jour un pokemon
app.put('/pokemons/:id',function(req, res){

app.patch("/pokemons/:id", function(req, res) {});

//Modifier un pokemon
app.patch('/pokemons/:id',function(req, res){

});

//Supprimer un pokemon
app.delete('/pokemons/:id',function(req, res){

});

//Récupérer la liste de tous les pokemons sur Internet
app.get('/bringPokemons', async function(req, res){
  let liste = JSON.parse(JSON.stringify(await bringPkm.callApi(res)));
  res.json(liste);
  crud.insert(liste);
});
