'use strict'

const Hapi = require('hapi')
const Joi = require('joi')
const Relish = require('../')

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const {
  after,
  before,
  describe,
  it
} = lab
const { expect } = Code

const path = '/test'
const payload = {
  timestamp: Joi.date().required(),
  data: Joi.object({
    name: Joi.string().required().label('Full Name'),
    email: Joi.string().email().required(),
    phone: Joi.number().required(),
    dob: Joi.date().optional()
  }).required()
}
const customMessages = {
  'timestamp': 'This request requires a timestamp',
  'email': 'Generic email message',
  'data': 'You must include a data object in your payload',
  'data.name': 'Please give us your name',
  'data.phone': 'Please give us your name'
}

// set up server and test routes
let server

before(async () => {
  server = new Hapi.Server().connection({
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  server.route([{
    method: 'POST',
    path: path + '/no-options',
    config: {
      validate: {
        payload: payload,
        failAction: Relish().failAction
      }
    },
    handler: (request, reply) => reply()
  }, {
    method: 'POST',
    path: path + '/no-quotes',
    config: {
      validate: {
        payload: payload,
        failAction: Relish().options({ stripQuotes: true }).failAction
      }
    },
    handler: (request, reply) => reply()
  }, {
    method: 'POST',
    path: path + '/messages',
    config: {
      validate: {
        payload: payload,
        failAction: Relish().options({ messages: customMessages }).failAction
      }
    },
    handler: (request, reply) => reply()
  }])
})

after(() => {
  if (typeof server.stop === 'function') server.stop()
})

describe('Relish', () => {
  describe('Module API', () => {
    it('should expose public functions', () => {
      const test = Relish()
      expect(test).to.be.an.object().and.to.contain(['failAction', 'options'])
      expect(test.failAction).to.be.a.function()
      expect(test.options).to.be.a.function()
    })

    it('should not require options', () => {
      const test = Relish()
      expect(test).to.be.an.object().and.to.contain(['failAction'])
    })

    it('should accept options in the constructor', () => {
      const test = Relish({ stripQuotes: true, messages: customMessages })
      expect(test).to.be.an.object().and.to.contain(['failAction'])
    })

    it('should allow options to be chainable', () => {
      const test = Relish().options({ stripQuotes: true })
      expect(test).to.be.an.object().and.to.contain(['failAction'])
    })
  })

  describe('Hapi Route', () => {
    describe('Options', () => {
      it('should not strip quotes by default', async () => {
        const res = await server.inject({
          method: 'POST',
          url: path + '/no-options',
          payload: {}
        })

        res.result.validation.errors.map((error) => {
          expect(error.message).to.contain(['"'])
        })
      })

      it('should strip quotes when stripQuotes option is true', async () => {
        const res = await server.inject({
          method: 'POST',
          url: path + '/no-quotes',
          payload: {}
        })

        res.result.validation.errors.map((error) => {
          expect(error.message).to.not.contain(['"'])
        })
      })
    })

    describe('Response', () => {
      it('should return a proper error response object when no options are passed', async () => {
        const res = await server.inject({
          method: 'POST',
          url: path + '/no-options',
          payload: {}
        })

        expect(res.result).to.be.an.object()
        expect(res.result.validation).to.exist().and.to.be.an.object()
        expect(res.result.validation.errors).to.exist().and.to.be.an.array().and.to.not.be.empty()

        res.result.validation.errors.map((error) => {
          expect(error).to.be.an.object()
          expect(Object.keys(error)).to.contain(['message', 'key', 'path', 'type', 'constraint'])
        })
      })

      it('should return prettier Joi messages when no custom messages are passed', async () => {
        const res = await server.inject({
          method: 'POST',
          url: path + '/no-options',
          payload: {}
        })

        res.result.validation.errors.map((error) => {
          expect(error.message).to.not.contain(['child', 'because of'])
        })
      })

      it('should return custom error message for a generic key match', async () => {
        const res = await server.inject({
          method: 'POST',
          url: path + '/messages',
          payload: {
            data: { email: 'some bad email' }
          }
        })

        let passed = false

        res.result.validation.errors.map((error) => {
          if (error.key === 'email') {
            passed = true
            expect(error.message).to.equal(customMessages.email)
          }
        })

        expect(passed).to.be.true()
      })

      it('should return custom error message for a exact path match', async () => {
        const res = await server.inject({
          method: 'POST',
          url: path + '/messages',
          payload: {
            data: { phone: 'this is not a phone number' }
          }
        })

        let passed = false

        res.result.validation.errors.map((error) => {
          if (error.path === 'data.phone') {
            passed = true
            expect(error.message).to.equal(customMessages[error.path])
          }
        })

        expect(passed).to.be.true()
      })

      it('should include `label` when setting custom Joi label', async () => {
        const res = await server.inject({
          method: 'POST',
          url: path + '/messages',
          payload: {
            data: { name: '' }
          }
        })

        let passed = false

        res.result.validation.errors.map((error) => {
          if (error.path === 'data.name') {
            passed = true
            expect(error.hasOwnProperty('label')).to.be.true()
            expect(error.label).to.equal('Full Name')
          }
        })

        expect(passed).to.be.true()
      })
    })
  })
})
