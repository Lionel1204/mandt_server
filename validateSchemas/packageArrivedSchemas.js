
const { paginationSchema } = require('./baseSchemas');
const listArrivedInfoQuerySchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'integer',
      minimum: 1
    },
    assignee: {
      type: 'integer',
      minimum: 1
    }
  }
}

const updateArrivedInfoBodySchema = {
  type: 'object',
  properties: {
    pathNode: {
      type: 'integer',
      minimum: 0
    },
    arrived: {
      type: 'boolean'
    },
    wayBillNo: {
      type: 'string',
      minLength: 1
    }
  },
  required: ['pathNode', 'arrived']
}

module.exports = {
  listArrivedInfoQuerySchema,
  updateArrivedInfoBodySchema
};

