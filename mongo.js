const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as the first argument");
  process.exit(1);
}

if (process.argv.length === 4) {
  console.log("If you enter name, enter number as the next argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fso2020:${password}@cluster0-q4mhw.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook: ");
    result.forEach((person) =>
      console.log(`${person.name} : ${person.number}`)
    );
    mongoose.connection.close();
  });
} else if (process.argv.length == 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((result) => {
    console.log(`Added ${result.name} : ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
