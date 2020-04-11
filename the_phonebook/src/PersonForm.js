import React, { useState, useEffect } from "react";

const PersonForm = ({ onPersonCreated, person }) => {
  const [newName, setNewName] = useState(person.name);
  const [newNumber, setNewNumber] = useState(person.number);

  useEffect(() => {
    setNewName(person.name);
    setNewNumber(person.number);
  }, [person]);

  const addNewPerson = (event) => {
    event.preventDefault();
    onPersonCreated({ name: newName, number: newNumber });
  };

  const nameChanged = (event) => {
    setNewName(event.target.value);
  };

  const numberChanged = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addNewPerson}>
      <div>
        name: <input value={newName} onChange={nameChanged} />
      </div>
      <div>
        number: <input value={newNumber} onChange={numberChanged} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
