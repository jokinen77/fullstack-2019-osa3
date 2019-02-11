const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Person = require('./models/person')
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :post-data')

const app = express()

morgan.token('post-data', function (req, res) { return req.method === "POST" ? JSON.stringify(req.body) : " " })

app.use(express.static('frontend/build'))
app.use(bodyParser.json())
app.use(logger)
app.use(cors())

persons = []

app.get('/test', (req, res, next) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
  .then(result => {
    persons = result
    res.json(persons)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const content = req.body

  person = new Person({
    "name": content.name,
    "number": content.number,
    "id": generateId()
  })
  person.save()
  .then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  const count = persons.length
  const date = new Date()
  res.send(`Puhelinluettelossa on ${count} henkilön tiedot<br>${date}`)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = new Person({
    "name": body.name,
    "number": body.number,
    "id": req.params.id
  })

  Person.findByIdAndUpdate(person.id, person)
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const generateId = () => Math.floor(Math.random() * 1000000000)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
