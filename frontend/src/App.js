import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
      rajaa näytettäviä
      <input onChange={props.handleChange} value={props.value} />
    </div>
  )
}

const Persons = (props) => {
  return (
    props.persons.map(p =>
      <div key={p.name}>
        {p.name} {p.number} <button onClick={()=>props.deletePerson(p.id)}>poista</button>
      </div>
    )
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        nimi: <input onChange={props.handleNameChange} value={props.newName} />
      </div>
      <div>
        numero: <input onChange={props.handleNumberChange} value={props.newNumber} />
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({
    message: null
  })

  useEffect(() => {
    personService.getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const notify = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null }), 10000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const ok = window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella`)

      if (ok) {
        personService
          .replace({
            ...existingPerson,
            number: newNumber
          })
          .then(replacedPerson => {
            setPersons(persons.map(p => p.name === newName ? replacedPerson : p))
            setNewName('')
            setNewNumber('')
            notify(`Henkilön ${newName} numero muutettu`)
          })
          /*
          .catch(() => {
            setPersons(persons.filter(p => p.name !== newName))
            notify(`Henkilön ${newName} oli jo poistettu`, 'error')
          })
          */
      }
      return
    }
    personService
      .create({
        name: newName,
        number: newNumber
      })
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        notify(`Lisättiin ${createdPerson.name}`)
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        notify(`${errorMessage}`, 'error')
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const ok = window.confirm(`Poistetaanko ${person.name}`)
    if (ok) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
      notify(`Poistettiin ${person.name}`)
    }
  }

  const personsToShow = filter.length === 0
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) )

  return (
    <div>
      <h2>Puhelinluettelo</h2>

      <Notification notification={notification} />

      <Filter handleChange={handleFilterChange} value={filter} />

      <h3>lisää uusi</h3>

      <PersonForm
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
      />

      <h3>Numerot</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )

}

export default App
