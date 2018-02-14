const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pokedex");

mongoose.connect("mongodb://localhost/pokedex");

//Schémas
const evolutionSchema = mongoose.Schema({
  id: Number,
  niveauEvolution: String,
  evolutionName: String
});

const pokemonSchema = mongoose.Schema({
  id: Number,
  idnational: Number,
  name: String,
  type: String,
  type2: String,
  niveau: Number,
  img: String
});

const pokemonEvolutionSchema = mongoose.Schema({
  id_pokemon: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pokemonSchema"
    }
  ],
  id_evolution: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "evolutionSchema"
    }
  ]
});

//Modèles
const Pokemon = mongoose.model("Pokemon", pokemonSchema);
const Evolution = mongoose.model("Evolution", evolutionSchema);
const Pokemonevolution = mongoose.model(
  "Pokemonevolution",
  pokemonEvolutionSchema
);

Pokemonevolution.find((err, pokemonevolutions) => {
  if (err) 
    console.log(err);
  //  console.log(pokemonevolutions);
});

//INSERT ALL
module.exports.insertAll = function(Pokemons) {
  Pokemons.forEach(function(pokemon) {
    const p = new Pokemon({
      idnational: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      type2: pokemon.type2,
      niveau: pokemon.niveau,
      img: pokemon.img
    });

    p.save()
      .then(p => {
        if (p && p._id) {
          if (pokemon.evolutions != null) {
            pokemon.evolutions.forEach(function(evolution) {
              const e = new Evolution({
                niveauEvolution: evolution.niveauEvolution,
                evolutionName: evolution.evolutionName
              });
              e.save()
                .then(e => {
                  if (e && e._id) {
                    const pe = new Pokemonevolution({
                      id_pokemon: p._id,
                      id_evolution: e._id
                    });
                    pe.save();
                  }  
                });
            });
          }
        }
    });
  });
};


//INSERT ONE
module.exports.insertOne = function(pokemon) {
  const p = new Pokemon({
    idnational: pokemon.id,
    name: pokemon.name,
    type: pokemon.type,
    type2: pokemon.type2,
    niveau: pokemon.niveau,
    img: pokemon.img
  });
  //TODO : mauvais retour lors d'une bonne insertion
  return p.save((err, p) => {
    if (err) 
      return null;
    return p;
  });

};

//READ ALL
module.exports.findAll = async function(res) {
  Pokemon.find((err, pokemons) => {
    if (err) console.log(err);
    pokemons.forEach(function(pokemon) {
      console.log(pokemon);
      res.send(pokemon);
      Pokemonevolution.find(
        {
          id_pokemon: pokemon._id
        },
        (err, evolutions) => {
          if (err) console.log(err);
          console.log(evolutions);
        }
      );
    });
  });
};
module.exports.findOne = async function(id, res) {
  Pokemon.find(id, (err, pokemon) => {
    if (err) console.log(err);
    console.log(pokemon);
    res.send(pokemon);
    Pokemonevolution.find(
      {
        id_pokemon: pokemon._id
      },
      (err, evolutions) => {
        if (err) console.log(err);
        res.send(evolutions);
      }
    );
  });
};
findAll();
//findAll();

//Search Pokemon
module.exports.searchPoke = async function(pokemon) {
  return await Pokemon.findOne({'name': pokemon.name}, function(err, doc){
    return doc;
  });
};

//DELETE
module.exports.remove = function(id) {
  Pokemon.remove(
    {
      _id: id
    },
    function(err) {
      if (err) console.log(err);
      console.log("deleted");
    }
  );
  Pokemonevolution.find({ id_pokemon: id }, function(err, pokEvolutions) {
    if (err) console.log(err);
    pokEvolutions.forEach(function(pokEvolution) {
      Evolution.remove(
        {
          _id: pokEvolution.id_evolution
        },
        function(err) {
          if (err) console.log(err);
          console.log("deleted with all his evolution");
        }
      );
    });
  });
  Pokemonevolution.remove(
    {
      id_pokemon: id
    },
    function(err) {
      if (err) console.log(err);
      console.log("deleted with all his evolution");
    }
  );
};
function Update(id, param) {
  Pokemon.update({ param }, function(pokemon) {
    console.log("updated");
  });
}
// // CREER UN DOCUMENT

// // SAVE
// const c = new Client({ nom: "Pierre", prenom: "Ronaldo", age: 41 });
// c.address = "Paris";
// c.save();

// // CREATE
// Client.create({ nom: "Pierre", prenom: "Ronaldo", age: 41 }, (err, doc) => {
//   if (err) console.log(err);
//   console.log("client créer", doc);
// });

// // LISTER DES DOCUMENTS
// CLient.find((err, clients) => {
//   if (err) console.log(err);
//   console.log(clients);
// });

// //  CREER un sous documents
// const addressSchema = mongoose.Schema({
//   label: String,
//   rue: String,
//   ville: String,
//   cp: Number
// });

// const clientSchema = mongoose.Schema({
//   nom: String,
//   prenom: String,
//   age: Number,
//   address: [addressSchema] // le shema doit se trouver dans un tableau sionon ca ne fonctionne pas
// });

// Client.create(
//   {
//     nom: "Pierre",
//     prenom: "Ronaldo",
//     age: 41,
//     address: [
//       { label: "Maison", rue: "21 rue de Clery", ville: "Paris ", cp: 75000 }
//     ]
//   },
//   (err, doc) => {
//     if (err) console.log(err);
//     console.log("client créer", doc);
//   }
// );

