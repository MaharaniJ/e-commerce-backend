const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid email address");
      }
    },
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  carts: Array,
});

// password hasing
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// generting token
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, secretKey, {
      expiresIn: "1d",
    });
    console.log("geneate-Token",token)
    if (!token) {
      throw new Error("Token generation failed.");
    }

    this.tokens = this.tokens.concat({ token: token });
    await this.save();

    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw error; // Re-throw the error for higher-level handling if necessary.
  }
};


//addto cart data
userSchema.methods.addcartdata = async function (cart) {
  try {
    this.carts = this.carts.concat(cart);
    await this.save();
    return this.carts;
  } catch (error) {
    console.log(error + "");
  }
};

const USER = new mongoose.model("USER", userSchema);
module.exports = USER;
