const _ = require('lodash');
const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');

class ProjectsController extends BaseController {
  constructor() {
    super();
  }

  // TODO add pagination
  async list(req, res) {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    try {
      const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
      const [count, projects] = await dataService.listProjects({ limit, offset });
      const projectUsers = await dataService.listProjectUsers(projects.map((p) => p.id));
      const output = serializerService.serializeProjects(projects, projectUsers);
      const paginationOut = paginateResult(output, req, limit, offset, count);
      res.json(paginationOut);
    } catch (ex) {
      this.errorResponse(ex);
    }
  }

  async get(req, res) {
    const { projectId } = req.params;

    const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
    const options = {
      withUsers: true
    };

    try {
      const project = await dataService.getProjectById(projectId, options);

      const projectUsers = await dataService.listProjectUsers([project.id]);
      const output = serializerService.serializeProject(project, projectUsers[project.id]);
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async post(req, res) {
    const payload = {
      name: req.body.name,
      owner: req.body.ownerId,
      receiver: req.body.receiverId,
      status: req.body.status,
      hidden: false,
      endedAt: null
    };
    const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
    try {
      const project = await dataService.createProject(payload);
      const projectUsers = await dataService.listProjectUsers([project.id]);
      const output = serializerService.serializeProject(project, projectUsers[project.id]);
      res.status(201).json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async patch(req, res) {
    const { projectId } = req.params;
    const payload = req.body;

    const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
    try {
      await dataService.updateProject(projectId, payload);
      res.status(200).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async delete(req, res) {
    const { projectId } = req.params;
    const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
    try {
      const result = await dataService.deleteProject(projectId);
      res.status(204).end();
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async listProjectUsers(req, res) {
    const { projectId } = req.params;
    const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
    const projectUsers = await dataService.listProjectUsers(projectId);
    res.json(projectUsers[projectId]);
  }

  async addProjectUsers(req, res) {
    const { projectId, userId } = req.params;
    const payload = req.body;
    const dataService = await serviceFactory.getService('DataService');
    const result = await dataService.addProjectUser(projectId, userId, payload);
    res.status(201).json(result);
  }
}

module.exports = ProjectsController;
