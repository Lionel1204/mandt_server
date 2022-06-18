const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {
  createCargoBodySchema,
  listCargoQuerySchema
} = require('../validateSchemas/cargoSchemas');
const { paginationSchema, manifestPathSchema } = require('../validateSchemas/baseSchemas');
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
      this.validateQuery(listCargoQuerySchema, req.query);
      const options = req.query;
      const { limit, offset } = options;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const {count, rows} = await dataService.listCargos(options);

      const output = serializerService.serializeCargos(rows);
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
      const output = serializerService.serializeCargo(cargo);
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
      if (result) res.status(204).end();
      else res.status(404).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async query(req, res) {
    try {
      this.validateQuery(packageQuerySchema, req.query);
      const { limit, offset } = req.query;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const { count, rows } = await dataService.queryCargos(req.query);
      const output = serializerService.serializeCargos(rows);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.status(200).json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = CargosController;
