const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {createPackageBodySchema, packageParamSchema, packageQuerySchema} = require("../validateSchemas/packageSchemas");

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
      const output = serializerService.serializePackages(pkg);
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

  async query(req, res) {
    try {
      this.validateQuery(packageQuerySchema, req.query);
      const {limit, offset} = req.query;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const {count, rows} = await dataService.queryPackages(req.query);
      //TODO: add the cargosRecord
      const output = serializerService.serializePackages(rows, []);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.status(200).json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }


  }
}

module.exports = PackagesController;
