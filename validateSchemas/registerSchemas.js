
const loginBodySchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      minLength: 1
    },
    password: {
      type: 'string',
      minLength: 6,
      pattern: '[\\w!@#$%^&*,.]+'
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
};

const captchaQuerySchema = {
  type: 'object',
  properties: {
    base64: {
      type: 'boolean'
    }
  }
};

const updatePasswordSchema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      minLength: 6,
      pattern: '[\\w!@#$%^&*,.]+'
    }
  }
};

module.exports = {
  loginBodySchema,
  loginQuerySchema,
  captchaQuerySchema,
  updatePasswordSchema
};
