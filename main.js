const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const crud = require("./crud.js");
const bringPkm = require("./script.js");
const user = require("./user.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log("***************Démarrage de l'application sur le port 3000!***************");
});

//Liste de tous les pokemons en BDD
app.get("/pokemons", async function(req, res) {
  res.json(JSON.parse(JSON.stringify(await crud.findAll())));
});

//Récupérer les infos d'un pokemon
app.get("/pokemons/:search", async function(req, res) {
  var pokemon = await getPkm(req.params.search);

  if (pokemon == null) res.send("AUCUN POKEMON TROUVE");
  else res.send(pokemon);
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

  //Vérification de l'unicité du nom du pokemon
  var find = await crud.searchPoke(pokemon.name);

  if (find == null) {
    var insert = await crud.insertOne(pokemon);
    console.log("insert : "+insert);
    
    if(insert === null) res.send("ERREUR DANS LES PARAMETRES DU POKEMON");
    else res.send("NOUVEAU POKEMON ENREGISTRE");
  }
  else
    res.send("CE POKEMON EXISTE DEJA");
});

/*
//Mettre à jour un pokemon
app.put("/pokemons/:search", async function(req, res) {
  var pokemon = await getPkm(req.params.search);
  if (pokemon.pokemon == null) res.send("Pokemon introuvable");
  else {
    if (pokemon.pokemon && pokemon.pokemon._id) {
      if(req.body.niveau && isNaN(parseInt(req.body.niveau, 10)))
        res.send("Le niveau doit être un nombre");
      else{
        crud.update(pokemon.pokemon, req.body);
        res.send("Pokemon mis à jour");
      }
    } 
    else 
      res.send("Pokemon introuvable");
  }
});
*/

//Modifier un pokemon
app.patch("/pokemons/:search", async function(req, res) {
  var pokemon = await getPkm(req.params.search);
  if (pokemon.pokemon == null) res.send("Pokemon introuvable");
  else {
    if (pokemon.pokemon && pokemon.pokemon._id) {
      if(req.body.niveau && isNaN(parseInt(req.body.niveau, 10)))
        res.send("Le niveau doit être un nombre");
      else{
        crud.update(pokemon.pokemon, req.body);
        res.send("Pokemon mis à jour");
      }
    } 
    else 
      res.send("Pokemon introuvable");
  }
});

//Supprimer un pokemon
app.delete("/pokemons/:search", async function(req, res) {
  var pokemon = await getPkm(req.params.search);

  if (pokemon == null) res.send("Pokemon introuvable");
  else {
    if (pokemon && pokemon._id) {
      crud.remove(pokemon._id);
      res.send("Pokemon supprimé");
    } else res.send("Pokemon introuvable");
  }
});

//Récupérer la liste de tous les pokemons sur Internet
app.get("/bringPokemons", async function(req, res) {
  //Renouvellement de la BDD
  let bdd = JSON.parse(JSON.stringify(await crud.findAll()));
  if (bdd) {
    bdd.forEach(function(element) {
      crud.remove(element._id);
    });
  }

  //Insertion des nouvelles données via webscraping
  let liste = JSON.parse(JSON.stringify(await bringPkm.callApi(res)));
  res.json(liste);
  crud.insertAll(liste);
});

async function getPkm(search){
  //Recherche par nom
  if(isNaN(parseInt(search,10)))
    return await crud.searchPoke(search); 
  else //Recherche par ID
    return await crud.findOne(parseInt(search,10));
}

//Créer un utilisateur
app.post("/users", function(req, res) {
  console.log("coucou");
  const u = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password
  };
  console.log(u);
  var insert = user.register(u);
  res.send("insert : " + u);
});

//Créer un utilisateur
app.get("/users", async function(req, res) {
  console.log("coucou");
  var users = await user.findAll();
  res.send(users);
  // console.log(users);
});
