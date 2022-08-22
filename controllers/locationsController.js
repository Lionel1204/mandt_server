const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const _ = require('lodash');
const {createLocationBodySchema} = require('../validateSchemas/locationSchemas');
const {manifestPathSchema} = require('../validateSchemas/baseSchemas');

class LocationsController extends BaseController {
  constructor() {
    super();
  }

  async post(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      this.validateBody(createLocationBodySchema, req.body);
      const { userId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const {created, location} = await dataService.createUserLocation(userId, req.body);
      const output = serializerService.serializeLocation(location);
      const code = created ? 201 : 200;
      res.status(code).json(output);
    }
    catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async get(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params);
      const { userId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const location = await dataService.getUserLocation(userId, req.body);
      const output = serializerService.serializeLocation(location);
      res.json(output);
    }
    catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = LocationsController;
