import React from "react";

const Person = ({ person, onRemove }) => {
  return (
    <li>
      {person.name} | {person.number}{" "}
      <button onClick={() => onRemove(person)}>Delete</button>
    </li>
  );
};

export default Person;
