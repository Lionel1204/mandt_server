const _ = require('lodash');
const { ProjectStatus, ManifestStatus, PackageStatus, PathType } = require('../helper/constants');
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

  async getUsersByIds(ids) {
    return await this.dbService.getUsersByIds(ids);
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

  // ---------- Company
  async createCompany(payload) {
    let contactId = payload.contactId;
    let contact = null;
    if (!contactId) {
      // Create a contact of company at first
      try {
        contact = await this.createUser(payload.contactInfo);
        contactId = contact.id;
      } catch (ex) {
        if (ex.name === 'SequelizeUniqueConstraintError') {
          contact = await this.dbService.getUserByIdCard(payload.contactInfo.identity);
          contactId = contact.id;
        }
      }
    } else {
      contact = await this.dbService.getUser(payload.contactId);
    }

    const company = {
      name: payload.name,
      type: payload.type,
      license: payload.license,
      contact: contactId,
      capability: payload.capability,
      scope: payload.scope,
      transport: payload.transport
    }
    const result = await this.dbService.createCompany(company);
    return [result, contact]
  }

  async listCompanies(options) {
    return this.dbService.getCompanies(options);
  }

  // ---------- Package
  async createPackage(manifestId, payload) {
    const packagePayload = {
      manifest_id: manifestId,
      package_no: payload.packageNo,
      wrapping_type: payload.wrappingType,
      shipping_type: payload.shippingType,
      amount: 0, //TODO: wait for get cargo
      size: payload.size,
      weight: payload.weight,
      status: PackageStatus.Created,
      creator: payload.creator
    }
    return await this.dbService.createPackage(packagePayload);
  }

  async getPackage(manifestId, packageId) {
    return await this.dbService.getPackage(packageId);
  }

  async getPackagesByIds(packageIds) {
    return await this.dbService.getPackagesByIds(packageIds);
  }

  async updatePackage(manifestId, packageId, payload) {
    const updatePackagePayload = {
      package_no: payload.packageNo,
      wrapping_type: payload.wrappingType,
      shipping_type: payload.shippingType,
      size: payload.size,
      weight: payload.weight,
      status: payload.status
    };
    return await this.dbService.updatePackage(manifestId, packageId, updatePackagePayload);
  }

  async updatePackageCargoAmount(manifestId, packageId, amount, add = true) {
    const pkg = await this.dbService.getPackage(manifestId, packageId);
    const result = add ? pkg.amount + amount : Math.max(pkg.amount - amount, 0)
    const updatePackagePayload = {
      amount: result
    };
    return await this.dbService.updatePackage(manifestId, packageId, updatePackagePayload);
  }

  async deletePackage(manifestId, packageId) {
    return await this.dbService.deletePackage(packageId);
  }

  async queryPackages(query) {
    const { creator, status, manifestId, limit, offset} = query;
    const options = {
      creator,
      status,
      manifest_id: manifestId === -1 ? null : manifestId,
      limit,
      offset
    }

    return await this.dbService.getPackages(options);
  }

  // ---------- Cargo
  async createCargo(manifestId, payload) {
    const pkg = await this.getPackage(manifestId, payload.packageId);
    if (!pkg) throw new ResourceNotExistException(`Cannot find package ${payload.packageId}`);

    const cargo = {
      name: payload.name,
      model: payload.model,
      amount: payload.amount,
      package_id: payload.packageId,
      manifest_id: manifestId,
      creator: payload.creator
    };

    const result = await this.dbService.createCargo(cargo);

    if (result?.package_id) {
      await this.updatePackageCargoAmount(manifestId, result.package_id, result.amount, true);
    }
    return result;
  }

  async getCargo(manifestId, cargoId) {
    return this.dbService.getCargo(cargoId);
  }

  async listCargos(options) {
    return this.dbService.listCargos(options);
  }

  async queryCargos(options) {
    return this.listCargos(options);
  }

  async deleteCargo(manifestId, cargoId) {
    const cargo = await this.getCargo(manifestId, cargoId);
    if (!cargo) throw new ResourceNotExistException(`Cannot find cargo ${cargoId}`);
    const pkg = await this.getPackage(manifestId, cargo.package_id);
    if (!pkg) throw new ResourceNotExistException(`Cannot find package ${cargo.package_id}`);
    const result = await this.dbService.deleteCargo(cargoId);

    if (result && cargo.package_id) {
      await this.updatePackageCargoAmount(manifestId, cargo.package_id, cargo.amount, false);
    }
    return result;
  }

  // ------ Paths
  async createPaths(manifestId, payload) {
    const paths = _.map(payload.pathList, (p, ind)=> {
      return {
        manifest_id: manifestId,
        package_id: payload.packageId,
        address: p.address,
        assignee: p.assignee,
        waybill_no: p.waybillNo,
        arrived: p.arrived,
        type: p.type,
        sequence_no: ind
      };
    });

    return this.dbService.createPaths(paths);
  }

  async listPaths(manifestId, packageId) {
    const options = {
      manifest_id: manifestId,
      package_id: packageId,
      limit: 50,
      offset: 0
    };
    return await this.dbService.listPaths(options)
  }

  async updatePathsArrived(manifestId, payload) {
    const {packageId, pathIdList, arrived} = payload;

    const result = await this.dbService.updatePathsArrived(manifestId, packageId, pathIdList, arrived);

    // update the package status
    const paths = await this.listPaths(manifestId, packageId);
    const finishedEndNode = _.find(paths, (p) => (p.type === PathType.End) && p.arrived);
    const finishedMidNode = _.find(paths, (p) => (p.type === PathType.Middle) && p.arrived);

    if (finishedEndNode) {
      // Finished
      await this.updatePackage(manifestId, packageId, { status: PackageStatus.Finished });
    } else if (finishedMidNode) {
      // InTransit
      await this.updatePackage(manifestId, packageId, { status: PackageStatus.InTransit });
    } else {}

    return result;
  }
}

module.exports = DataService;
