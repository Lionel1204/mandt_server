const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const _ = require('lodash');
const { manifestPathSchema } = require('../validateSchemas/baseSchemas');
const { createPathBodySchema, updatePathBodySchema} = require('../validateSchemas/pathSchemas');

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

  async put(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateBody(updatePathBodySchema, req.body);

      const payload = req.body;
      const { manifestId, pathId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const paths = await dataService.updatePaths(manifestId, pathId, payload);
      if (paths) {
        const output = serializerService.serializePaths(paths);
        res.json(output);
      } else {
        res.status(200).end();
      }
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = PathsController;
