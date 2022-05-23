const _ = require('lodash');
const { ProjectStatus } = require("../helper/constants");

class DataService {
    constructor(dbService) {
        this.dbService = dbService;
    }

    initialize() {
        return Promise.resolve();
    }

    // ---------- Project
    async listProjects(options) {
        return await this.dbService.getProjects(options);
    }

    async getProjectById(projectId) {
        const id = parseInt(projectId);
        return await this.dbService.getProjectById(id)
    }

    async createProject(payload) {
        const project = {
          name: payload.name,
          owner: payload.owner,
          receiver: payload.receiver,
          status: payload.status,
          hidden: payload.hidden,
          ended_at: payload?.endedAt
        };

        return await this.dbService.createProject(project);
    }

    async updateProject(projectId, payload) {
        let project = _.omitBy(payload, _.isUndefined);
        const id = parseInt(projectId);
        project.ended_at = payload?.endedAt || null;
        if (payload?.status === ProjectStatus.Completed || payload?.status === ProjectStatus.Void) {
            project.ended_at = new Date()
        }
        return await this.dbService.updateProject(id, project);
    }

    async deleteProject(projectId) {
        const id = parseInt(projectId);
        return await this.dbService.deleteProject(id);
    }

    // ---------- Project User
    async listProjectUsers(projectIds) {
        const ids = _.map(projectIds, parseInt);
        const projectUsers = await this.dbService.listProjectUsers(ids);
        const puMap = {};
        _.map(projectUsers, (pu) => {
            if (!_.get(puMap, pu.project_id)) puMap[pu.project_id] = [];
            puMap[pu.project_id].push({
                id: pu.id,
                userId: pu.user_id,
                projectId: pu.project_id,
                projectRole: pu.project_role,
                userName: pu.user.name,
                userTitle: pu.user.title,
                identity: pu.user.id_card,
                phone: pu.user.phone,
                email: pu.user.email
            });
        });
        return puMap;
    }

    async addProjectUser(projectId, userId, data) {
        const payload = {
            user_id: parseInt(userId),
            project_id: parseInt(projectId),
            project_role: data?.projectRole
        }
        return await this.dbService.addProjectUser(payload);
    }

    // ---------- User:
    async getUsers(userIds) {
        const ids = userIds.map((userId) => parseInt(userId));
        return await this.dbService.getUserByIds(ids);
    }

    async getUser(userId) {
        const id = parseInt(userId);
        return await this.dbService.getUserById(id);
    }

    async createUser(payload) {
        const user = {
            name: payload.name,
            title: payload.title,
            id_card: payload.identity,
            phone: payload.phone,
            email: payload.email
        };
        return await this.dbService.createUser(user);
    }

    // ---------- Manifest:

 }

module.exports = DataService;

