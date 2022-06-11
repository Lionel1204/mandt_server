const { createUserSchema } = require('./userSchemas');
const { paginationSchema } = require('./baseSchemas');
const listCompaniesQuerySchema = {
  type: 'object',
  allOf: [
    paginationSchema,
    {
      type: 'object',
      properties: {
        type: {
          type: 'string'
        },
        scope: {
          type: 'string'
        }
      }
    }
  ]
}

const createCompanyBodySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['LOGISTICS', 'SHIPPER_RECEIVER']
    },
    scope: {
      type: 'string',
      enum: ['INTERNATION', 'INLAND']
    },
    contactId: {
      type: 'integer',
      minimum: 1
    },
    contactInfo: createUserSchema,
    license: {
      type: 'string'
    },
    capability: {
      type: 'integer',
      minimum: 1,
      maximum: 5
    },
    transport: {
      type: 'array',
      maxItems: 4,
      uniqueItems: true,
      items: [ {
        type: 'string',
        enum: ['HIGHWAY', 'SEA', 'RAILWAY', 'AIR']
      }]
    }
  },
  required: ['name', 'license']
};

module.exports = {
  listCompaniesQuerySchema,
  createCompanyBodySchema
};
