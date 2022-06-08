const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require("../helper/utils");
const _ = require('lodash');

class CompaniesController extends BaseController {
  constructor() {
    super();
  }

  async list(res,req) {

  }
}

module.exports = CompaniesController;
