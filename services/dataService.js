const _ = require('lodash');
const { ProjectStatus, ManifestStatus } = require('../helper/constants');
const { ResourceNotExistException, InternalServerException } = require('../exceptions/commonExceptions');

class DataService {
  constructor(dbService) {
    this.dbService = dbService;
  }

  initialize() {
    return Promise.resolve();
  }

  // ---------- Project
  async listProjects(options) {
    return this.dbService.getProjects(options);
  }

  async getProjectById(projectId) {
    const project = await this.dbService.getProjectById(projectId);
    if (!project) throw new ResourceNotExistException('Cannot find project');
    return project;
  }

  async getProjectsByIds(projectIds) {
    const projects = await this.dbService.getProjectsByIds(projectIds);
    return projects;
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

    const result = await this.dbService.createProject(project);
    if (!result) throw new InternalServerException('Cannot create project');
    return result;
  }

  async updateProject(projectId, payload) {
    let project = _.omitBy(payload, _.isUndefined);
    const id = parseInt(projectId);
    project.ended_at = payload?.endedAt || null;
    if (payload?.status === ProjectStatus.Completed || payload?.status === ProjectStatus.Void) {
      project.ended_at = new Date();
    }
    // TODO: use ajv to validate instead
    if (payload?.receiverId) project.receiver = payload.receiverId;
    if (payload?.ownerId) project.owner = payload.ownerId;

    const result = await this.dbService.updateProject(id, project);
    if (!result) throw new ResourceNotExistException('Cannot find project');
    return result;
  }

  async deleteProject(projectId) {
    const id = parseInt(projectId);
    const result = await this.dbService.deleteProject(id);
    if (!result) throw new ResourceNotExistException('Cannot find project');
    return result;
  }

  // ---------- Project User
  async listProjectUsers(projectIds) {
    if (projectIds.length === 0) return [];
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
    };
    return await this.dbService.addProjectUser(payload);
  }

  // ---------- User:
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

  async listUsers(options) {
    return await this.dbService.getUsers(options);
  }

  // ---------- Manifest:
  async listManifests(options) {
    return this.dbService.getManifests(options);
  }

  async createManifest(payload) {
    const manifest = {
      project_id: payload?.projectId,
      note_no: payload.noteNo,
      package_amount: 0,
      cargo_amount: 0,
      creator: payload.creator,
      receiver: payload?.receiver,
      status: ManifestStatus.Created,
      ended_at: null,
      published_at: null,
    }
    return await this.dbService.createManifest(manifest);
  }

  async updateManifest(manifestId, payload) {
    let publishedAt = undefined;
    let endedAt = undefined;

    if (payload?.status === ManifestStatus.Published) {
      publishedAt = new Date();
    } else if (payload?.status === ManifestStatus.Ended) {
      endedAt = new Date();
    }

    const manifest = _.omit({
      project_id: payload?.projectId,
      note_no: payload?.note_no,
      creator: payload.creator,
      receiver: payload?.receiver,
      status: payload?.status,
      ended_at: endedAt,
      published_at: publishedAt,
    });

    // TODO: do not allow change status ended -> published or ended -> created or published -> created

    return this.dbService.updateManifest(manifestId, manifest)
  }

  async getManifestById(manifestId) {
    return this.dbService.getManifestById(manifestId);
  }

  async deleteManifest(manifestId) {
    return this.dbService.deleteManifest(manifestId);
  }
}

module.exports = DataService;
