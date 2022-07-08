
const loginBodySchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      minLength: 1
    },
    password: {
      type: 'string',
      minLength: 1
    },
    captcha: {
      type: 'string',
      minLength: 4,
      maxLength: 6
    }
  },
  required: ['userId']
};

const loginQuerySchema = {
  type: 'object',
  properties: {
    action: {
      type: 'string',
      pattern: 'login|logout'
    }
  },
  required: ['action']
}

const captchaQuerySchema = {
  type: 'object',
  properties: {
    base64: {
      type: 'boolean'
    }
  }
}
module.exports = {
  loginBodySchema,
  loginQuerySchema,
  captchaQuerySchema
};
