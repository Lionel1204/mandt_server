const db = require('../database/models');

class DBService {
  constructor() {}
  initialize() {
    return Promise.resolve();
  }

  //----- Projects:
  async getProjects(opt) {
    const options = {
      order: [[db.sequelize.fn('lower', db.sequelize.col('createdAt')), 'DESC']],
      limit: opt.limit,
      offset: opt.offset
    };
    const result = await db.projects.findAndCountAll(options);

    return [result.count, result.rows];
  }

  async getProjectById(projectId) {
    return db.projects.findByPk(projectId);
  }

  async getProjectsByIds(projectIds) {
    const where = { id: projectIds };
    return db.projects.findAll({where});
  }

  async createProject(project) {
    return db.projects.create(project);
  }

  async updateProject(projectId, project) {
    delete project.id;
    const where = { id: projectId };
    const result = await db.projects.update(project, {
      where
    });
    return result[0] > 0;
  }

  async deleteProject(projectId) {
    const result = await db.projects.destroy({ where: { id: projectId } });
    return result > 0;
  }

  async listProjectUsers(projectIds) {
    db.users.hasMany(db.project_users, { foreignKey: 'user_id' });
    db.project_users.belongsTo(db.users, { foreignKey: 'user_id' });

    const where = {
      project_id: projectIds,
      include: [
        {
          model: db.users,
          required: true
        }
      ]
    };
    return await db.project_users.findAll(where);
  }

  async addProjectUser(projectUser) {
    return db.project_users.create(projectUser);
  }

  //----- Users:
  async getUsersByIds(userIds) {
    const where = {
      id: userIds
    };
    return await db.users.findAll(where);
  }

  async getUserByIdCard(idCard) {
    const where = { id_card: idCard };
    return db.users.findOne({where});
  }

  async getUserById(userId) {
    return db.users.findByPk(userId);
  }

  async createUser(user) {
    return db.users.create(user);
  }

  async getUsers(opt) {
    const options = {
      order: [[db.sequelize.fn('lower', db.sequelize.col('createdAt')), 'DESC']],
      limit: opt.limit,
      offset: opt.offset
    };
    if (opt.company) options.where = { company_id: opt.company };
    const result = await db.users.findAndCountAll(options);

    return [result.count, result.rows];
  }

  //----- Manifest-Notes:
  async getManifests(opt) {
    const options = {
      order: [[db.sequelize.fn('lower', db.sequelize.col('createdAt')), 'DESC']],
      limit: opt.limit,
      offset: opt.offset
    };

    if (opt.owner) options.owner = opt.owner;
    if (opt.receiver) options.receiver = opt.receiver;
    if (opt.status) options.status = opt.status;

    const result = await db.manifest_notes.findAndCountAll(options);

    return [result.count, result.rows];
  }

  async createManifest(manifest) {
    return db.manifest_notes.create(manifest);
  }

  async updateManifest(manifestId, data) {
    delete data.id;
    const where = { id: manifestId };
    const result = await db.manifest_notes.update(data, {
      where
    });
    return result[0] > 0;
  }

  async getManifestById(manifestId) {
    return db.manifest_notes.findByPk(manifestId);
  }

  async deleteManifest(manifestId) {
    const result = await db.manifest_notes.destroy({ where: { id: manifestId } });
    return result > 0;
  }

  //----- Companies
  async createCompany(company) {
    return db.companies.create(company);
  }

  async getCompanies(opt) {
    const options = {
      order: [[db.sequelize.fn('lower', db.sequelize.col('createdAt')), 'DESC']],
      limit: opt.limit,
      offset: opt.offset
    };

    if (opt.owner) options.type = opt.type;
    if (opt.receiver) options.scope = opt.scope;

    const result = await db.companies.findAndCountAll(options);

    return [result.count, result.rows];
  }

  //----- Packages
  async createPackage(payload) {
    return db.packages.create(payload);
  }

  //----- Cargos

  //----- Shipping paths:
}
module.exports = DBService;
