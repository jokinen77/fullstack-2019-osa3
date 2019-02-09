import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  const promise = axios.get(baseUrl)

  return promise.then(response => response.data)
}

const create = (person) => {
  const promise = axios.post(baseUrl, person)

  return promise.then(response => response.data)
}

const remove = (id) => {
  const promise = axios.delete(`${baseUrl}/${id}`)

  return promise.then(response => response.data)
}

const replace = (person) => {
  const promise = axios.put(`${baseUrl}/${person.id}`, person)

  return promise.then(response => response.data)
}

export default {
  getAll, create, remove, replace
}
