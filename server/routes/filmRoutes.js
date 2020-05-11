const express = require("express");
const filmRouter = express.Router();

const verifyToken = require("../middleware/verifyToken");
const Films = require("../models/filmModel");
const baseUrl = require("../baseUrl");

// Search
const searchQuery = (req, res, next) => {
  if (!req.query.search) {
    next();
  } else {
    Films.find(
      {
        "properties.title": { $regex: `${req.query.search}`, $options: "i" },
      },
      (err, results) => {
        if (err) {
          res
            .status(400)
            .json({ errors: `${err}`, message: "Could not find film" });
        } else if (results) {
          res.status(200).json({ message: "ok", results });
        } else {
          res.status(404).json({ message: "No results, refine your query" });
        }
      }
    );
  }
};

// GET all
filmRouter.get("/films", searchQuery, (req, res) => {
  Films.find((err, films) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not GET Films", errors: `${err}` });
    } else if (films) {
      res.status(200).json({ message: "ok", results: films });
    } else {
      res.status(404).end();
    }
  });
});

// GET one
filmRouter.get("/films/:id", (req, res) => {
  Films.findOne({ uid: req.params.id }, (err, film) => {
    if (err) {
      res.status(400).json({ message: "Could not GET film", errors: `${err}` });
    } else if (film) {
      res.status(200).json({ message: "ok", result: film });
    } else {
      res.status(404).end();
    }
  });
});

// POST
filmRouter.post("/films", verifyToken, (req, res) => {
  req.body.properties.url = `${baseUrl}/${req.route.path}/${req.body.uid}`;
  const newFilm = new Films(req.body);

  newFilm
    .save()
    .then((film) => {
      res.status(200).json({ message: "Film Added", result: film });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Could not POST film", errors: `${err}` });
    });
});

// PUT
filmRouter.put("/films/update/:id", verifyToken, (req, res) => {
  Films.findOne({ uid: req.params.id }, (err, film) => {
    if (err) {
      res.status(400).json({ message: "Could not PUT film", errors: `${err}` });
    } else if (film) {
      if (typeof req.body.properties === "undefined") {
        try {
          Object.keys(film.toObject()).forEach((attribute) => {
            film[attribute] = req.body[attribute] || film[attribute];
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          Object.keys(film.toObject()).forEach((attribute) => {
            if (attribute === "properties") {
              Object.keys(film.properties.toObject()).forEach((property) => {
                film.properties[property] =
                  req.body.properties[property] || film.properties[property];
              });
            } else {
              film[attribute] = req.body[attribute] || film[attribute];
            }
          });
        } catch (err) {
          console.log(err);
        }
      }

      film.properties.edited = Date.now();

      film.save().then((film) => {
        res.status(200).json({ message: "film updatad", result: film });
      });
    } else {
      res.status(404).end();
    }
  });
});

// DELETE
filmRouter.delete("/films/delete/:id", verifyToken, (req, res) => {
  Films.findOneAndDelete({ uid: req.params.id }, (err, result) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Could not DELETE film", errors: `${err}` });
    } else if (result) {
      res.status(200).json({ message: "Deleted" });
    } else {
      res.status(404).end();
    }
  });
});

module.exports = filmRouter;
