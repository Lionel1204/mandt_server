const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const _ = require('lodash');
const { createCompanyBodySchema, listCompaniesQuerySchema } = require('../validateSchemas/companySchemas');

class CompaniesController extends BaseController {
  constructor() {
    super();
  }

  async list(req, res) {
    try {
      this.validateBody(listCompaniesQuerySchema, req.query);
      const options = req.query;
      const { limit, offset } = options;

      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const [count, companies] = await dataService.listCompanies(options);
      const contactIds = _.map(companies, (c) => c.contactId);
      const contactList = await dataService.getUsersByIds(contactIds);
      const contactMap = _.keyBy(contactList, 'id');
      const output = serializerService.serializeCompanies(companies, contactMap);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async post(req, res) {
    try {
      this.validateBody(createCompanyBodySchema, req.body);

      const payload = req.body;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const [company, user] = await dataService.createCompany(payload);
      const output = serializerService.serializeCompany(company, user);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = CompaniesController;
