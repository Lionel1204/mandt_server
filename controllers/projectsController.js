const _ = require('lodash');
const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
const { createProjectSchema, projectPathSchema, updateProjectSchema } = require('../validateSchemas/projectSchemas');
const { paginationSchema } = require('../validateSchemas/baseSchemas');

class ProjectsController extends BaseController {
  constructor() {
    super();
  }

  // TODO add pagination
  async list(req, res) {
    try {
      this.validateQuery(paginationSchema, req.query);
      const { limit, offset } = req.query;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const [count, projects] = await dataService.listProjects({ limit, offset });
      const userIds = _.map(projects, (p) => p.owner);
      const companyIds = _.map(projects, (p) => p.receiver);

      const users = await dataService.getUsersByIds(_.uniq(userIds));
      const companies = await dataService.getComaniesByIds(_.uniq(companyIds));

      const output = serializerService.serializeProjects(projects, users, companies);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.json(paginationOut);
    } catch (ex) {
      this.errorResponse(ex);
    }
  }

  async get(req, res) {
    try {
      this.validateParam(projectPathSchema, req.params);
      const { projectId } = req.params;

      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const options = {
        withUsers: true
      };

      const project = await dataService.getProjectById(projectId, options);
      const user = await dataService.getUser(project.owner);
      const company = await dataService.getCompany(project.receiver)

      const output = serializerService.serializeProject(project, user, company);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async post(req, res) {
    try {
      this.validateBody(createProjectSchema, req.body);

      const payload = {
        name: req.body.name,
        owner: req.body.ownerId,
        receiver: req.body.receiverId,
        status: req.body.status,
        hidden: false,
        endedAt: null
      };
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');

      const project = await dataService.createProject(payload);
      const user = await dataService.getUser(project.owner);
      const company = await dataService.getCompany(project.receiver)
      const output = serializerService.serializeProject(project, user, company);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async patch(req, res) {
    try {
      this.validateParam(projectPathSchema, req.params);
      this.validateBody(updateProjectSchema, req.body);
      const { projectId } = req.params;
      const payload = req.body;

      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');

      const newPrj = await dataService.updateProject(projectId, payload);
      const user = await dataService.getUser(newPrj.owner);
      const company = await dataService.getCompany(newPrj.receiver)

      const output = serializerService.serializeProject(newPrj, user, company);
      res.status(200).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async delete(req, res) {
    try {
      this.validateParam(projectPathSchema, req.params);
      const { projectId } = req.params;
      const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');

      await dataService.deleteProject(projectId);
      this.logger.info(`Project ${projectId} has been deleted`);
      res.status(204).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async listProjectUsers(req, res) {
    try {
      const { projectId } = req.params;
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const projectUsers = await dataService.listProjectUsers(projectId);
      res.json(projectUsers[projectId]);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async addProjectUsers(req, res) {
    try {
      const { projectId, userId } = req.params;
      const payload = req.body;
      const dataService = await serviceFactory.getService('DataService');
      const result = await dataService.addProjectUser(projectId, userId, payload);
      res.status(201).json(result);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }
}

module.exports = ProjectsController;
