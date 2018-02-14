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
  res.json(JSON.stringify(await crud.findAll()));
});

//Rechercher un pokemon avec son ID
app.get("/pokemons/:id", function(req, res) {
  //req.query.id
});

//Créer un pokemon
app.post("/pokemons", function(req, res) {
  let name = req.body.name;
  let type = req.body.type;
  let type2 = req.body.type2;
  let niveau = req.body.niveau;
  let image = req.body.image;

  const pokemon = {
    name,
    type,
    type2,
    niveau,
    image
  };
  crud.insertOne(pokemon);
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
