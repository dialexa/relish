hapi-custom-error-messages
---

Custom Error Messages for Hapi.js Joi Validation

## Installation
```sh
npm install --save hapi-custom-error-messages
```

## Usage

#### Set Up Custom Messages
```js
// include the module and pass custom messages option
const ErrorMessages = require('hapi-custom-error-messages')({
  messages: {
    'email': 'Generic email message',
    'data': 'You must include a data object in your payload',
    'data.name': 'Please give us your name',
    'data.email': 'Please give us your email',
  }
});
```

#### Route Specific Usage
```js
server.route({
    method: 'POST',
    path: '/',
    config: {
      validate: {
        // call the module's failAction
        failAction: ErrorMessages.failAction
      }
    },
  },
  handler: function (request, reply) {
    reply();
  }
});
```

#### Global Usage (applies to all routes)
```js
server.connection({
  routes: {
    validate: {
      // call the module's failAction
      failAction: ErrorMessages.failAction
      options: {
        abortEarly: false,
      }
    }
  }
});
```

#### Response
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Please give us your email, Please give us your email, Phone is required, Generic email message",
  "validation": {
    "source": "payload",
    "errors": [
      {
        "key": "email",
        "path": "data.email",
        "message": "Please give us your email",
        "type": "any",
        "constraint": "empty"
      },
      {
        "key": "email",
        "path": "data.email",
        "message": "Please give us your email",
        "type": "string",
        "constraint": "email"
      },
      {
        "key": "phone",
        "path": "data.phone",
        "message": "Phone is required",
        "type": "any",
        "constraint": "required",
        "label": "Phone"
      },
      {
        "key": "email",
        "path": "data.customer.email",
        "message": "Generic email message",
        "type": "object",
        "constraint": "allowUnknown"
      }
    ]
  }
}
```
