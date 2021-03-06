const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {
  createCargoBodySchema,
  listCargoQuerySchema,
  queryCargoSchema
} = require('../validateSchemas/cargoSchemas');
const { manifestPathSchema } = require('../validateSchemas/baseSchemas');
const {packageQuerySchema} = require("../validateSchemas/packageSchemas");

class CargosController extends BaseController {
  constructor() {
    super();
  }

  async post(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params)
      this.validateBody(createCargoBodySchema, req.body);

      const payload = req.body;
      const { manifestId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const cargo = await dataService.createCargo(manifestId, payload);
      const output = serializerService.serializeCargo(cargo);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async list(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateQuery(listCargoQuerySchema, req.query);
      const options = req.query;
      const { limit, offset } = options;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const {count, rows} = await dataService.listCargos(options);
      const packageIds = _.uniq(_.map(rows, (r) => r.package_id));
      const packages = await dataService.getPackagesByIds(packageIds);
      const packageMap = _.keyBy(packages, 'id');
      const output = serializerService.serializeCargos(rows, packageMap);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async get(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params)

      const { manifestId, cargoId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const cargo = await dataService.getCargo(manifestId, cargoId);
      const packageIds = [cargo.package_id];
      const packages = await dataService.getPackagesByIds(packageIds);
      const packageMap = _.keyBy(packages, 'id');
      const output = serializerService.serializeCargo(cargo, packageMap);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async delete(req,res) {
    try {
      this.validateParam(manifestPathSchema, req.params)

      const { manifestId, cargoId } = req.params;
      const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.deleteCargo(manifestId, cargoId);
      this.logger.info(`Cargo ${cargoId} has been deleted`);
      if (result) res.status(204).end();
      else res.status(404).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async query(req, res) {
    try {
      this.validateQuery(queryCargoSchema, req.query);
      const { limit, offset } = req.query;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const { count, rows } = await dataService.queryCargos(req.query);
      const packageIds = _.uniq(_.map(rows, (r) => r.package_id));
      const packages = await dataService.getPackagesByIds(packageIds);
      const packageMap = _.keyBy(packages, 'id');
      const output = serializerService.serializeCargos(rows, packageMap);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.status(200).json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = CargosController;
