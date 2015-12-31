'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const ErrorMessages = require('../lib')

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const beforeEach = lab.beforeEach;
const after = lab.after;
const expect = Code.expect;

const path = '/test';
const payload = {
  timestamp: Joi.date().required(),
  data: Joi.object({
    name: Joi.string().required().label('Full Name'),
    email: Joi.string().email().required(),
    phone: Joi.number().required(),
    dob: Joi.date().optional(),
  }).required(),
};
const customMessages = {
  'timestamp': 'This request requires a timestamp',
  'email': 'Generic email message',
  'data': 'You must include a data object in your payload',
  'data.name': 'Please give us your name',
  'data.phone': 'Please give us your name',
};

// set up server and test routes
let server;
before(function(done) {
  server = new Hapi.Server().connection({
    routes: {
      validate: {
        options: {
          abortEarly: false,
        }
      }
    }
  });

  server.route([{
    method: 'POST',
    path: path + '/no-options',
    config: {
      validate: {
        payload: payload,
        failAction: ErrorMessages().failAction,
      }
    },
    handler: (request, reply) => reply()
  }, {
    method: 'POST',
    path: path + '/quotes',
    config: {
      validate: {
        payload: payload,
        failAction: ErrorMessages({ stripQuotes: false }).failAction,
      }
    },
    handler: (request, reply) => reply()
  }, {
    method: 'POST',
    path: path + '/messages',
    config: {
      validate: {
        payload: payload,
        failAction: ErrorMessages({ messages: customMessages }).failAction,
      }
    },
    handler: (request, reply) => reply()
  }]);
  done();
});

describe('Error Messages', function() {

  describe('Options', function() {

    it('should not be required', function(done) {
      const test = ErrorMessages();
      expect(test).to.be.an.object().and.to.contain(['failAction']);
      done();
    });

    it('should allow options to be chainable', function(done) {
      const test = ErrorMessages().options({});
      expect(test).to.be.an.object().and.to.contain(['failAction']);
      done();
    });

    it('should strip quotes by default', function(done) {
      server.inject({ method: 'POST', url: path + '/no-options', payload: {} }, (res) => {
        res.result.validation.errors.map((error) => {
          expect(error.message).to.not.contain(['"']);
        });
        done();
      });
    });

    it('should not strip quotes when stripQuotes option is false', function(done) {
      server.inject({ method: 'POST', url: path + '/quotes', payload: {} }, (res) => {
        res.result.validation.errors.map((error) => {
          expect(error.message).to.contain(['"']);
        });
        done();
      });
    });
  });

  describe('Response', function() {

    it('should return a proper error response object when no options are passed', function(done) {
      server.inject({ method: 'POST', url: path + '/no-options', payload: {} }, (res) => {
        expect(res.result).to.be.an.object();
        expect(res.result.validation).to.exist().and.to.be.an.object();
        expect(res.result.validation.errors).to.exist().and.to.be.an.array().and.to.not.be.empty();
        res.result.validation.errors.map((error) => {
          expect(error).to.be.an.object();
          expect(Object.keys(error)).to.contain(['message', 'key', 'path', 'type', 'constraint']);
        });
        done();
      });
    });

    it('should return prettier Joi messages when no custom messages are passed', function(done) {
      server.inject({ method: 'POST', url: path + '/no-options', payload: {} }, (res) => {
        res.result.validation.errors.map((error) => {
          expect(error.message).to.not.contain(['child', 'because of']);
        });
        done();
      });
    });

    it('should return custom error message for a generic key match', function(done) {
      server.inject({ method: 'POST', url: path + '/messages',
        payload: {
          data: { email: 'some bad email' }
        }
      }, (res) => {
        let passed = false;

        res.result.validation.errors.map((error) => {
          if(error.key === 'email') {
            passed = true;
            expect(error.message).to.equal(customMessages.email);
          }
        });

        expect(passed).to.be.true();
        done();
      });
    });

    it('should return custom error message for a generic key match', function(done) {
      server.inject({ method: 'POST', url: path + '/messages',
        payload: {
          data: { phone: 'this is not a phone number' }
        }
      }, (res) => {
        let passed = false;

        res.result.validation.errors.map((error) => {
          if(error.path === 'data.phone') {
            passed = true;
            expect(error.message).to.equal(customMessages[error.path]);
          }
        });

        expect(passed).to.be.true();
        done();
      });
    });

    it('should include `label` when setting custom Joi label', function(done) {
      server.inject({ method: 'POST', url: path + '/messages',
        payload: {
          data: { name: '' }
        }
      }, (res) => {
        let passed = false;

        res.result.validation.errors.map((error) => {
          if(error.path === 'data.name') {
            passed = true;
            expect(error.hasOwnProperty('label')).to.be.true();
            expect(error.label).to.equal('Full Name');
          }
        });

        expect(passed).to.be.true();
        done();
      });
    });

  });
});
