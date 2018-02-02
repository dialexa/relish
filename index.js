'use strict'

const Hoek = require('hoek')

const Relish = function Relish (opts) {
  this.exports = {}
  this._defaults = {
    stripQuotes: false,
    messages: {}
  }
  this._opts = opts ? Hoek.applyToDefaults(this._defaults, opts) : this._defaults

  this._parseErrorDetails = (data) => {
    return data.details.map((i) => {
      const path = Array.isArray(i.path) ? i.path.join('.') : i.path

      // construct error details to be returned
      let err = {
        ...i,
        path, // flatten path
        message: this._opts.stripQuotes ? i.message.replace(/"/g, '') : i.message
      }

      // set custom message (if exists)
      err.message = this._setMessage(err)

      return err
    })
  }

  this._setMessage = (err) => {
    let { message } = err

    switch (true) {
      // match on full path (etc data.email)
      case this._opts.messages.hasOwnProperty(err.path):
        message = this._opts.messages[err.path]
        break
      // match on key (etc email)
      case this._opts.messages.hasOwnProperty(err.context.key):
        message = this._opts.messages[err.context.key]
        break
      // match on type (etc string.email)
      case this._opts.messages.hasOwnProperty(err.type):
        message = this._opts.messages[err.type]
        break
    }

    return message
  }

  this._formatResponse = (error, source, errorMessage, details) => {
    // replace main response message and details
    error.output.payload.message = errorMessage
    error.output.payload.validation.details = details

    return error
  }

  this.exports.options = (opts) => {
    this._opts = Hoek.applyToDefaults(this._opts, opts)

    return this.exports
  }

  this.exports.failAction = (request, reply, source, error) => {
    // only handle Joi errors
    const { data = {} } = error
    if (!data.isJoi) return reply(error)

    // parse error details object
    const details = this._parseErrorDetails(data)

    // build main error message
    const errorMessage = details.map((e) => e.message).join(', ')

    // format error response
    error = this._formatResponse(error, source, errorMessage, details)

    return reply(error)
  }

  return this.exports
}

module.exports = (opts) => new Relish(opts)
