const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pokedex");

/* SCHEMAS */
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

/* MODELES */
const Pokemon = mongoose.model("Pokemon", pokemonSchema);
const Evolution = mongoose.model("Evolution", evolutionSchema);
const Pokemonevolution = mongoose.model(
  "Pokemonevolution",
  pokemonEvolutionSchema
);

Pokemonevolution.find((err, pokemonevolutions) => {
  if (err) console.log(err);
  //  console.log(pokemonevolutions);
});

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
      img: pokemon.img
    });

    p.save().then(p => {
      if (p && p._id) {
        if (pokemon.evolutions != null) {
          pokemon.evolutions.forEach(function(evolution) {
            const e = new Evolution({
              niveauEvolution: evolution.niveauEvolution,
              evolutionName: evolution.evolutionName
            });
            e.save().then(e => {
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
  const liste = [];
  //Liste des pokemons
  let pokemons = await Pokemon.find((err, pokemons) => {
    if (err) console.log(err);
  });

  //Liste des evolutions des pokemons
  pokemons.forEach(async function(pokemon) {
    // const listEvol = [];
    // Pokemonevolution.find({ id_pokemon: pokemon._id }, (err, evolutions) => {
    //   if (err) console.log(err);
    //   //Parcours de chaque évolution pour un pokemon
    //   evolutions.forEach(async function(pokeevol){
    //     console.log(listEvol);
    //     let doc = await Evolution.findOne({ _id: pokeevol.id_evolution }, function(err, doc) {
    //       //console.log(doc);
    //       //return doc;
    //     })
    //     .then(doc => {
    //       const evolution = {
    //         niveauEvolution: doc.niveauEvolution,
    //         evolutionName: doc.evolutionName
    //       };
    //       console.log(evolution);
    //       listEvol.push(evolution);
    //       return listEvol;
    //     });
    //     console.log(listEvol);
    //   });
    //   //console.log(listEvol);
    //   return listEvol;
    // });
    // const poke = {
    //   pokemon,
    //   listEvol
    // };
    // liste.push(poke);
  });

  return liste;
};

//SELECT ONE POKEMON BY NATIONAL-ID
module.exports.findOne = async function(id) {
  let pokemon = await Pokemon.findOne({ idnational: id }).then(pokemon => {
    return pokemon;
  });

  var listEvol = [];
  if (pokemon && pokemon._id) {
    listEvol = await Pokemonevolution.find(
      { id_pokemon: pokemon._id },
      function(err, result) {
        return result;
      }
    )
      .then(async pokevolutions => {
        const evolutions = pokevolutions.map(async function(pokeevol) {
          var info = await Evolution.findOne(
            { _id: pokeevol.id_evolution },
            function(err, doc) {
              return doc;
            }
          ).then(doc => {
            const evolution = {
              niveauEvolution: doc.niveauEvolution,
              evolutionName: doc.evolutionName
            };
            return evolution;
          });
          return info;
        });
        return Promise.all(evolutions);
      })
      .then(detailsEvol => {
        return detailsEvol;
      });
  }

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

//DELETE POKEMON + EVOLS
module.exports.remove = async function(id) {
  console.log(id);
  await Pokemonevolution.find({ id_pokemon: id }, (err, pokEvolutions) => {
    if (err) console.log(err);
    console.log(pokEvolutions);
    pokEvolutions.forEach(function(pokEvolution) {
      Evolution.remove({ _id: pokEvolution.id_evolution }, function(err) {
        if (err) console.log(err);
        console.log("deleted with all his evolution");
      });
    });
  });

  Pokemonevolution.remove({ id_pokemon: id }, function(err) {
    if (err) console.log(err);
    //console.log("deleted with all his evolution");
  });

  Pokemon.remove({ _id: id }, function(err) {
    //console.log('pokemon supprimé')
  });
};

//UPDATE
module.exports.update = function(id, param) {
  Pokemon.update({ param }, function(pokemon) {
    console.log("updated");
  });
};
