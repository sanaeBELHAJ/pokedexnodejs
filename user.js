const jwt = require("jsonwebtoken");

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

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.has_password);
};

mongoose.model("User", UserSchema);

//Methodes

exports.register = function(req, res) {
  var newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
};

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
