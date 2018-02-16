const mongoose = require("mongoose");
const integerValidator = require('mongoose-integer');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.connect("mongodb://localhost/pokedex");

//CREER un sous document
const evolutionsSchema = mongoose.Schema({
  niveauEvolution: String,
  evolutionName: String
});

const pokemonSchema = mongoose.Schema({
  id: Number,
  idnational: {
    type: Number, 
    unique: true,
    required: "Un ID National est obligatoire",
    validate: [
      {
        validator: value=> value > 0,
        msg: "L'ID National doit être strictement positif"
      }
    ]
  },
  name: {
    type: String, 
    unique: true,
    required: "Un nom est obligatoire" 
  },
  type: String,
  type2: String,
  niveau: {
    type: Number,
    validate: [
      {
        validator: value=> value > 0,
        msg: "Le niveau doit être strictement positif"
      },
      {
        validator: value=> value < 100,
        msg: "Le niveau ne peut excéder 100"
      }
    ]
  },
  img: String,
  evolutions: [evolutionsSchema]
});

pokemonSchema.plugin(integerValidator, { message: '{PATH} doit être une valeur numérique.' });
pokemonSchema.plugin(uniqueValidator, { message: 'La valeur de {PATH} est déjà utilisée.' });

/* MODELES */
const Pokemon = mongoose.model("Pokemon", pokemonSchema);

/* REQUETES : */

//INSERT ALL POKEMON
module.exports.insertAll = function(Pokemons) {
  Pokemons.forEach(function(pokemon) {

    Pokemon.create(
        {
          idnational: pokemon.id,
          name: pokemon.name,
          type: pokemon.type,
          type2: pokemon.type2,
          niveau: pokemon.niveau,
          img: pokemon.img,
          evolutions: pokemon.evolutions
        },
        (err, doc) => {
          if (err) 
            console.log(err);
        }
      );
  });
};

//INSERT ONE POKEMON
module.exports.insertOne = async function(pokemon,res) {
  if(pokemon.idnational && isNaN(parseInt(pokemon.idnational,10)))
    res.send({
      message: "L'ID National doit être une valeur numérique"
    });
  return await Pokemon.create(
    {
      idnational: pokemon.idnational,
      name: pokemon.name,
      type: pokemon.type,
      type2: pokemon.type2,
      niveau: pokemon.niveau,
      img: pokemon.img
    },
    (err, doc) => {
      if (err){
        res.send({
          message: err.message
        });
      }
      else
        res.send({
          message: "CREATION EFFECTUEE"
        });
    }
  );
};

//SELECT ALL POKEMON
module.exports.findAll = async function() {
  return await Pokemon.find().sort("idnational");
};

//SELECT ONE POKEMON BY NATIONAL-ID OU NAME
module.exports.findOne = async function(search) {
  // Rechercher des documents
  if(!search)
    console.log("ERREUR");
  let findId = (isNaN(parseInt(search,10))) ? -1 : parseInt(search,10);

  return await Pokemon.findOne(
    { $or: [{ name: search }, { idnational: findId }] },
    (err, pokemon) => {
      if (err) console.log(err);
      console.log("Resultat du find : ");
      console.log(pokemon);
    }
  );
};

//SELECT ONE POKEMON BY ID MONGOOSE
module.exports.findOneById = async function(id) {
  let pokemon = await Pokemon.findOne({ _id: id }).then(pokemon => {
    return pokemon;
  });
  return pokemon;
};

//UPDATE
module.exports.update = async function(pokemon, param) {
  await Pokemon.findOneAndUpdate(
    { _id: pokemon._id },
    { $set: param },
    {
      upsert: true,     
      'new': true,   
      runValidators: true,     
      setDefaultsOnInsert: true
    },
    function(err, doc) {
      if (err) {
        console.log(err);
      }
    }
  );
};

//DELETE POKEMON
module.exports.remove = async function(id) {
  await Pokemon.remove().where({ _id: id });
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

//  CREER un sous documents
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