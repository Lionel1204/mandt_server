const _ = require('lodash');
const shortid = require("shortid");
const { ProjectStatus, ManifestStatus, PackageStatus, PathType } = require('../helper/constants');
const { ResourceNotExistException, InternalServerException, NotAllowedException } = require('../exceptions/commonExceptions');

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
    return await this.dbService.getUserById(userId);
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
    const opt = _.omitBy({
      owner: options.owner,
      receiver: options.receiver,
      status: options.status,
      note_no: options.noteNo
    }, _.isUndefined);
    return this.dbService.getManifests(opt, options.limit, options.offset);
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
    let createShippingFlag = payload?.status === ManifestStatus.Shipping;

    if (payload?.status === ManifestStatus.Published) {
      publishedAt = new Date();
    } else if (payload?.status === ManifestStatus.Ended) {
      endedAt = new Date();
    }

    const manifest = _.omitBy({
      project_id: payload?.projectId,
      note_no: payload?.note_no,
      creator: payload.creator,
      receiver: payload?.receiver,
      status: payload?.status,
      ended_at: endedAt,
      published_at: publishedAt,
    }, _.isUndefined);

    // TODO: do not allow change status ended -> published or ended -> created or published -> created

    const result = await this.dbService.updateManifest(manifestId, manifest)
    if (createShippingFlag && result) {
      // Manifest is ready, start to create shipping record
      await this.createArrivedInfo(manifestId)
    }
    return result
  }

  async updateManifestAmount(manifestId) {
    const packageCount = await this.dbService.countPackages(manifestId)
    const cargoCount = await this.dbService.countCargos(manifestId)

    const payload = {
      package_amount: packageCount,
      cargo_amount: cargoCount
    }
    return this.dbService.updateManifest(manifestId, payload);
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
    const _pkgNo = shortid.generate();
    _pkgNo.replace("_", "Z").replace("-", "z");
    const packagePayload = {
      manifest_id: manifestId,
      package_no: `PKG_${_pkgNo}`,
      wrapping_type: payload.wrappingType,
      shipping_type: payload.shippingType,
      amount: 0,
      size: payload.size,
      weight: payload.weight,
      status: PackageStatus.Created,
      creator: payload.creator
    }
    const newPackage =  await this.dbService.createPackage(packagePayload);

    if (newPackage)
      await this.updateManifestAmount(newPackage.manifest_id);
    return newPackage;
  }

  async getPackage(manifestId, packageId) {
    return await this.dbService.getPackage(packageId);
  }

  async getPackagesByIds(packageIds) {
    return await this.dbService.getPackagesByIds(packageIds);
  }

  async updatePackage(manifestId, packageId, payload) {
    const manifest = await this.getManifestById(manifestId);
    if (manifest.status === ManifestStatus.Shipping) throw new NotAllowedException('Cannot change the Shipping Manifest');

    const updatePackagePayload = {
      wrapping_type: payload.wrappingType,
      shipping_type: payload.shippingType,
      size: payload.size,
      weight: payload.weight,
      status: payload.status
    };
    return await this.dbService.updatePackage(manifestId, packageId, updatePackagePayload);
  }

  async updatePackageCargoAmount(manifestId, packageId, amount, add = true) {
    const pkg = await this.dbService.getPackage(packageId);
    const result = add ? pkg.amount + amount : Math.max(pkg.amount - amount, 0)
    const updatePackagePayload = {
      amount: result
    };
    return await this.dbService.updatePackage(manifestId, packageId, updatePackagePayload);
  }

  async deletePackage(manifestId, packageId) {
    const result = await this.dbService.deletePackage(manifestId, packageId);
    if (result)
      await this.updateManifestAmount(manifestId);
    return result;
  }

  async queryPackages(query) {
    const { creator, status, manifestId, packageNo, limit, offset} = query;
    const options = {
      creator,
      status,
      manifest_id: manifestId,
      package_no: packageNo,
      offset,
      limit
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
      await this.updatePackageCargoAmount(result.manifest_id, result.package_id, result.amount, true);
      await this.updateManifestAmount(result.manifest_id);
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
    const opt = {
      creator: options.creator,
      package_id: options.packageId,
      manifest_id: options.manifestId,
      name: options.name,
      model: options.model,
      limit: options.limit,
      offset: options.offset
    }
    return this.listCargos(opt);
  }

  async deleteCargo(manifestId, cargoId) {
    const cargo = await this.getCargo(manifestId, cargoId);
    if (!cargo) throw new ResourceNotExistException(`Cannot find cargo ${cargoId}`);
    const pkg = await this.getPackage(manifestId, cargo.package_id);
    if (!pkg) throw new ResourceNotExistException(`Cannot find package ${cargo.package_id}`);
    const result = await this.dbService.deleteCargo(manifestId, cargoId);

    if (result && cargo.package_id) {
      await this.updatePackageCargoAmount(manifestId, cargo.package_id, cargo.amount, false);
      await this.updateManifestAmount(manifestId);
    }
    return result;
  }

  // ------ Paths
  async createPaths(manifestId, paths) {
    const payload = {
      manifest_id: manifestId,
      paths
    }
    return this.dbService.createPaths( payload);
  }

  async getPaths(manifestId) {
    const options = {
      manifest_id: manifestId
    };
    return await this.dbService.getPaths(options)
  }

  async updatePaths(manifestId, pathId, paths) {
    const result = this.dbService.updatePaths(pathId, paths);
    return result ? await this.dbService.getPaths({manifest_id: manifestId}) : null;
  }

  // arrived info
  async createArrivedInfo(manifestId) {
    // infinite loading:
    let offset = 0;
    const limit = 50;
    let packages = [];
    while (true) {
      const { count, rows } = await this.queryPackages({ manifestId, offset, limit });
      packages = [...packages, ...rows];
      offset += rows.length;
      if (packages.length >= count) break;
    }

    if (packages.length === 0) return;

    const pathRec = await this.getPaths(manifestId);
    if (!pathRec) return;

    const arrivedInfoList = packages.map((p) => {
      return pathRec.paths.map((path, index) => {
        const payload = {
          manifest_id: manifestId,
          package_id: p.id,
          path_id: pathRec.id,
          way_bill_no: null,
          arrived: index === 0,
          path_node: index,
          assignee: path.assignee,
        };
        return payload;
      });
    });

    for (const arrivedInfo of arrivedInfoList) {
      await this.dbService.bulkCreateArrivedInfo(arrivedInfo);
    }
  }

  async listArrivedInfo(packageId, payload) {
    let assigneeId = payload.assignee;
    if (payload.userId) {
      const user = await this.getUser(payload.userId);
      assigneeId = user.company_id;
    }

    const options = {
      package_id: packageId
    }
    if (assigneeId) options.assignee = assigneeId;
    return this.dbService.listArrivedInfo(options);
  }

  async updateArrivedInfo(packageId, body) {
    const options = {
      package_id: packageId,
      path_node: body.pathNode,
      arrived: !!body.arrived,
      way_bill_no: body.wayBillNo || null
    }
    return this.dbService.updateArrivedInfo(options);
  }

  // -- Login
  async getLogin(phone) {
    return this.dbService.getLogin(phone)
  }
}

module.exports = DataService;
