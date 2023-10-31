const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8000;

require("./config/db");
const Products = require("./models/productSchema");
const DefaultData = require("./defaultdata");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "*", //  origin of your client-side application
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow credentials (cookies) to be sent with the request
  })
);
app.use(express.json());
app.use(cookieParser(""));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*'); // Replace with your allowed origin(s)
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Adjust as needed
//   res.header('Access-Control-Allow-Credentials', 'true'); // Add this if your requests use credentials
//   next();
// });

app.use(router);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
DefaultData();
