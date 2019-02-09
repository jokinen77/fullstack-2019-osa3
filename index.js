const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('post-data', function (req, res) { return req.method === "POST" ? JSON.stringify(req.body) : " " })

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(cors())

persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const content = req.body
  console.log('content name', content.name);
  if (content.name === undefined || !content.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (content.number === undefined || !content.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.map(p => p.name).includes(content.name)) {
    return res.status(400).json({
      error: 'person is already in database'
    })
  }

  person = {
    "name": content.name || "No name",
    "number": content.number || "No number",
    "id": generateId()
  }
  persons = persons.concat(person)
  res.json(person)
})

app.get('/info', (req, res) => {
  const count = persons.length
  const date = new Date()
  res.send(`Puhelinluettelossa on ${count} henkilön tiedot<br>${date}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 1000000000)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
