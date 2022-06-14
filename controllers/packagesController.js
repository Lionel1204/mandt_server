const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {createPackageBodySchema, packageParamSchema} = require("../validateSchemas/packageSchemas");

class PackagesController extends BaseController {
  constructor() {
    super();
  }

  async post(req, res) {
    try {
      this.validateBody(createPackageBodySchema, req.body);
      this.validateParam(packageParamSchema, req.params);
      const { manifestId }= req.params;
      const payload = req.body;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const pkg = await dataService.createPackage(manifestId, payload);
      const output = serializerService.serializePackage(pkg);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async get(req, res) {

  }

  async list(req, res) {

  }

  async patch(req, res) {

  }

  async delete(req, res) {

  }
}

module.exports = PackagesController;
