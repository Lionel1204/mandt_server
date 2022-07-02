
const createPathNodeSchema = {
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
  type: 'object',
  properties: {
    packageId: {
      type: 'integer',
      minimum: 1
    },
    arrived: {
      type: 'boolean'
    },
    pathIdList: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: 1,
        uniqueItems: true
      }
    }
  },
  required: ['packageId', 'pathIdList', 'arrived']
};

const createPathBodySchema = {
  type: 'array',
  items: createPathNodeSchema
};

module.exports = {
  createPathBodySchema,
  updatePathBodySchema,
};
