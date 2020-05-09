// TODO:
// Rate Limiting, max 10,000 requests per day
// Transport, Vehicle, Starship model refactor
// Finish routes for vehicles and starships or just transports
// Search queries
// Authorization and authentication
// Documentation
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const baseUrl = require("./baseUrl");

const app = express();
const port = process.env.PORT || 8080;

// Routes
const filmRoutes = require("./routes/filmRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const planetRoutes = require("./routes/planetRoutes");
const speciesRoutes = require("./routes/speciesRoutes");
const transportRoutes = require("./routes/transportRoutes");
const rootRoutes = require("./routes/rootRoutes");

const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : "mongodb://localhost:27017/swapi";

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (!err) {
      console.log("Connected to SWAPI DB");
    } else {
      console.log("Error connecting: ", err);
    }
  }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "..", "build")));

// Use Routes
app.use("/api", rootRoutes);
app.use("/api", filmRoutes);
app.use("/api", peopleRoutes);
app.use("/api", planetRoutes);
app.use("/api", speciesRoutes);
app.use("/api", transportRoutes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "/", "../build/index.html"));
});

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});

// /api/species/?search=
