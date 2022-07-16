const { paginationSchema, weightSchema, sizeSchema} = require('./baseSchemas');

const createPackageBodySchema = {
  type: 'object',
  properties: {
    packageNo: {
      type: 'string',
      minLength: 1
    },
    wrappingType: {
      type: 'string',
      enum: ['WOODENCASE', 'IRONCASE', 'TRAY', 'UNWRAPPED']
    },
    shippingType: {
      type: 'string',
      enum: ['CONTAINER', 'BULK']
    },
    status: {
      type: 'string',
      enum: ['CREATED', 'INTRANSIT', 'FINISHED']
    },
    creator: {
      type: 'integer',
      minimum: 1
    },
    size: sizeSchema,
    weight: weightSchema
  },
  required: ['wrappingType', 'shippingType', 'size', 'weight', 'creator']
}

const packageParamSchema = {
  type: 'object',
  properties: {
    manifestId: {
      type: 'integer',
      minimum: 1
    },
    packageId: {
      type: 'integer',
      minimum: 1
    }
  },
  required: ['manifestId']
}

const packageQuerySchema = {
  allOf: [
    paginationSchema,
    {
      type: 'object',
      properties: {
        creator: {
          type: 'integer',
          minimum: 1
        },
        status: {
          type: 'string'
        },
        manifestId: {
          type: 'integer',
          minimum: 1
        },
        packageNo: {
          type: 'string',
          minLength: 3
        }
      }
    }
  ]
};

const updatePackageBodySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    packageNo: {
      type: 'string',
      minLength: 1
    },
    wrappingType: {
      type: 'string',
      enum: ['WOODENCASE', 'IRONCASE', 'TRAY', 'UNWRAPPED']
    },
    shippingType: {
      type: 'string',
      enum: ['CONTAINER', 'BULK']
    },
    status: {
      type: 'string',
      enum: ['CREATED', 'INTRANSIT', 'FINISHED']
    },
    size: sizeSchema,
    weight: weightSchema
  }
}


module.exports = {
  createPackageBodySchema,
  packageParamSchema,
  packageQuerySchema,
  updatePackageBodySchema
};
