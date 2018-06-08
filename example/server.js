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

const server = Hapi.Server({
  host: '0.0.0.0',
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
  handler: (request, h) => h.response()
})

const init = async () => {
  await server.start()
  console.log(`Server is running at ${server.info.uri}`)
}

init()
