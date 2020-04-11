const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
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

app.get("/", (req, res) => {
  res.send("<h3>Full Stack open Part 3</h3>");
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return res.status(404).json({
      error: "resource not found",
    });
  }
  res.json(person);
});

app.post("/api/persons", (req, res) => {
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

  const existing = persons.find((person) => person.name === body.name);

  if (existing) {
    return res.status(409).json({
      error: `name '${body.name}' already exists`,
    });
  }

  body.id = parseInt(Math.random() * 100000);
  persons = persons.concat(body);

  res.status(201).json(body);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  //Filtering first to avoid having two loops
  const others = persons.filter((person) => person.id !== id);

  if (others.length === persons.length) {
    return res.status(404).json({
      error: "resource not found",
    });
  }

  persons = others;
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
