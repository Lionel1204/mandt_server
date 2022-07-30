const createUserSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1
    },
    title: {
      type: 'string'
    },
    identity: {
      type: 'string',
      minLength: 8
    },
    phone: {
      type: 'string',
      minLength: 7
    },
    email: {
      type: 'string',
      minLength: 3,
      pattern: '^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\\.][a-z]{2,3}([\\.][a-z]{2})?$'
    },
    password: {
      type: 'string',
      minLength: 5,
      pattern: '[\\w!@#$%^&*,.]+'
    }
  },
  required: ['name', 'phone']
}


module.exports = {
  createUserSchema
};
