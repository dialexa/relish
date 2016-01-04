'use strict'

const Hoek = require('hoek')

const internals = {}

internals.defaults = {
  stripQuotes: false,
  messages: {}
}

const Relish = function Relish (opts) {
  this._opts = opts ? Hoek.applyToDefaults(internals.defaults, opts) : internals.defaults

  this.options = (opts) => {
    this._opts = Hoek.applyToDefaults(this._opts, opts)

    return this
  }

  this.parseError = (error) => {
    return error.data.details.map((i) => {
      let err = {
        key: i.path.split('.').pop(),
        path: i.path,
        message: this._opts.stripQuotes ? i.message.replace(/"/g, '') : i.message,
        type: i.type.split('.').shift(),
        constraint: i.type.split('.').pop()
      }

      // if label is different than key, provide label
      if (i.context.key !== err.key) {
        err.label = i.context.key
      }

      // set custom message (if exists)
      if (this._opts.messages.hasOwnProperty(err.path)) {
        err.message = this._opts.messages[err.path]
      } else if (this._opts.messages.hasOwnProperty(err.key)) {
        err.message = this._opts.messages[err.key]
      }

      return err
    })
  }

  this.failAction = (request, reply, source, error) => {
    // parse error object
    let errors = this.parseError(error)

    // build error message
    let errorMessage = errors.map((e) => e.message).join(', ')

    // append errors array to response
    error.output.payload.message = errorMessage
    error.output.payload.validation = {
      source: source,
      errors: errors
    }

    return reply(error)
  }

  return this
}

module.exports = function (opts) {
  return new Relish(opts)
}
