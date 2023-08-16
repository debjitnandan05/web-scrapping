const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Get-User-Details
const getUserDetails = async (req, res) => {
  if (!req.user._id) {
    return res.status(400).send("unAuthorized");
  }
  let user;
  try {
    user = await User.findById(req.user._id);
    if (!user) {
      return res.status(500).json({
        message: "User not found!",
      });
    }
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({
    userDetails: {
      user,
    },
  });
};

//Signup-user
const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({
      message: "Please provide name",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Please provide password",
    });
  }
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists!",
    });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
   
  });
  try {
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return res.status(200).json({
    userDetails: {
      user,
    },
  });
};

//Signin-User
const signIn = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Please provide password",
    });
  }
  let user;
  try {
    user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "user not found, Please signup before proceeding.",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
      } else {
        const payload = { email : email };

        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: 31556926, 
          },
          (err, token) => {
            if (err) {
              return res.status(500).send(err);
            }
          else {
            return res.status(200).json({
              message: "User logged in",
              token: token,
              user: {
                user,
              },
              newLogin: user.email === "NA" ? true : false,
            });
        }
          }
        );
        user.isAccountVerified = true;
        user.email = email;
        await user.save();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { signUp, signIn, getUserDetails };