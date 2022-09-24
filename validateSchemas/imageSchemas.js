const createImageBodySchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    pathNode: {
      type: 'integer',
      minimum: 0
    }
  },
  required: ['image', 'pathNode']
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

const listImagesFilterSchema = {
  type: 'object',
  properties: {
    thumbnail: {
      type: 'boolean'
    },
    pathnode: {
      type: 'string'
    }
  }
}

const getImagesSchema = {
  type: 'array',
  items: {
    maxItems: 9,
    uniqueItems: true,
    properties: {
      pathNode: {
        type: 'integer',
        minimum: 0
      },
      imageName: {
        type: 'string',
        transform: ['trim'],
        minLength: 1,
        maxLength: 1024
      }
    }
  }
};

const deleteImagesSchema = {
  type: 'object',
  properties: {
    pathnode: {
      type: 'integer',
      minimum: 1
    }
  },
  required: ['pathnode']
}

module.exports = {
  createImageBodySchema,
  listImagesSchema,
  getImagesSchema,
  listImagesFilterSchema,
  deleteImagesSchema
};
