const _ = require('lodash');
const {ResourceNotExistException} = require("../exceptions/commonExceptions");

class SerializerService {
  constructor() {}

  initialize() {
    return Promise.resolve();
  }

  /**
   * {
   *   "name": "testprj1",
   *   "ownerId": 2,
   *   "receiverId": 3,
   *   "status": "ACTIVE"
   * }
   * @param data
   * @returns {*}
   */
  serializeProject(project, users) {
    if (!project) throw new ResourceNotExistException('Project does not exist')

    const uniqUsers = _.keyBy(_.uniq(users), 'userId');

    const output = {
      id: project.id,
      name: project.name,
      ownerId: project.owner,
      receiverId: project.receiver,
      owner: uniqUsers[project.owner]?.userName,
      receiver: uniqUsers[project.receiver]?.userName,
      status: project.status,
      hidden: project.hidden,
      endedAt: project.ended_at,
      createdAt: project.createdAt
    };
    return output;
  }

  serializeProjects(projects, projectUsersMap = []) {
    if (!Array.isArray(projects) || projects.length === 0) return [];

    const output = _.map(projects, (project) => {
      const users = projectUsersMap[project.id];
      return this.serializeProject(project, users);
    });
    return output;
  }

  /**
   * {
   *   "name": "Kevin Wang",
   *   "title": "CEO",
   *   "id_card": "34567891012",
   *   "phone": "18654652911",
   *   "email": "kevin@163.com",
   *   "createdAt": "2022-05-01T07:53:10.000Z",
   *   "updatedAt": "2022-05-01T07:53:10.000Z"
   * }
   * @param data
   * @returns {*}
   */
  serializeUser(data) {
    if (!data) throw new ResourceNotExistException('User does not exist')

    const output = {
      id: data.id,
      name: data.name,
      title: data.title,
      identity: data.id_card,
      phone: data.phone,
      email: data.email
    };
    return output;
  }

  serializeUsers(users) {
    if (!Array.isArray(users) || users.length === 0) return [];
    return _.map(users, this.serializeUser)
  }

  serializeManifest(data, project) {
    if (!data) throw new ResourceNotExistException('Manifest does not exist')
    const output = {
      id: data.id,
      noteNo: data.note_no,
      creator: data.creator,
      receiver: data.receiver,
      amount: data.package_amount,
      cargoAmount: data.cargo_amount,
      status: data.status,
      projectId: data.project_id,
      projectName: project?.name || null,
      endedAt: data.ended_at,
      publishedAt: data.published_at,
      createdAt: data.createdAt
    };
    return output;
  }

  serializeManifests(manifests, projectsMap) {
    if (!Array.isArray(manifests) || manifests.length === 0) return [];

    const output = _.map(manifests, (m) => {
      let project = null;
      if (m.project_id)
        project = projectsMap[m.project_id];
      return this.serializeManifest(m, project);
    });
    return output;
  }

  serializeCompany(company, user) {
    if (!company) throw new ResourceNotExistException('Company does not exist')

    const output = {
      id: company.id,
      name: company.name,
      type: company.type,
      scope: company.scope,
      license: company.license,
      capability: company.capability,
      transport: company.transport,
      contactInfo: {
        id: user?.id,
        name: user?.name,
        title: user?.title,
        identity: user?.id_card,
        phone: user?.phone,
        email: user?.email
      }
    };
    return output;
  }

  serializeCompanies(companies, usersMap) {
    if (!Array.isArray(companies) || companies.length === 0) return [];

    const output = _.map(companies, (c) => {
      let company = null;
      if (c.contact) company = this.serializeCompany(c, usersMap[c.contact]);
      else company = this.serializeCompany(c, null);
      return company;
    });
    return output;
  }

  serializePackage(pkg, paths = {}) {
    if (!pkg) throw new ResourceNotExistException('Package does not exist')
    const output = {
      id: pkg.id,
      manifestId: pkg.manifest_id,
      packageNo: pkg.package_no,
      wrappingType: pkg.wrapping_type,
      shippingType: pkg.shipping_type,
      size: pkg.size,
      weight: pkg.weight,
      status: pkg.status,
      amount: pkg.amount,
      creator: pkg.creator,
      paths,
      createAt: pkg.createdAt
    };
    return output;
  }

  serializePackages(packages) {
    if (!Array.isArray(packages) || packages.length === 0) return [];
    return _.map(packages, (p) => {
      return this.serializePackage(p)
    });
  }

  serializeCargo(cargo, packageMap = {} ) {
    if (!cargo) throw new ResourceNotExistException('Cargo does not exist')
    const pkg = _.get(packageMap, cargo.package_id);
    const output = _.omit({
      id: cargo.id,
      manifestId: cargo.manifest_id,
      packageId: cargo.package_id,
      packageNo: pkg?.package_no || undefined,
      name: cargo.name,
      creator: cargo.creator,
      amount: cargo.amount,
      model: cargo.model,
      createdAt: cargo.createdAt
    }, _.isUndefined);
    return output;
  }

  serializeCargos(cargos, packageMap) {
    if (!Array.isArray(cargos) || cargos.length === 0) return [];
    return _.map(cargos, (c) => {
      return this.serializeCargo(c, packageMap)
    });
  }

  serializePath(path) {
    if (!path) throw new ResourceNotExistException('Path does not exist')

    const output = {
      id: path.id,
      manifestId: path.manifest_id,
      waybillNo: path.waybill_no,
      packageId: path.package_id,
      address: path.address,
      assignee: path.assignee,
      arrived: !!path.arrived,
      type: path.type
    }
    return output;
  }

  serializePaths(paths) {
    if (!Array.isArray(paths) || paths.length === 0) return [];

    return _.map(paths, (p) => {
      return this.serializePath(p)
    });
  }
}
module.exports = SerializerService;
