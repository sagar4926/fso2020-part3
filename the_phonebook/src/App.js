import React, { useState, useEffect } from "react";
import Filter from "./Filter";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import api__persons from "./apis/api__persons";
import Notification from "./components/notification/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState(undefined);

  useEffect(() => {
    api__persons.getAll().then((data) => setPersons(data));
  }, []);

  const filterChanged = (event) => {
    setFilter(event.target.value);
  };

  const _showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(undefined), 5000);
  };
  const showErrorNotification = (message) => {
    _showNotification(message, "error");
  };

  const showSuccessNotification = (message) => {
    _showNotification(message, "success");
  };

  const onPersonCreated = (created) => {
    const existing = persons.filter((person) => person.name === created.name);

    if (existing.length > 0) {
      const shouldUpdate = window.confirm(
        `${created.name} is already added to the phonebook. do you want to replace the phone number?`
      );
      if (shouldUpdate) {
        const payload = { ...existing[0], number: created.number };
        api__persons
          .update(payload)
          .then((data) => {
            setPersons(persons.map((p) => (p.id === payload.id ? payload : p)));
            showSuccessNotification(`${payload.name}'s phone number updated.`);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              showErrorNotification(
                `Looks like ${payload.name} was deleted elsewhere!`
              );
              removePersonFromState(payload);
            } else {
              showErrorNotification(
                `An error occured while updating ${payload.name}`
              );
            }
          });
      }
      return;
    }

    api__persons.create(created).then((data) => {
      setPersons(persons.concat(data));
      setNewPerson({ name: "", number: "" });
      showSuccessNotification(`${data.name} added.`);
    });
  };

  const removePersonFromState = (person) => {
    setPersons(persons.filter((p) => p.id !== person.id));
  };

  const onRemove = (person) => {
    const shouldDelete = window.confirm(`Should ${person.name} be deleted?`);
    if (shouldDelete) {
      api__persons
        .delete(person.id)
        .then((res) => {
          removePersonFromState(person);
          showSuccessNotification(`${person.name} deleted.`);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            showErrorNotification(
              `Looks like ${person.name} was deleted elsewhere!`
            );
            removePersonFromState(person);
          } else {
            showErrorNotification(
              `An error occured while deleting ${person.name}`
            );
          }
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={filterChanged}></Filter>
      <PersonForm
        person={newPerson}
        onPersonCreated={onPersonCreated}
      ></PersonForm>
      <Notification notification={notification}></Notification>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onRemove={onRemove}></Persons>
    </div>
  );
};

export default App;
