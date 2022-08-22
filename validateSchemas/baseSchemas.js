const MAX_NUMBER = Math.pow(2, 31) - 1;

const weightSchema = {
  type: 'object',
  properties: {
    scale: {
      type: 'number',
      exclusiveMinimum: 0,
      maximum: 100000
    },
    unit: {
      type: 'string',
      minLength: 1
    }
  }
};

const sizeSchema = {
  type: 'object',
  properties: {
    length: {
      type: 'number',
      exclusiveMinimum: 0,
      maximum: 10000
    },
    width: {
      type: 'number',
      exclusiveMinimum: 0,
      maximum: 10000
    },
    height: {
      type: 'number',
      exclusiveMinimum: 0,
      maximum: 10000
    },
    unit: {
      type: 'string',
      minLength: 1
    }
  }
};

const paginationSchema = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 100
    },
    offset: {
      type: 'integer',
      minimum: 0,
      default: 0,
      maximum: MAX_NUMBER
    }
  }
};


// Request Path parameters check
const manifestPathSchema = {
  type: 'object',
  properties: {
    manifestId: {
      type: 'integer',
      minimum: 1
    },
    packageId: {
      type: 'integer',
      minimum: 1
    },
    cargoId: {
      type: 'integer',
      minimum: 1
    },
    pathId: {
      type: 'integer',
      minimum: 1
    },
    userId: {
      type: 'integer',
      minimum: 1
    }
  }
}

module.exports = {
  paginationSchema,
  manifestPathSchema,
  weightSchema,
  sizeSchema
};
