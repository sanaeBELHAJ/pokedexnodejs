const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const crud = require("./crud.js");
const bringPkm = require("./script.js");
const user = require("./user.js");
const userpokemon = require("./userpokemon.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(3000, function() {
  console.log(
    "***************Démarrage de l'application sur le port 3000!***************"
  );
});

/******** POKEMONS **********/

//Liste de tous les pokemons en BDD
app.get("/pokemons", async function(req, res) {
  res.json(JSON.parse(JSON.stringify(await crud.findAll())));
});

//Récupérer la liste de tous les pokemons sur Internet
app.get("/bringPokemons", async function(req, res) {
  //Renouvellement de la BDD
  let bdd = JSON.parse(JSON.stringify(await crud.findAll()));
  if (bdd) {
    bdd.forEach(function(pokemon) {
      crud.remove(pokemon._id);
    });
  }

  //Insertion des nouvelles données via webscraping
  let liste = JSON.parse(JSON.stringify(await bringPkm.callApi(res)));
  crud.insertAll(liste);
  res.json(liste);
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
  var find = await crud.findOne(req.params.search);
  if (find == null) {
    if (pokemon.niveau && isNaN(parseInt(pokemon.niveau, 10)))
      res.send("Le niveau doit être un nombre entier");
    else {
      var insert = await crud.insertOne(pokemon);
      console.log("insert : " + insert);
    }
  } else res.send("CE POKEMON EXISTE DEJA");
});

//Récupérer les infos d'un pokemon
app.get("/pokemons/:search", async function(req, res) {
  var pokemon = await crud.findOne(req.params.search);
  if (pokemon == null) res.send("AUCUN POKEMON TROUVE");
  else res.send(pokemon);
});

//Modifier un pokemon
app.patch("/pokemons/:search", async function(req, res) {
  var pokemon = await crud.findOne(req.params.search);
  if (pokemon == null) res.send("Pokemon introuvable");
  else {
    if (pokemon && pokemon._id) {
      if (req.body.niveau && isNaN(parseInt(req.body.niveau, 10)))
        res.send("Le niveau doit être un nombre");
      else {
        crud.update(pokemon, req.body);
        res.send("Pokemon mis à jour");
      }
    } else res.send("Pokemon introuvable");
  }
});

//Supprimer un pokemon
app.delete("/pokemons/:search", async function(req, res) {
  var pokemon = await crud.findOne(req.params.search);
  if (pokemon == null) res.send("Pokemon introuvable");
  else {
    if (pokemon && pokemon._id) {
      crud.remove(pokemon._id);
      res.send("Pokemon supprimé");
    } else res.send("Pokemon introuvable");
  }
});

/******** UTILISATEUR ********/

//Créer un utilisateur
app.post("/users", function(req, res) {
  const u = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password
  };
  console.log(u);
  var insert = user.register(u);
  res.send("insert : " + u);
});
//afficher tous les utilisateurs
app.get("/users", async function(req, res) {
  var users = await user.findAll();
  res.send(users);
  // console.log(users);
});

//Récupérer les infos d'un user
app.get("/users/:search", async function(req, res) {
  var u = await user.findOne(req.params.search);
  console.log(u);
  if (u == null) res.send("AUCUN USER TROUVE");
  else res.send(u);
});

//Ajouter un pokémon à un utilisateur
app.post("/users/:id/pokemons", async function(req, res) {
  console.log("coucou");
  var u = await user.findOne(req.params.id);
  //console.log(u.pokemons.id);
  listpokemon = [];
  if (u != null) {
    u.pokemons.forEach(function(pokemon) {
      if (pokemon.id != req.body.id_pokemon) {
        listpokemon.push({
          id: pokemon.id,
          niveau: pokemon.niveau
        });
      } else {
        console.log("pokemon existe deja");
        // console.log(pokemon.id);
      }
    });

    newpokemon = {
      id: req.body.id_pokemon,
      niveau: req.body.niveau
    };
    if (listpokemon != null) {
      listpokemon.push(newpokemon);
      var pokemon = {
        pokemons: listpokemon
      };
      var response = user.addpokemon(req.params.id, pokemon);
      res.send(response);
    } else {
      res.send("pokemon existe déja dans la liste");
      console.log(u.pokemons);
    }
  }
  console.log(u);
});
//liste tous les pokemons d'un utilisateur
app.get("users/:id/pokemons", async function(req, res) {});
//lister un pokemon d'un utilisateur
app.get("users/:id/pokemons/:id", async function(req, res) {});
//Modifier un pokemon d'un utilisateur(son niveau)
app.put("users/:id/pokemons/:id", async function(req, res) {});
//Supprimer un pokemon de la liste des pokemons d'un utilisateur
app.put("users/:id/pokemons/:id", async function(req, res) {});
/*
  //Mettre à jour un pokemon
  app.put("/pokemons/:search", async function(req, res) {
    var pokemon = await findOne(req.params.search);
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
