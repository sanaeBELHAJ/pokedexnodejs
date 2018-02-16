const crud = require("./crud.js");
const user = require("./user.js");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pokedex");

//SELECT ALL Pokemons by user
module.exports.findAllPokemon = async function(id) {
  try {
    User.find()
      .populate("pokemons")
      .exec((err, users) => console.log(users));
  } catch (err) {
    return err;
  }
};
//SELECT ONE POKEMON BY USER
module.exports.findOne = async function(id) {
  try {
    let user = await User.findOne({ _id: id }).then(user => {
      return user;
    });
    return user;
  } catch (err) {
    return err;
  }
  return user;
};
