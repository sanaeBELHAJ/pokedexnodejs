const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pokedex");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//Modeles
const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  },
  pokemons: Array,
  created: {
    type: Date,
    default: Date.now
  }
});
User = mongoose.model("User", userSchema);

//Methodes
module.exports.register = async function(req) {
  var newUser = new User({
    fullName: req.fullName,
    email: req.email,
    hash_password: bcrypt.hashSync(req.password, 10)
  });

  return await newUser.save(function(err, user) {
    if (err) {
      console.log("erreur");
      return err;
    }
    return user;
  });
};

module.exports.addpokemon = async function(id, param) {
  let user = await User.findOne({ _id: id }).then(user => {
    return user;
  });
  await User.findOneAndUpdate({ _id: id }, { $set: param }, function(err, doc) {
    if (err) {
      console.log("Something wrong when adding pokemon!");
    }
  });
  return user;
};

//LOGIN
exports.sign_in = function(params, res) {
  return User.findOne(
    {
      email: params.email
    },
    function(err, user) {
      if (err) 
        throw err;
  
      if (user) {
        let isOk = bcrypt.compareSync(""+params.password, user.hash_password);
        if (!isOk){
          return res.json({
            message: "Authentication failed. Wrong password."
          });
        }else{
          return res.json({
            token: jwt.sign(
              {
                email: user.email,
                fullName: user.fullName,
                _id: user._id,
                expiresInMinutes: 5 // expires in 5 min
              },
              "RESTFULAPIs"
            )
          });
        }
      }
    }
  );
};


//SELECT ALL USERS
module.exports.findAll = async function() {
  try {
    return await User.find({});
  } catch (err) {
    return err;
  }
};

//Find a User
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

//Find all the pokemon for a user
module.exports.findAllPokemon = async function(id) {
  let user = await User.findOne({ _id: id })
    .populate("pokemons.id")
    .exec();
  console.log(user);
};
