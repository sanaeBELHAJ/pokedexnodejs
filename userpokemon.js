const crud = require("./crud.js");
const user = require("./user.js");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pokedex");

//const userpokemon =

const userpokemonSchema = mongoose.Schema({
  id: Number,
  id_pokemon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pokemonSchema"
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema"
  }
});
const Userpokemon = mongoose.model("Userpokemon", userpokemonSchema);

function add(id_pokemon, id_user) {
  var pokemon = crud.findOne(parseInt(id_pokemon, 10));
  var u = await user.findOne(req.params.search);
  
  if (pokemon != null && u != null) {
    const up = new Userpokemon({
      id_pokemon: pokemon.id_pokemon,
      id_user: pokemon.id_user,
    });
    up.save().then(up => {
      return "pokemon added!";
    }
    );
  }
}
add("","5a8542c15f5f3b3b3c877d9b");




console.log(userpokemon);
