const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { listManifestQuerySchema, createManifestBodySchema, manifestParamSchema, updateManifestBodySchema } = require('../validateSchemas/manifestSchemas');
const {paginateResult} = require("../helper/utils");

class ManifestsController extends BaseController {
  constructor() {
    super();
  }

  async list(req, res) {
    try {
      this.validateQuery(listManifestQuerySchema, req.query);
      const options = req.query;
      const { limit, offset } = options;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const [count, manifests] = await dataService.listManifests(options);
      const output = serializerService.serializeManifests(manifests);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async get(req, res) {
    try {
      this.validateParam(manifestParamSchema, req.params);
      const { manifestId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const manifest = await dataService.getManifestById(manifestId);
      const output = serializerService.serializeManifest(manifest);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async post(req, res) {
    try {
      this.validateBody(createManifestBodySchema, req.body);

      const payload = req.body;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const manifest = await dataService.createManifest(payload);
      const output = serializerService.serializeManifest(manifest);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async patch(req, res) {
    try {
      this.validateParam(manifestParamSchema, req.params);
      this.validateBody(updateManifestBodySchema, req.body);
      const payload = req.body;
      const { manifestId } = req.params;

      const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.updateManifest(manifestId, payload);
      if (result) res.status(200).end();
      else res.status(404).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async delete(req, res) {
    try {
      this.validateParam(manifestParamSchema, req.params);
      const { manifestId } = req.params;
      const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.deleteManifest(manifestId);
      if (result) res.status(204).end();
      else res.status(404).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = ManifestsController;
