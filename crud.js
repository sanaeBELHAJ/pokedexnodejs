const mongoose = require("mongoose");
const integerValidator = require('mongoose-integer');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.connect("mongodb://localhost/pokedex");

//CREER un sous document
const evolutionsSchema = mongoose.Schema({
  niveauEvolution: String,
  evolutionName: String,
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
  return await Pokemon.find();
};

//SELECT ONE POKEMON BY NATIONAL-ID OU NAME
module.exports.findOne = async function(search) {
  // Rechercher des documents
  if(!search)
    console.log("ERREUR");
  let findId = (isNaN(parseInt(search,10))) ? -1 : parseInt(search,10);
  return await Pokemon.findOne(
    { $or: [{ name: search}, {idnational: findId }] },
    (err, clients) => {
      if (err) console.log(err);
    });
};

//UPDATE
module.exports.update = async function(pokemon, param) {
  await Pokemon.findOneAndUpdate(
    { _id: pokemon._id },
    { $set: param },
    function(err, doc) {
      if (err) {
        console.log(err);
      }
    }
  );
};

//DELETE POKEMON
module.exports.remove = async function(id) {
  await Pokemon.remove().where({_id: id});
};