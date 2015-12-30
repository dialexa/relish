hapi-custom-error-messages
---

Custom Error Messages for Hapi.js Joi Validation

## Usage

```js
const Hapi = require('hapi');
const Joi = require('joi');
const ErrorMessages = require('hapi-custom-error-messages');

const server = new Hapi.Server();
server.connection({
  port: 3000,
  routes: {
    validate: {
      // use as a global failAction (applies to all routes)
      failAction: ErrorMessages().failAction
    }
  }
});

server.route({
  method: 'POST',
  path: '/',
  config: {
    validate: {
      payload: {
        data: Joi.object({
          email: Joi.string().email(),
          name: Joi.string().required()
        })
      },
      // use as your server route's failAction
      failAction: ErrorMessages({
        messages: {
          'email': 'Please enter a valid email',
          'data.name': 'Please enter your full name'
        }
      }).failAction
    }
  },
  handler: function (request, reply) {
    reply();
  }
});

server.start(() => { console.log('Server running at:', server.info.uri); });
```

#### Example Response
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Please enter a valid email, Please enter your full name",
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
        "message": "Please enter a valid email",
        "type": "string",
        "constraint": "email"
      }
    ]
  }
}
```
