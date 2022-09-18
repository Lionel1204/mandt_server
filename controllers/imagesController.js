const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {manifestPathSchema} = require("../validateSchemas/baseSchemas");
const {createImageBodySchema} = require("../validateSchemas/imageSchemas");
const nconf = require("nconf");

class ImagesController extends BaseController {
  constructor() {
    super();
    this.prefix = nconf.get('NODE_ENV');
  }

  async upload(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params)
      this.validateBody(createImageBodySchema, req.body);

      const payload = req.body;
      const { manifestId, packageId } = req.params;
      const [uploadService, serializerService] = await serviceFactory.getService('UploadService', 'SerializerService');
      await uploadService.upload(this.prefix, manifestId, packageId, payload.image);

      res.status(201);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async list(req, res) {

  }
}

module.exports = ImagesController;
