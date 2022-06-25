const { paginationSchema } = require('./baseSchemas');

const listCargoQuerySchema = {
  allOf: [
    paginationSchema,
    {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 3
        },
        model: {
          type: 'string',
          minLength: 1
        },
        packageId: {
          type: 'integer',
          minimum: 1
        }
      }
    }
  ]
};

const queryCargoSchema = {
  allOf: [
    listCargoQuerySchema,
    {
      type: 'object',
      properties: {
        creator: {
          type: 'integer',
          minimum: 1
        }
      }
    }

  ]
}


const createCargoBodySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1
    },
    model: {
      type: 'string',
      minLength: 1
    },
    amount: {
      type: 'integer',
      minimum: 0
    },
    creator: {
      type: 'integer',
      minimum: 1
    },
    packageId: {
      type: 'integer',
      minimum: 1
    }
  },
  required: ['name', 'model', 'amount', 'creator', 'packageId']
};

module.exports = {
  listCargoQuerySchema,
  createCargoBodySchema,
  queryCargoSchema
};
