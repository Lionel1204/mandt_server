const _ = require('lodash');
const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const { paginateResult } = require('../helper/utils');
class ProjectsController extends BaseController{
    constructor () {
        super();
    }

    // TODO add pagination
    async list(req, res) {
        const limit = req.query.limit || 50;
        const offset = req.query.offset || 0;

        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const [count, projects] = await dataService.listProjects({limit, offset});
        const projectUsers = await dataService.listProjectUsers(projects.map((p) => p.id));
        const output = serializerService.serializeProjects(projects, projectUsers);
        const paginationOut = paginateResult(output, req, limit, offset, count);
        res.json(paginationOut);
    }

    async get(req, res) {
        const { projectId } = req.params;

        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const options = {
            withUsers: true
        };
        const project = await dataService.getProjectById(projectId, options);
        const projectUsers = await dataService.listProjectUsers([project.id]);
        const output = serializerService.serializeProject(project, projectUsers[project.id]);
        res.json(output);
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
        const project = await dataService.createProject(payload);
        const projectUsers = await dataService.listProjectUsers([project.id]);
        const output = serializerService.serializeProject(project, projectUsers[project.id]);
        res.status(201).json(output);
    }

    async patch(req, res) {
        const { projectId } = req.params;
        const payload = req.body;

        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const result = await dataService.updateProject(projectId, payload);
        if (result) res.status(200).end();
        else res.status(404).end();
    }

    async delete(req, res) {
        const { projectId } = req.params;
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const result = await dataService.deleteProject(projectId);
        if (result) res.status(204).end();
        else res.status(404).end();
    }

    async listProjectUsers(req, res) {
        const { projectId } = req.params;
        const [dataService, serializerService]= await serviceFactory.getService('DataService', 'SerializerService');
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

