const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const _ = require('lodash');
const { manifestPathSchema } = require('../validateSchemas/baseSchemas');
const { createPathBodySchema, listPathQuerySchema, updatePathBodySchema} = require('../validateSchemas/pathSchemas');

class PathsController extends BaseController {
  constructor() {
    super();
  }

  async post(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateBody(createPathBodySchema, req.body);

      const payload = req.body;
      const { manifestId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const paths = await dataService.createPaths(manifestId, payload);
      const output = serializerService.serializePaths(paths);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async get(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      const { manifestId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const paths = await dataService.getPaths(manifestId);
      const output = serializerService.serializePaths(paths);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async patch(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateBody(updatePathBodySchema, req.body);

      const payload = req.body;
      const { manifestId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.updatePathsArrived(manifestId, payload);
      if (result) res.status(200).end();
      else res.status(404).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = PathsController;
