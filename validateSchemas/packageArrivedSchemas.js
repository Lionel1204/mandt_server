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
    },
    takeOver: {
      type: 'boolean'
    }
  },
  required: ['pathNode']
}

module.exports = {
  listArrivedInfoQuerySchema,
  updateArrivedInfoBodySchema
};

