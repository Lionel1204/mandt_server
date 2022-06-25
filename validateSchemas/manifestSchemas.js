const { paginationSchema } = require('./baseSchemas');

const listManifestQuerySchema = {
  allOf: [
    paginationSchema,
    {
      type: 'object',
      properties: {
        project: {
          type: 'integer',
          minimum: 1
        },
        owner: {
          type: 'integer',
          minimum: 1
        },
        status: {
          type: 'string'
        },
        noteNo: {
          type: 'string',
          minLength: 3
        }
      }
    }
  ]
};

const createManifestBodySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    projectId: {
      type: 'integer',
      minimum: 1
    },
    noteNo: {
      type: 'string',
      minLength: 1
    },
    creator: {
      type: 'integer',
      minimum: 1
    },
    receiver: {
      type: 'integer',
      minimum: 1
    }
  },
  required: ['noteNo', 'creator']
}

const manifestParamSchema = {
  type: 'object',
  properties: {
    manifestId: {
      type: 'integer',
      minimum: 1
    }
  },
  required: ['manifestId']
};

const updateManifestBodySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    projectId: {
      type: 'integer',
      minimum: 1
    },
    noteNo: {
      type: 'string',
      minLength: 1
    },
    creator: {
      type: 'integer',
      minimum: 1
    },
    receiver: {
      type: 'integer',
      minimum: 1
    },
    status: {
      type: 'string',
      enum: ['CREATED', 'PUBLISHED', 'CONFIRMED', 'SHIPPING', 'ENDED']
    }
  }
}

module.exports = {
  listManifestQuerySchema,
  createManifestBodySchema,
  manifestParamSchema,
  updateManifestBodySchema
};
