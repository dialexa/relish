'use strict';

const Boom = require('boom');
const Hoek = require('hoek');

const ErrorMessages = function ErrorMessages(options) {

  const opts = Hoek.applyToDefaults({ stripQuotes: true }, options);
  const internals = {};

  internals.parseError = (error) => {
    return error.data.details.map((i) => {
      let err = {
        key: i.path.split('.').pop(),
        path: i.path,
        message: opts.stripQuotes ? i.message.replace(/"/g, '') : i.message,
        type: i.type.split('.').shift(),
        constraint: i.type.split('.').pop(),
      };

      // if label is different than key, provide label
      if(i.context.key !== err.key) {
        err.label = i.context.key;
      }

      // set custom message (if exists)
      if(opts.messages.hasOwnProperty(err.path)) {
        err.message = opts.messages[err.path];
      } else if(opts.messages.hasOwnProperty(err.key)) {
        err.message = opts.messages[err.key];
      }

      return err;
    });
  };

  return {
    failAction: (request, reply, source, error) => {
      // parse error object
      let errors = internals.parseError(error);

      // build error message
      let errorMessage = errors.map((e) => e.message).join(', ');

      // create new error response if not already Boom
      let errorResponse = !error.isBoom ? Boom.create(error.output.statusCode, null, error.data || error) : error;

      // append errors array to response
      error.output.payload.message = errorMessage;
      error.output.payload.validation = {
        source: source,
        errors: errors,
      };

      return reply(error);
    }
  };
};

module.exports = ErrorMessages;
