const people = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// Init mongodb connection
const url = `mongodb+srv://fullstack:${password}@cluster0-stlg8.mongodb.net/fullstack`
people.connect(url, { useNewUrlParser: true })

// Building person schema and model
const personSchema = new people.Schema({
  name: String,
  number: String,
})

const Person = people.model('Person', personSchema)

// List persons from db or add person to it
if (process.argv.length == 3) {
  console.log("puhelinluettelo:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    people.connection.close()
  })

} else if (process.argv.length == 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  console.log("lisätään", person.name, "numero", person.number, "puhelinluetteloon");

  person.save().then(response => {
    people.connection.close();
  })
}
