import { useState, useEffect } from 'react';
import noteService from './services/persons';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [addMessage, setAddmessage] = useState('');

  useEffect(() => {
    noteService.getAll()
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch persons:', error);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const person = { name: newName, number: newNumber };

    const nameExists = persons.some(p => p.name === newName);
    if (nameExists) {
      setAddmessage(newName + ' is already added');
    } else {
      noteService.create(person)
        .then(response => {
          setPersons([...persons, response.data]);
          setNewName('');
          setNewNumber('');
          setAddmessage(newName + ' is added');
        })
        .catch(error => {
          setAddmessage(newName + ' cannot be added');
          console.error('Failed to add person:', error);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Do you really want to delete this person?')) {
      noteService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error('Failed to delete person:', error);
        });
    }
  };

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div className='message'><h2>{addMessage}</h2></div>
      <Filter value={searchTerm} onChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <PersonList persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const PersonList = ({ persons, handleDelete }) => {
  return (
    <ul>
      {persons.map(person => (
        <div key={person.id}>
          <li>{person.name} {person.number}</li>
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </ul>
  );
};

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  );
};

export default App;
