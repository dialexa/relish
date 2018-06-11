<!-- version -->
API Documentation - `v3.0.0`
---
<!-- versionstop -->

<!-- toc -->

- [Relish](#relish)
  - [_constructor_ / `options([opts])`](#_constructor_--optionsopts)
  - [`failAction(request, h, err)`](#failactionrequest-h-err)

<!-- tocstop -->

# Relish

## _constructor_ / `options([opts])`
The Relish constructor and `.options` helper accept an optional `opts` configuration object where:

- `opts` - _[object]_ optional configuration object
  - `stripQuotes` - _[boolean]_ strip double quotes in default Joi messages (defaults to `false`)
  - `messages` - _[object]_ custom messages object
    - _key_ - _[string]_ either the full `path` or generic `key` from the Joi schema (a `path` match takes priority)
    - _value_ - _[string]_ the custom message to be returned

**Examples**
```javascript
const Relish = require('relish')({
  stripQuotes: true, // affects default Joi messages only
  messages: {
    'email': 'A generic email key message',
    'data.customer.email': 'A path-specific error message'
  }
})

const failAction = Relish.failAction
```
```javascript
const Relish = require('relish')({ stripQuotes: true })

const failAction = Relish.options({
  messages: {
    'email': 'A generic email key message',
    'data.customer.email': 'A path-specific error message'
  }
}).failAction
```

## `failAction(request, h, err)`
A helper function that can be used as a custom failAction handler in your Hapi.js [Route Options][hapi-route-options].

<!-- URLs -->
[hapi-route-options]:http://hapijs.com/api#route-options
