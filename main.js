const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const crud = require("./crud.js");
const bringPkm = require("./script.js");
//const user = require('./user.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});


//Liste de tous les pokemons en BDD
app.get("/pokemons", async function(req, res) {
  //res.json(JSON.stringify(await crud.findAll()));
  crud.findAll(res);
});

//Récupérer les infos d'un pokemon
app.get("/pokemons/:name", async function(req, res) {
  console.log(req.body.name);
  var find = await crud.searchPoke(req.body.name); 
  console.log("find : "+find);
  
  if(find == null){
    console.log("AUCUN POKEMON TROUVE");
    res.send("AUCUN POKEMON TROUVE");
  }
  else{
    console.log(find);
    res.send(find);
  }
});

//Créer un pokemon
app.post("/pokemons", async function(req, res) {

  const pokemon = {
    name: req.body.name,
    type: req.body.type,
    type2: req.body.type2,
    niveau: req.body.niveau,
    img: req.body.img
  };
  
  var find = await crud.searchPoke(pokemon.name); 
  console.log("find : "+find);
  
  if(find == null){
    var insert = await crud.insertOne(pokemon);
    console.log("insert : "+insert);
    
    if(insert)
      res.send("NOUVEAU POKEMON ENREGISTRE");
    else 
      res.send("ERREUR DANS LES PARAMETRES DU POKEMON");
  }
  else
    res.send("CE POKEMON EXISTE DEJA");
});

//Mettre à jour un pokemon
app.put("/pokemons/:id", function(req, res) {});

//Modifier un pokemon
app.patch("/pokemons/:id", function(req, res) {});

//Supprimer un pokemon
app.delete("/pokemons/:id", function(req, res) {});

//Récupérer la liste de tous les pokemons sur Internet
app.get("/bringPokemons", async function(req, res) {
  //Vidage de la base

  /*let bdd = crud.findAll();
  if(bdd){
    bdd.forEach(element => {
      crud.remove(element.id);
    });
  }*/
  
  //Insertion des nouvelles données
  let liste = JSON.parse(JSON.stringify(await bringPkm.callApi(res)));
  res.json(liste);
  crud.insertAll(liste);
});
