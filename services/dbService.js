const db = require('../database/models');
const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
    return db.projects.findAll({ where });
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
    return db.users.findOne({ where });
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
  async getManifests(opt, limit, offset) {
    const options = opt;
    const order = [[db.sequelize.fn('lower', db.sequelize.col('createdAt')), 'DESC']];
    if (opt.note_no) options.note_no = { [Op.like]: `%${opt.note_no}%` };
    const where = options;
    return await db.manifest_notes.findAndCountAll({ where, order, limit, offset });
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

  async updatePackage(manifestId, packageId, data) {
    const where = { id: packageId };
    const result = await db.packages.update(data, {
      where
    });
    return result[0] > 0;
  }

  async getPackage(packageId) {
    return db.packages.findByPk(packageId);
  }

  async getPackagesByIds(packageIds) {
    return db.packages.findAll({
      where: { id: packageIds }
    });
  }

  async getPackages(options) {
    const { limit, offset } = options;
    const { creator, status, manifest_id, package_no } = options;
    const where = _.omitBy(
      {
        creator,
        status,
        manifest_id
      },
      _.isUndefined
    );

    if (package_no) where.package_no = { [Op.like]: `%${package_no}%` };
    return db.packages.findAndCountAll({ where, limit, offset });
  }

  async countPackages(manifestId) {
    return db.packages.count({ where: { manifest_id: manifestId } });
  }

  async deletePackage(manifestId, packageId) {
    const result = await db.packages.destroy({ where: { id: packageId, manifest_id: manifestId } });
    return result > 0;
  }

  //----- Cargos
  async countCargos(manifestId) {
    try {
      const result = await db.cargos.findAll({
        attributes: [[db.sequelize.fn('sum', db.sequelize.col('amount')), 'total']],
        where: { manifest_id: manifestId }
      });
      return result[0].total;
    } catch (ex) {
      throw ex;
    }
  }

  async createCargo(payload) {
    return db.cargos.create(payload);
  }

  async getCargo(cargoId) {
    return db.cargos.findByPk(cargoId);
  }

  async listCargos(options) {
    const { limit, offset } = options;
    const { name, model, manifest_id, creator, package_id } = options;
    const where = _.omitBy(
      {
        model,
        manifest_id,
        creator,
        package_id
      },
      _.isUndefined
    );

    if (name) where.name = { [Op.like]: `%${name}%` };
    return db.cargos.findAndCountAll({ where, limit, offset });
  }

  async deleteCargo(manifestId, cargoId) {
    const result = await db.cargos.destroy({ where: { id: cargoId, manifest_id: manifestId } });
    return result > 0;
  }
  //----- Paths:
  async createPaths(payload) {
    return db.paths.create(payload);
  }

  async getPaths(options) {
    const where = {
      manifest_id: options.manifest_id
    };
    return db.paths.findOne({ where });
  }

  async updatePathsArrived(manifestId, packageId, pathIdList, arrived) {
    const where = {
      id: pathIdList
    };

    const result = await db.paths.update(
      { arrived },
      {
        where
      }
    );
    return result > 0;
  }

  // Arrived Info
  async bulkCreateArrivedInfo(records) {
    // TODO: try to use transaction
    await db.package_shippings.bulkCreate(records,{ updateOnDuplicate: ['package_id', 'path_node'] });
  }

  async listArrivedInfo(options) {
    const where = options;
    return await db.package_shippings.findAll({ where });
  }

  async updateArrivedInfo(options) {
    const where = {
      package_id: options.package_id,
      path_node: options.path_node
    };

    const data = {
      arrived: options.arrived,
      way_bill_no: options.way_bill_no
    };
    const result = await db.package_shippings.update(data, {
      where
    });
    return result[0] > 0;
  }

  // Login
  async getLogin(phone) {
    return await db.logins.findOne({ where: {user_phone: phone}});
  }
}
module.exports = DBService;
