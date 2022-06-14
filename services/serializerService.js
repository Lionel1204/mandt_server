const _ = require('lodash');

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

  serializePackage(pkg, cargosAmount = 0, paths = {}) {
    const output = {
      id: pkg.id,
      manifestId: pkg.manifest_id,
      packageNo: pkg.package_no,
      wrappingType: pkg.wrapping_type,
      shippingType: pkg.shipping_type,
      size: pkg.size,
      weight: pkg.weight,
      status: pkg.status,
      amount: cargosAmount,
      creator: pkg.creator,
      paths
    };
    return output;
  }

  serializePackages() {

  }
}
module.exports = SerializerService;
