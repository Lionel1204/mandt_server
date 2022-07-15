const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const {
  createPackageBodySchema,
  packageParamSchema,
  packageQuerySchema,
  updatePackageBodySchema
} = require('../validateSchemas/packageSchemas');
const { paginationSchema } = require('../validateSchemas/baseSchemas');

class PackagesController extends BaseController {
  constructor() {
    super();
  }

  async post(req, res) {
    try {
      this.validateBody(createPackageBodySchema, req.body);
      this.validateParam(packageParamSchema, req.params);
      const { manifestId } = req.params;
      const payload = req.body;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const pkg = await dataService.createPackage(manifestId, payload);
      const manifest = await dataService.getManifestById(manifestId);
      const output = serializerService.serializePackage(pkg, manifest?.status);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async get(req, res) {
    try {
      this.validateParam(packageParamSchema, req.params);
      const { manifestId, packageId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const pkg = await dataService.getPackage(manifestId, packageId);
      const manifest = await dataService.getManifestById(manifestId);
      const output = serializerService.serializePackage(pkg, manifest?.status);
      res.status(200).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async list(req, res) {
    try {
      this.validateParam(packageParamSchema, req.params);
      this.validateQuery(paginationSchema, req.query);
      const options = req.query;
      const { limit, offset } = options;
      const { manifestId } = req.params;
      options.manifestId = manifestId;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const { count, rows } = await dataService.queryPackages(options);
      const manifest = await dataService.getManifestById(manifestId);
      const manifestMap = { [manifest.id]: manifest };
      const output = serializerService.serializePackages(rows, manifestMap);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.status(200).json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async patch(req, res) {
    try {
      this.validateParam(packageParamSchema, req.params);
      this.validateBody(updatePackageBodySchema, req.body);
      const { manifestId, packageId } = req.params;
      const payload = req.body;
      const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.updatePackage(manifestId, packageId, payload);
      if (result) res.status(200).end();
      else res.status(404).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async delete(req, res) {
    try {
      this.validateParam(packageParamSchema, req.params);
      const { manifestId, packageId } = req.params;
      const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.deletePackage(manifestId, packageId);
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
      const { count, rows } = await dataService.queryPackages(req.query);
      const manifestIds = _.map(rows, (r) => r.manifest_id);
      const manifests = await dataService.getManifestsByIds(manifestIds);
      const manifestMap = _.keyBy(manifests, 'id');
      const output = serializerService.serializePackages(rows, manifestMap);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.status(200).json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = PackagesController;