//  CREER un sous documents Object

// const clientSchema = mongoose.Schema({
//   nom: String,
//   prenom: String,
//   age: Number,
//   address: {
//     label: String,
//     rue: String,
//     ville: String,
//     cp: Number
//   }
// });

// Client.create(
//   {
//     nom: "Pierre",
//     prenom: "Ronaldo",
//     age: 41,
//     address: {
//       label: "Maison",
//       rue: "21 rue de Clery",
//       ville: "Paris ",
//       cp: 75000
//     }
//   },
//   (err, doc) => {
//     if (err) console.log(err);
//     console.log("client créer", doc);
//   }
// );

// // Rechercher des documents
// Client.find({ "address.ville": "Paris" }, (err, clients) => {
//   if (err) console.log(err);
//   console.log(clients);
// });

// // exist
// Client.find({ "address.ville": { $exists: true } }, (err, clients) => {
//   if (err) console.log(err);
//   console.log(clients);
// });

// //  condition
// Client.find(
//   { $or: [{ nom: "Pierre" }, { prenom: "Ronaldo" }] },
//   (err, clients) => {
//     if (err) console.log(err);
//     console.log(clients);
//   }
// );

// $in => dans
// $gt  => plus grand que

// // Query
// Client.find().exec((err, clients) => console.log(clients));

// Client.find()
//   .where("nom")
//   .gt("N")
//   .sort("nom")
//   .exec((err, clients) => console.log(client));

// Client.find() // TOUS LES Clients
//   .where("nom") // dont le nom
//   .gt("N") // est > "N"
//   .where("prenom")
//   .nin(["Barack", "Barack2"]) // ET dont le prenom n'est ni Barack ni Barack2
//   .sort("nom") // triés par noms croissants
//   .exec((err, clients) => console.log(client));

// UPDATE
// DELETE

// VALIDATION

// const clientSchema = mongoose.Schema({
//   nom: { type: String, required: "Le nom est obligatoire" },
//   prenom: String,
//   age: Number,
//   address: String
// });

// const Client = mongoose.model("Client", clientSchema);

// const c = new Client({ nom: "", prenom: "" });
// c.save(err => {
//   if (err) console.log(err);
//   Client.find((err, clients) => console.log({ clients }));
// });

// Validation Custom
// const clientSchema = mongoose.Schema({
//   nom: { type: String, required: "Le nom est obligatoire" },
//   prenom: String,
//   age: {
//     type: Number,
//     required: true,
//     validate: value => {
//       if (value > 7 || value < 77) return false;
//       return true;
//     }
//   },
//   address: String
// });

// Refacto

// const clientSchema = mongoose.Schema({
//   nom: { type: String, required: "Le nom est obligatoire" },
//   prenom: String,
//   age: {
//     type: Number,
//     required: true,
//     validate: [
//       {
//         validator: value => value > 7,
//         msg: "L'age doit etre superieur à 7 ans"
//       },
//       {
//         validator: value => value < 77,
//         msg: "L'age doit etre inferieur à 77 ans"
//       }
//     ]
//   },
//   address: String
// });

// Validation asynchrones
// Interdire 2 fois le meme client
// const clientSchema = mongoose.Schema({
//   nom: {
//     type: String,
//     validate: (value, respond) => {
//       Client.findOne({ nom: this.nom, prenom: this.prenom }, (err, client) => {
//         if (client) respond(false);
//         else respond(true);
//       });
//     }
//   },
//   prenom: String
// });

// POPULATE
// const clientSchema = mongoose.Schema({
//   nom: String,
//   prenom: String,
//   age: Number,
//   commandes: [{ type: mangoose.Schema.Types.ObjectId, ref: "Commande" }]
// });

// const commmandeSchema = mongoose.Schema({
//   date: Date,
//   effectuePar: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }
// });

// Ajout
// const Client = mongoose.mondel("Client", clientSchema);
// const Commande = mongoose.mondel("Commande", commmandeSchema);

// const client = new Client({ nom: "Obama", prenom: "Barack" });
// client.save(() => {
//   const cde = new Commande({ date: new Date(), effectuePar: client._id });
//   cde.save(() => {
//     client.commandes.push(cde);
//     client.save();
//     console.log(client + " sauvegardé");
//     console.log(cde, " sauvegardée");
//   });
// });

// find with populate
// Client.find()
//   .populate("commandes")
//   .exec((err, clients) => console.log({ clients }));

// Commande.find()
//   .populate("effectuePar")
//   .exec((err, commandes) => console.log({ commandes }));

// Middlewares

// PRE
// clientSchema.pre("validate", next => {
//   console.log("Avant la validation du document");
//   next();
// });

// clientSchema.pre("save", next => {
//   console.log("Avant la sauvegarde du document");
//   next();
// });

// clientSchema.pre("remove", next => {
//   console.log("Avant la suppression du document");
//   next();
// });

// //POST
// clientSchema.post("validate", next => {
//   console.log("Apres la validation du document");
//   next();
// });

// clientSchema.post("save", next => {
//   console.log("Apres la sauvegarde du document");
//   next();
// });

// clientSchema.post("remove", next => {
//   console.log("Apres la suppression du document");
//   next();
// });
