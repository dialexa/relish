# hapi-custom-error-messages
[![Build Status][build-img]][build-url]
[![Coverage Status][coverage-img]][coverage-url]

Better error messages for Hapi.js Joi validation

[Joi](https://github.com/hapijs/joi) provides awesome schema validation, but the error messages returned are not user-friendly. This package returns a more user-friendly version of Joi's default response and allows for custom error messages.

**Default Joi Response**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "child \"data\" fails because [child \"name\" fails because [\"name\" is not allowed to be empty], child \"email\" fails because [\"email\" must be a valid email]]",
  "validation": {
    "source": "payload",
    "keys": [
      "data.name",
      "data.email"
    ]
  }
}
```

**Custom Error Messages Response**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Please enter your full name, \"email\" must be a valid email",
  "validation": {
    "source": "payload",
    "errors": [
      {
        "key": "name",
        "path": "data.name",
        "message": "Please enter your full name",
        "type": "any",
        "constraint": "required"
      },
      {
        "key": "email",
        "path": "data.email",
        "message": "\"email\" must be a valid email",
        "type": "string",
        "constraint": "email"
      }
    ]
  }
}
```

<!-- ## Installation
```sh
npm install hapi-custom-error-messages --save
``` -->

## Basic Usage
First load and initialize the module

```js
// load the package and set custom message options
const ErrorMessages = require('hapi-custom-error-messages')({
  messages: {
    'data.name': 'Please enter your full name'
  }
});
```

Once initialized, this package exposes a custom `failAction` handler that can be used in your Hapi.js [Route Options](http://hapijs.com/api#route-options).

```js
// call the failAction handler in your route options
server.route({
  method: 'POST',
  path: '/',
  config: {
    validate: {
      // set a custom failAction handler
      failAction: ErrorMessages.failAction,
      payload: {
        data: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email()
        })
      }
    }
  },
  handler: (request, reply) => reply()
});
```

#### Global Usage (alternative)
You can apply this module to all routes by setting the failAction in your server connection options.

```js
server.connection({
  // ... other connection options

  routes: {
    validate: {
      failAction: ErrorMessages.failAction
    }
  }
});
```

<!-- URLs -->
[build-img]:https://travis-ci.org/dialexa/hapi-custom-error-messages.svg?branch=master
[build-url]:https://travis-ci.org/dialexa/hapi-custom-error-messages
[coverage-img]:https://coveralls.io/repos/dialexa/hapi-custom-error-messages/badge.svg?branch=master&service=github
[coverage-url]:https://coveralls.io/github/dialexa/hapi-custom-error-messages?branch=master
