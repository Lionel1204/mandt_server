const postFeedBackPayloadSchema = {
  type: 'object',
  properties: {
    phone: {
      type: 'string',
      minLength: 1,
      maxLength: 13
    },
    problem: {
      type: 'string',
      minLength: 1,
      maxLength: 4096
    },
    idea: {
      type: 'string',
      minLength: 1,
      maxLength: 4096
    }
  }
};

module.exports = {
  postFeedBackPayloadSchema
};
