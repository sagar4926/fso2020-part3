const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3030;
const Person = require("./models/person");

app.use(cors());
app.use(express.static("the_phonebook/build"));
app.use(express.json());

morgan.token("body", (req, res) => (req.body ? JSON.stringify(req.body) : ""));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(
        `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
      );
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result.map((item) => item.toJSON()));
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return next(new Error("Not Found"));
      }
      return res.json(result);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "missing required field `name`",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "missing required field `number`",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((result) => {
      res.status(201).json(result.toJSON());
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    number: body.number,
  };
  return Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((result) => {
      return res.json(result.toJSON());
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  return Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log("Deleted successfully : ", result);
      return res.status(204).end();
    })
    .catch((error) => next(error));
});

const catchAllEndpoints = (request, response) => {
  response.status(404).json({ error: "url not found" });
};
//Catch all undefined urls and raise 404
app.use(catchAllEndpoints);

const errorHandler = (error, request, response, next) => {
  console.log("Error: ", error);
  if (error.message === "Not Found") {
    return response.status(404).json({ error: "resource not found" });
  }
  if (error.name === "CastError") {
    return response
      .status(400)
      .json({ error: "Bad Request, the ID is malformatted" });
  }

  next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
