const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {manifestPathSchema} = require("../validateSchemas/baseSchemas");
const {createImageBodySchema, listImagesSchema, getImagesSchema} = require("../validateSchemas/imageSchemas");
const nconf = require("nconf");

class ImagesController extends BaseController {
  constructor() {
    super();
    this.prefix = nconf.get('NODE_ENV');
  }

  async upload(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateBody(createImageBodySchema, req.body);

      const payload = req.body;
      const { manifestId, packageId } = req.params;
      const [uploadService, serializerService] = await serviceFactory.getService('UploadService', 'SerializerService');
      const url = await uploadService.upload(this.prefix, manifestId, packageId, payload.image);

      res.status(201).json({url});
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async list(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateQuery(listImagesSchema, req.query);
      const { manifestId, packageId } = req.params;
      const { filter } = req.query;
      const [uploadService, serializerService] = await serviceFactory.getService('UploadService', 'SerializerService');

      const url = await uploadService.listImageNames(this.prefix, manifestId, packageId, filter);

      res.status(200).json(url);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async getImages(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateBody(getImagesSchema, req.body);
      const { manifestId, packageId } = req.params;
      const names = req.body;
      const [uploadService, serializerService] = await serviceFactory.getService('UploadService', 'SerializerService');
      const urls = await uploadService.getImages(this.prefix, manifestId, packageId, names);

      res.status(200).json(urls);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = ImagesController;
