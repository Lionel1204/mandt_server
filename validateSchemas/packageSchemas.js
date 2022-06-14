const { paginationSchema } = require('./baseSchemas');

const packageSizeSchema = {
  type: 'object',
  properties: {
    length: {
      type: 'number',
      exclusiveMinimum: 0
    },
    width: {
      type: 'number',
      exclusiveMinimum: 0
    },
    height: {
      type: 'number',
      exclusiveMinimum: 0
    },
    unit: {
      type: 'string',
      minLength: 1
    }
  }
}

const packageWeightSchema = {
  type: 'object',
  properties: {
    scale: {
      type: 'number',
      exclusiveMinimum: 0
    },
    unit: {
      type: 'string',
      minLength: 1
    }
  }
}

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
    size: packageSizeSchema,
    weight: packageWeightSchema
  }
}

const packageParamSchema = {
  type: 'object',
  properties: {
    manifestId: {
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
        userId: {
          type: 'integer',
          minimum: 1
        },
        status: {
          type: 'string'
        },
        manifestId: {
          type: 'integer',
          minimum: -1
        }
      }
    }
  ]
}
module.exports = {
  createPackageBodySchema,
  packageParamSchema,
  packageQuerySchema
};
