//Declare required things
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

let fs = require("fs");

require("dotenv").config();

//create Express server
const app = express();
const port = process.env.PORT || 5005;

//Middleware as cors and express
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

//Adding mongodb URI
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.on("Error", console.error.bind(console, "connection error:"));
connection.once("open", () => {
  console.log("MongoDB connection status: Success");
});

// Routing
app.use("/Uploads", express.static("Uploads"));
const PhotosRouter = require("./PhotosRouter");
app.use("/Photos", PhotosRouter);

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
