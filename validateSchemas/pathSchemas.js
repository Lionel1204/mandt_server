
const createPathNodeSchema = {
  type: 'object',
  properties: {
    waybillNo: {
      type: 'string',
      minLength: 1
    },
    address: {
      type: 'string',
      minLength: 1
    },
    assignee: {
      type: 'integer',
      minimum: 1
    },
    arrived: {
      type: 'boolean'
    },
    type: {
      type: 'integer',
      minimum: 0,
      maximum: 2
    }
  },
  required: ['waybillNo', 'address', 'assignee', 'arrived', 'type']
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
  type: 'object',
  properties: {
    packageId: {
      type: 'integer',
      minimum: 1
    },
    pathList: {
      type: 'array',
      items: createPathNodeSchema
    }
  },
  required: ['packageId', 'pathList']
};

const listPathQuerySchema = {
  type: 'object',
  properties: {
    packageId: {
      type: 'integer',
      minimum: 1
    }
  },
  required: ['packageId']
}
module.exports = {
  createPathBodySchema,
  updatePathBodySchema,
  listPathQuerySchema
};
