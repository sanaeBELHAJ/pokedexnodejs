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
  created: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model("User", userSchema);
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
      console.log(user);
      return user;
    }
  });
  return user;
};
//register(user);
exports.sign_in = function(req, res) {
  User.findOne(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) throw err;
      if (!user)
        res
          .status(401)
          .json({ message: "Authentication failed. User not found." });
      else if (user) {
        if (!user.comparePassword(req.body.password))
          res
            .status(401)
            .json({ message: "Authentication failed. Wrong password." });
        else
          return res.json({
            token: jwt.sign(
              { email: user.email, fullName: user.fullName, _id: user._id },
              "RESTFULAPIs"
            )
          });
      }
    }
  );
};

exports.loginRequired = function(req, res) {
  if (req.user) next();
  else return res.status(401).json({ message: "Unauthorized user!" });
};
//SELECT ALL USERS
module.exports.findAll = async function() {
  const liste = [];
  await User.find((err, users) => {
    if (err) console.log(err);
    users.forEach(function(user) {
      //console.log(user);
      liste.push(user);
    });
    //return liste;
  });
  console.log(liste);
  return liste;
};
//findAll();
