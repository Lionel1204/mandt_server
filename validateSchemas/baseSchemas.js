const MAX_NUMBER = Math.pow(2, 31) - 1;

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

const manifestPathSchema = {
  type: 'object',
  properties: {
    manifestId: {
      type: 'integer',
      minimum: 1
    },
    cargoId: {
      type: 'integer',
      minimum: 1
    }
  }
}

module.exports = {
  paginationSchema,
  manifestPathSchema
};
