const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pokedex");

const pokemonSchema = mongoose.Schema({
  id: Number,
  idnational: Number,
  name: String,
  type: String,
  type2: String,
  niveau: Number,
  img: String,
  evolutions: mongoose.Schema.Types.Mixed
});

/* MODELES */
const Pokemon = mongoose.model("Pokemon", pokemonSchema);

/* REQUETES : */

//INSERT ALL POKEMON
module.exports.insertAll = function(Pokemons) {
  Pokemons.forEach(function(pokemon) {
    const p = new Pokemon({
      idnational: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      type2: pokemon.type2,
      niveau: pokemon.niveau,
      img: pokemon.img,
      evolution: pokemon.evolutions
    });

    p.save();
  });
};

//INSERT ONE POKEMON
module.exports.insertOne = function(pokemon) {
  const p = new Pokemon({
    idnational: pokemon.id,
    name: pokemon.name,
    type: pokemon.type,
    type2: pokemon.type2,
    niveau: pokemon.niveau,
    img: pokemon.img
  });
  //TODO : mauvais message de retour lors d'une bonne insertion
  return p.save((err, p) => {
    if (err) return null;
    return p;
  });
};

//SELECT ALL POKEMON
module.exports.findAll = async function() {
  //Liste des pokemons
  let pokemons = await Pokemon.find((err, pokemons) => {
    if (err) console.log(err);
  });
  const liste = [];

  //Liste des evolutions des pokemons
  /*const pkm = pokemons.map(async function(pokemon) {
    var listEvol = [];
    if(pokemon && pokemon._id){
      listEvol = await Pokemonevolution.find({ id_pokemon: pokemon._id }, function(err, result){
                  return result;
                })
                .then(async pokevolutions => {
                  const evolutions = pokevolutions.map(async function(pokeevol){
                    var info = await Evolution.findOne({ _id: pokeevol.id_evolution }, function(err, doc) {
                                  return doc;
                                })
                                .then(doc => {
                                  const evolution = {
                                    niveauEvolution: doc.niveauEvolution,
                                    evolutionName: doc.evolutionName
                                  };
                                  return evolution;
                                });
                    return info;
                  });
                  return Promise.all(evolutions)
                })
                .then(detailsEvol => {
                  return detailsEvol;
                });
    }
    return {
      pokemon: pokemon,
      listEvol : listEvol
    }
  });
  return Promise.all(pkm);*/
};

//SELECT ONE POKEMON BY NATIONAL-ID
module.exports.findOne = async function(id) {
  let pokemon = await Pokemon.findOne({ idnational: id }).then(pokemon => {
    return pokemon;
  });

  return {
    pokemon: pokemon,
    listEvol: listEvol
  };
};
//SELECT ONE POKEMON BY ID MONGOOSE
module.exports.findOne = async function(id) {
  let pokemon = await Pokemon.findOne({ _id: id }).then(pokemon => {
    return pokemon;
  });

  return {
    pokemon: pokemon,
    listEvol: listEvol
  };
};
//SELECT ONE POKEMON BY NAME
module.exports.searchPoke = async function(name) {
  return await Pokemon.findOne({ name: name }, function(err, doc) {
    return doc;
  });
};

//UPDATE
module.exports.update = async function(pokemon, param) {
  await Pokemon.findOneAndUpdate(
    { _id: pokemon._id },
    { $set: param },
    function(err, doc) {
      if (err) {
        console.log("Something wrong when updating data!");
      }
    }
  );
};

//DELETE POKEMON + EVOLS
module.exports.remove = async function(id) {
  console.log(id);

  Pokemon.remove({ _id: id }, function(err) {});
};

// const clientSchema = mongoose.Schema({
//   nom: String,
//   prenom: String,
//   age: Number,
//   address: String
// });

// const Client = mongoose.model("Client", clientSchema);

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
// Client.find((err, clients) => {
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
//   address: [addressSchema] // le shema doit se trouver dans un tableau sinon ca ne fonctionne pas
// });

// const Client = mongoose.model("Client", clientSchema);

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
// const Client = mongoose.model("Client", clientSchema);

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
// Client.find({ "address.ville": "Paris " }, (err, clients) => {
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
//   .exec((err, clients) => console.log(clients));

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
//   // Client.find((err, clients) => console.log({ clients }));
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
//    prenom: String,
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
//   commandes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Commande" }]
// });

// const commmandeSchema = mongoose.Schema({
//   date: Date,
//   effectuePar: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }
// });

// Ajout
// const Client = mongoose.model("Client", clientSchema);
// const Commande = mongoose.model("Commande", commmandeSchema);

// const client = new Client({ nom: "Obama", prenom: "Barack" });
// client.save(() => {
//   const cde = new Commande({ date: new Date(), effectuePar: client._id });
//   cde.save((err, doc) => {
//     client.commandes.push(cde);
//     client.save();
//     console.log(client + " sauvegardé");
//     console.log(cde, " sauvegardée");
//   });
// });

// find with populate
// Client.find()
//   .populate("commandes")
//   .exec((err, clients) => console.log(clients));

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
