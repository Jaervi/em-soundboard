const mongoose = require('mongoose')

const schema = mongoose.Schema({
  author: String,
  description: String,
  audio: String,
})


schema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', schema)