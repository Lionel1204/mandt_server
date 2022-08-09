const { paginationSchema, sizeSchema, weightSchema } = require('./baseSchemas');

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
      minimum: 0,
      maximum: 1000
    },
    creator: {
      type: 'integer',
      minimum: 1
    },
    packageId: {
      type: 'integer',
      minimum: 1
    },
    size: sizeSchema,
    weight: weightSchema
  },
  required: ['name', 'model', 'amount', 'creator', 'packageId']
};

module.exports = {
  listCargoQuerySchema,
  createCargoBodySchema,
  queryCargoSchema
};
