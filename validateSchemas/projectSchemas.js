const createProjectSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    receiverId: {
      type: 'integer',
      minimum: 1
    },
    ownerId: {
      type: 'integer',
      minimum: 1
    },
    status: {
      type: 'string',
      enum: ['ACTIVE', 'INACTIVE']
    }
  },
  required: ['name', 'ownerId']
};

const updateProjectSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    receiverId: {
      type: 'integer',
      minimum: 1
    },
    ownerId: {
      type: 'integer',
      minimum: 1
    },
    status: {
      type: 'string',
      enum: ['ACTIVE', 'INACTIVE', 'COMPLETED', 'HOLD']
    }
  }
}

const projectPathSchema = {
  type: 'object',
  properties: {
    projectId: {
      type: 'integer',
      minimum: 1
    }
  }
}

module.exports = {
  createProjectSchema,
  projectPathSchema,
  updateProjectSchema
};
