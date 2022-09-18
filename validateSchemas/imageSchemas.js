const createImageBodySchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    }
  },
  required: ['image']
};

const listImagesSchema = {
  type: 'object',
  properties: {
    filter: {
      type: 'string',
      enum: ['thumbnail']
    }
  }
};

const getImagesSchema = {
  type: 'array',
  items: {
    maxItems: 9,
    uniqueItems: true,
    items: [{
      type: 'string',
      transform: ['trim'],
      minLength: 1,
      maxLength: 1024
    }]
  }
}

module.exports = {
  createImageBodySchema,
  listImagesSchema,
  getImagesSchema
};
