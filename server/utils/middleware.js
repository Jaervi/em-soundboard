const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected key to be unique' })
  }
  
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")
  
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "")
  } else {
    request.token = null
  }
  next()
}

const userExtractor = (request, response, next) => {
  const token = request.token
  console.log(`Token is: ${token}`)
  if (token) {
    const decodedToken = jwt.verify(token, config.JWT_SECRET)
    console.log(decodedToken)

    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" })
    }
    User.findById(decodedToken.id).then((result) => {
      request.user = result
      next()
    })
  } else {
    request.user = null
    next()
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
  tokenExtractor
}