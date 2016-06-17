'use strict'

const Hapi = require('hapi')
const Joi = require('joi')
const Relish = require('../')({
  messages: {
    'timestamp': 'This request requires a timestamp',
    'email': 'Generic email message',
    'data': 'You must include a data object in your payload',
    'data.name': 'Please give us your name',
    'data.phone': 'Please give us your name'
  }
})

const server = new Hapi.Server()
server.connection({
  port: 3000,
  routes: {
    validate: {
      // call the module's failAction
      failAction: Relish.failAction,
      options: {
        abortEarly: false
      }
    }
  }
})

server.route({
  method: 'POST',
  path: '/',
  config: {
    validate: {
      payload: {
        timestamp: Joi.date().required(),
        data: Joi.object({
          name: Joi.string().required().label('Full Name'),
          email: Joi.string().email().required(),
          phone: Joi.number().required(),
          dob: Joi.date().optional()
        }).required()
      }
    }
  },
  handler: (request, reply) => reply()
})

server.start(() => {
  console.log('Server running at:', server.info.uri)
})
