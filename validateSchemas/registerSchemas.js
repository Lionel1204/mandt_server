
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
  }
}

module.exports = {
  loginBodySchema,
  loginQuerySchema
};
