const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const {paginateResult} = require("../helper/utils");
const shortid = require('shortid');
const {createUserSchema} = require('../validateSchemas/userSchemas');

class UsersController extends BaseController {
  constructor() {
    super();
  }

  async get(req, res) {
    try {
      const { userId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const user = await dataService.getUser(userId);
      const output = serializerService.serializeUser(user);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async post(req, res) {
    try {
      this.validateBody(createUserSchema, req.body);
      const payload = {
        name: req.body.name,
        title: req.body.title,
        identity: req.body.identity,
        phone: req.body.phone,
        email: req.body.email,
        companyId: req.body.companyId
      };
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const user = await dataService.createUser(payload);
      const password = req.body.password || shortid.generate();
      await dataService.setLogin(user.phone, password);
      const output = serializerService.serializeUser(user, password);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async list(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const company = parseInt(req.query.company);
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');

      const options = {
        limit,
        offset
      }
      if (company) options.company = company;
      const [count, users] = await dataService.listUsers(options);
      const output = serializerService.serializeUsers(users);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.json(paginationOut);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = UsersController;
