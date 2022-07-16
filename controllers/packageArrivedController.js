const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const _ = require('lodash');
const {
  listArrivedInfoQuerySchema,
  updateArrivedInfoBodySchema
} = require('../validateSchemas/packageArrivedSchemas');
const { manifestPathSchema } = require('../validateSchemas/baseSchemas');
const {ResourceNotExistException} = require("../exceptions/commonExceptions");

class PackageArrivedController extends BaseController {
  constructor() {
    super();
  }

  async list(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params)
      this.validateQuery(listArrivedInfoQuerySchema, req.query);
      const options = req.query;
      const { packageId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const pkg = await dataService.getPackagesByIds([packageId]);
      if (pkg.length === 0) throw new ResourceNotExistException(`${packageId} package does not exist`);

      const records = await dataService.listArrivedInfo(packageId, options);

      const manifestId = pkg[0].manifest_id;
      const pathRec = await dataService.getPaths(manifestId);
      const output = serializerService.serializeArriveInfo(records, pathRec.paths);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async patch(req, res) {
    try {
      this.validateParam(manifestPathSchema, req.params)
      this.validateBody(updateArrivedInfoBodySchema, req.body)
      const body = req.body;
      const { packageId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.updateArrivedInfo(packageId, body);
      if (!result) res.status(404).end();
      else {
        const pathRec = await dataService.getPaths(result.manifest_id);
        const output = serializerService.serializeArriveInfoNode(result, 0, [pathRec]);
        res.json(output);
      }
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = PackageArrivedController;
