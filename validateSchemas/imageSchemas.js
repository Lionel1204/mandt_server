const createImageBodySchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    }
  },
  required: ['image']
}

module.exports = {
  createImageBodySchema
};
