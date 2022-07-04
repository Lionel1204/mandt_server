
const pathNodeSchema = {
  type: 'object',
  properties: {
    address: {
      type: 'string',
      minLength: 1
    },
    assignee: {
      type: 'integer',
      minimum: 1
    },
    type: {
      type: 'integer',
      minimum: 0,
      maximum: 2
    }
  },
  required: ['address', 'assignee']
};

const updatePathBodySchema = {
  type: 'array',
  items: pathNodeSchema
};

const createPathBodySchema = {
  type: 'array',
  items: pathNodeSchema
};

module.exports = {
  createPathBodySchema,
  updatePathBodySchema,
};
