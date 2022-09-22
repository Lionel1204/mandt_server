const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {manifestPathSchema} = require("../validateSchemas/baseSchemas");
const {createImageBodySchema, listImagesSchema, getImagesSchema, listImagesFilterSchema} = require("../validateSchemas/imageSchemas");
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

      const {image, pathNode}= req.body;
      const { manifestId, packageId } = req.params;
      const [uploadService, serializerService] = await serviceFactory.getService('UploadService', 'SerializerService');
      const url = await uploadService.upload(this.prefix, manifestId, packageId, pathNode, image);

      res.status(201).json({url});
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async list(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      //this.validateQuery(listImagesSchema, req.query);
      const filter = req.query?.filter || {};
      this.validateFilter(listImagesFilterSchema, filter);
      const { manifestId, packageId } = req.params;
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
      const payload = req.body;
      const [uploadService, serializerService] = await serviceFactory.getService('UploadService', 'SerializerService');
      const urls = await uploadService.getImages(this.prefix, manifestId, packageId, payload);

      res.status(200).json(urls);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = ImagesController;
