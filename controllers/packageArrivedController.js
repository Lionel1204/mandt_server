const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const _ = require('lodash');
const {
  listArrivedInfoQuerySchema,
  updateArrivedInfoBodySchema
} = require('../validateSchemas/packageArrivedSchemas');
const { manifestPathSchema } = require('../validateSchemas/baseSchemas');

class PackageArrivedController extends BaseController {
  constructor() {
    super();
  }

  async list(req, res) {
    this.validateParam(manifestPathSchema, req.params)
    this.validateQuery(listArrivedInfoQuerySchema, req.query);
    const options = req.query;
    const { packageId } = req.params;
    const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
    const records = await dataService.listArrivedInfo(packageId, options);
    const output = serializerService.serializeArriveInfo(records);
    res.json(output);
  }

  async patch(req, res) {
    this.validateParam(manifestPathSchema, req.params)
    this.validateBody(updateArrivedInfoBodySchema, req.body)
    const body = req.body;
    const { packageId } = req.params;
    const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
    const result = await dataService.updateArrivedInfo(packageId, body);
    if (!result) res.status(404).end();
    const output = serializerService.serializeArriveInfoNode(result);
    res.json(output);
  }
}

module.exports = PackageArrivedController;
