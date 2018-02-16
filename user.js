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
//console.log(User);

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.has_password);
};

//Methodes
user = {
  fullName: "sanae belhaj",
  email: "test@test.com",
  password: "sanae"
};
module.exports.register = function(req) {
  //newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  var newUser = new User({
    fullName: req.fullName,
    email: req.email,
    hash_password: bcrypt.hashSync(req.password, 10)
  });
  console.log(newUser);
  newUser.save(function(err, user) {
    if (err) {
      console.log("erreur");
      return err;
    } else {
      //user.hash_password = undefined;
      // console.log(user);
      return user;
    }
  });
  return user;
};

module.exports.addpokemon = async function(id, param) {
  //newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  let user = await User.findOne({ _id: id }).then(user => {
    return user;
  });
  //console.log(user);
  await User.findOneAndUpdate({ _id: id }, { $set: param }, function(err, doc) {
    if (err) {
      console.log("Something wrong when adding pokemon!");
    }
  });
  return user;
};

//adpokemon(12, []);
//register(user);
exports.sign_in = function(req, res) {
  User.findOne(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) throw err;
      if (!user)
        res.status(401).json({
          message: "Authentication failed. User not found."
        });
      else if (user) {
        if (!user.comparePassword(req.body.password))
          res.status(401).json({
            message: "Authentication failed. Wrong password."
          });
        else
          return res.json({
            token: jwt.sign(
              {
                email: user.email,
                fullName: user.fullName,
                _id: user._id
              },
              "RESTFULAPIs"
            )
          });
      }
    }
  );
};

exports.loginRequired = function(req, res) {
  if (req.user) next();
  else
    return res.status(401).json({
      message: "Unauthorized user!"
    });
};
//SELECT ALL USERS
module.exports.findAll = async function() {
  try {
    return await User.find({});
  } catch (err) {
    return err;
  }
};
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

module.exports.findAllPokemon = async function(id) {
  let user = await User.findOne({ _id: id })
    .populate("pokemons.id")
    .exec();
  console.log(user);
};
//findAll();
