const BaseController = require('./baseController');
const {postFeedBackPayloadSchema} = require("../validateSchemas/adminSchemas");
const serviceFactory = require("../services/serviceFactory");
const _ = require("lodash");
const {paginateResult} = require("../helper/utils");
const {paginationSchema} = require("../validateSchemas/baseSchemas");

class AdminController extends BaseController {
  constructor() {
    super();
  }

  async getFeedback(req, res) {
    try {
      this.validateQuery(paginationSchema, req.query);
      const { limit, offset } = req.query;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const {count, rows} = await dataService.listFeedback(limit, offset);
      const output = serializerService.serializeCargos(rows, packageMap);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async postFeedback(req, res) {
    try {
      this.validateBody(postFeedBackPayloadSchema, req.body);
      const {phone, problem, idea} = req.body;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const result = await dataService.addFeedback(phone, problem, idea);
      const output = serializerService.serializeFeedback(result);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = AdminController;
