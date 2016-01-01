hapi-custom-error-messages
---

Custom Error Messages for Hapi.js Joi Validation

## Example Response
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

## Usage

```js
const ErrorMessages = require('hapi-custom-error-messages')({
  messages: {
    'email': 'Please enter a valid email',
    'data.name': 'Please enter your full name'
  }
});
```

### `.failAction` Helper
This helper function can be used in place of a custom `failAction` in your Hapi.js [Route Options](http://hapijs.com/api#route-options)

#### Global Usage
This sets the `failAction` for **all routes**
```js
server.connection({
  port: 3000,
  routes: {
    validate: {
      // use as a global failAction (applies to all routes)
      failAction: ErrorMessages.failAction
    }
  }
});
```

#### Individual Route
This sets the `failAction` for **only this route**
```js
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
      failAction: ErrorMessages.failAction
    }
  },
  handler: (request, reply) => reply()
});
```
