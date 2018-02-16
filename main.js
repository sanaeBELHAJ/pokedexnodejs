const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const crud = require("./crud.js");
const bringPkm = require("./script.js");
const user = require("./user.js");
const userpokemon = require("./userpokemon.js");
const jwt = require("jsonwebtoken");

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
  crud.insertAll(liste, res);
  res.json(liste);
});

//Créer un pokemon
app.post("/pokemons", async function(req, res) {
  const pokemon = {
    idnational: req.body.idnational,
    name: req.body.name,
    type: req.body.type,
    type2: req.body.type2,
    niveau: req.body.niveau,
    img: req.body.img
  };
  var insert = await crud.insertOne(pokemon, res);
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
  if (pokemon && pokemon._id) {
    await crud.update(pokemon, req.body);
    res.send("Pokemon mis à jour");
  } else res.send("Pokemon introuvable");
});

//Supprimer un pokemon
app.delete("/pokemons/:search", async function(req, res) {
  var pokemon = await crud.findOne(req.params.search);
  if (pokemon && pokemon._id) {
    await crud.remove(pokemon._id);
    res.send("Pokemon supprimé");
  } else res.send("Pokemon introuvable");
});

/******** UTILISATEUR ********/

//Créer un utilisateur
app.post("/users", function(req, res) {
  const u = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password
  };

  var insert = user.register(u);
  res.send("Création correctement effectuée.");
});

//afficher tous les utilisateurs
app.get("/users", async function(req, res) {
  var users = await user.findAll();
  res.send(users);
  // console.log(users);
});

//Login d'un user
app.post("/users/login", async function(req, res) {
  var u = await user.sign_in(req.body, res);
});

//Récupérer les infos d'un user
app.get("/users/:search", verifyToken , async function(req, res) {
  var u = await user.findOne(req.params.search);
  console.log(u);
  if (u == null) res.send("AUCUN USER TROUVE");
  else res.send(u);
});

//Ajouter un pokémon à un utilisateur
app.post("/users/:id/pokemons", verifyToken, async function(req, res) {
  var u = await user.findOne(req.params.id);
  var p = await crud.findOneById(req.body.id_pokemon);
  listpokemon = [];
  if (u != null && p != null) {
    if (req.body.niveau <= 100) {
      u.pokemons.forEach(function(pokemon) {
        if (pokemon.id != req.body.id_pokemon) {
          listpokemon.push({
            id: pokemon.id,
            niveau: pokemon.niveau
          });
        } 
        else {
          res.send("pokemon existe deja");
        }
      });
      newpokemon = {
        id: req.body.id_pokemon,
        niveau: req.body.niveau
      };
      listpokemon.push(newpokemon);
      var pokemon = {
        pokemons: listpokemon
      };
      var response = user.addpokemon(req.params.id, pokemon);
      res.send(response);
      console.log(u);
    } 
    else
      res.send("le niveau ne doit pas dépasser 100");
  } 
  else
    res.send("l'utilisateur ou le pokemon n'existe pas");
});

//liste tous les pokemons d'un utilisateur
app.get("/users/:id/pokemons", verifyToken, async function(req, res) {
  var u = await user.findOne(req.params.id);
  //console.log(u);
  if (u != null) {
    const pokemons = [];
    for (pokemon of u.pokemons) {
      var p = await crud.findOneById(pokemon.id);
      pokemons.push(p);
    }
    console.log(pokemons);
    res.send(pokemons);
  }
});

//récupère un pokemon d'un utilisateur
app.get("/users/:id/pokemons/:idpokemon", verifyToken, async function(req, res) {
  var u = await user.findOne(req.params.id);
  if (u != null) {
    const pokemons = [];
    for (pokemon of u.pokemons) {
      if (pokemon.id == req.params.idpokemon) {
        var p = await crud.findOneById(pokemon.id);
        pokemons.push(p);
      }
    }
    console.log(pokemons);
    if (pokemons != null) {
      res.send(pokemons);
    } else {
      res.send("Pokemon n'existe pas dans la liste de pokemon");
    }
  }
});

//Modifier un pokemon d'un utilisateur(son niveau)
app.put("/users/:id/pokemons/:idpokemon", verifyToken, async function(req, res) {
  var u = await user.findOne(req.params.id);
  listpokemon = [];
  if (u != null) {
    if (req.body.niveau <= 100) {
      u.pokemons.forEach(function(pokemon) {
        if (pokemon.id != req.params.idpokemon) {
          listpokemon.push({
            id: pokemon.id,
            niveau: pokemon.niveau
          });
        }
      });
      newpokemon = {
        id: req.params.idpokemon,
        niveau: req.body.niveau
      };
      listpokemon.push(newpokemon);
      var pokemon = {
        pokemons: listpokemon
      };
      var response = user.addpokemon(req.params.id, pokemon);
      res.send(response);
      console.log(u);
    } 
    else
      res.send("Le niveau ne doit pas dépasser 100");
  } 
  else
    res.send("l'utilisateur n'existe pas");
});

//Supprimer un pokemon de la liste des pokemons d'un utilisateur
app.delete("/users/:id/pokemons/:idpokemon", verifyToken, async function(req, res) {
  var u = await user.findOne(req.params.id);
  listpokemon = [];
  if (u != null) {
    await u.pokemons.forEach(function(pokemon) {
      if (pokemon.id != req.params.idpokemon) {
        listpokemon.push({
          id: pokemon.id,
          niveau: pokemon.niveau
        });
      }
    });
    var pokemon = {
      pokemons: listpokemon
    };
    var response = user.addpokemon(req.params.id, pokemon);
    res.send(response);
  }
});
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

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    jwt.verify(req.token, "RESTFULAPIs", (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } 
      
    });
    next();
  } 
  else {
    console.log('TOKEN absent ou invalide');
    // Forbidden
    res.sendStatus(403);
  }
}