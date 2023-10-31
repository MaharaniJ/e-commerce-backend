const express = require("express");
const router = new express.Router();
const Products = require("../models/productSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
// const authenticate = require("../middleware/authenticate");
const authenticate1 = require("../middleware/authenticate");

router.get("/getproducts", async (req, res) => {
  try {
    const productsData = await Products.find();
    // console.log(productsData);
    res.status(200).json(productsData);
  } catch (error) {
    return res.status(400).json(error);
    // console.error("error" + error.message);
  }
});

router.get("/getproduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const individual = await Products.findOne({ id: id });
    // console.log(individual);

    res.status(201).json(individual);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/register", async (req, res) => {
  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
    return res
      .status(422)
      .json({ error: "Please fill in all the required fields." });
  }

  try {
    const preuser = await USER.findOne({ email: email });

    if (preuser) {
      return res.status(422).json({ error: "This email is already in use." });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords do not match." });
    } else {
      const finaluser = new USER({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });
      const storedata = await finaluser.save();
      // Hash the password here if needed

      res.status(201).json(storedata);
    }
  } catch (error) {
    // console.log("Error during registration: " + error.message);
    return res
      .status(422)
      .json({ error: "Registration failed. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "required fields are empty" });
  }
  try {
    const loginuser = await USER.findOne({ email: email });
    if (loginuser) {
      const isMatch = await bcrypt.compare(password, loginuser.password);
      // console.log(isMatch);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      } else {
        const token = await loginuser.generateAuthToken();
        req.headers.authorization = `Bearer ${token}`;

        res.status(200).json({ token: token });
        console.log(token);
      }
    }
  } catch (error) {
    res.status(400).json({ error: "invalid crediential pass" });
  }
});

router.post("/addtocart/:id", authenticate1, async (req, res) => {
  try {
    // console.log("perfect 6");
    const { id } = req.params;
    const cart = await Products.findOne({ id: id });
    console.log(cart + "cart value");

    const Usercontact = await USER.findOne({ _id: req.userID });
    console.log(Usercontact);

    if (Usercontact) {
      const cartData = await Usercontact.addcartdata(cart);

      await Usercontact.save();
      console.log(cartData);
      // console.log(Usercontact + "user save");
      return res.status(201).json(Usercontact);
    } else {
      res.status(401).json({ error: "Invalid user" });
    }
  } catch (error) {
    // console.log(error);
    res.status(401).json({ error: "Invalid user context" });
  }
});

router.get("/cartdetails", authenticate1, async (req, res) => {
  try {
    const buyuser = await USER.findOne({ _id: req.userID });
    console.log(buyuser);
    res.status(201).json(buyuser);
  } catch (error) {
    res.status(401).json({ error: "Error occured in buynow" });
  }
});

router.get("/validuser", authenticate1, async (req, res) => {
  try {
    const validateuser = await USER.find({ _id: req.userID });
    res.status(200).json(validateuser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/remove/:id", authenticate1, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter((item) => {
      return item.id != id;
    });
    req.rootUser.save();
    res.status(200).json(req.rootUser);
    console.log("items removed successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json(req.rootUser);
  }
});

router.get("/logout", authenticate1, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((item) => {
      return item.token !== req.token;
    });
    res.status(200).json(req.rootUser.tokens);
    // req.token = "";
    // console.log(req.token);
    // req.rootUser.generateAuthToken = null;
    // console.log(req.rootUser.generateAuthToken);
    await req.rootUser.save();

    // Send a success response to the client

    // return res.status(200).send({ message: "You have been successfully logged out."});
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
