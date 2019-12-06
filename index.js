'use strict'

const Hoek = require('@hapi/hoek')

const internals = {}

internals.defaults = {
  stripQuotes: false,
  messages: {}
}

const Relish = function Relish (opts) {
  this.exports = {}
  this._opts = opts ? Hoek.applyToDefaults(internals.defaults, opts) : internals.defaults

  this.parseError = (error) => {
    return error.details.map((i) => {
      let err = {
        key: i.context.key,
        path: i.path.join('.'),
        message: this._opts.stripQuotes ? i.message.replace(/"/g, '') : i.message,
        type: i.type.split('.').shift(),
        constraint: i.type.split('.').pop()
      }

      // if label is different than key, provide label
      if (i.context.label !== err.key) {
        err.label = i.context.label
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

  this.formatResponse = (error, source, errorMessage, errors) => {
    // append errors array to response
    error.output.payload.message = errorMessage
    error.output.payload.validation = {
      source: source,
      errors: errors
    }

    return error
  }

  this.exports.options = (opts) => {
    this._opts = Hoek.applyToDefaults(this._opts, opts)

    return this.exports
  }

  this.exports.failAction = (request, h, err) => {
    // parse error object
    const errors = this.parseError(err)

    // build main error message
    const errorMessage = errors.map((e) => e.message).join(', ')

    // retrieve validation failure source
    const source = err.output.payload.validation.source

    // format error response
    err = this.formatResponse(err, source, errorMessage, errors)

    return err
  }

  return this.exports
}

module.exports = (opts) => new Relish(opts)
