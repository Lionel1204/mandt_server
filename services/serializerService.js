const _ = require('lodash');
const {ResourceNotExistException} = require('../exceptions/commonExceptions');
const { manifestStartShipping } = require('../helper/utils');
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
  serializeProject(project, user, company) {
    if (!project) throw new ResourceNotExistException('Project does not exist')

    const output = {
      id: project.id,
      name: project.name,
      ownerId: project.owner,
      receiverId: project.receiver,
      owner: user?.name,
      receiver: company.name,
      status: project.status,
      hidden: project.hidden,
      endedAt: project.ended_at,
      createdAt: project.createdAt
    };
    return output;
  }

  serializeProjects(projects, userList, companyList) {
    if (!Array.isArray(projects) || projects.length === 0) return [];
    const userMap = _.keyBy(userList, 'id');
    const companyMap = _.keyBy(companyList, 'id');

    const output = _.map(projects, (project) => {
      const user = userMap[project.owner];
      const company = companyMap[project.receiver];
      return this.serializeProject(project, user, company);
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
  serializeUser(data, password = undefined) {
    if (!data) throw new ResourceNotExistException('User does not exist')

    const output = {
      id: data.id,
      name: data.name,
      title: data.title,
      identity: data.id_card,
      phone: data.phone,
      email: data.email,
      companyId: data.company_id,
      password
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

  calculateArrived(arrivedInfo) {
    return _.findIndex(arrivedInfo, (p) => !p.arrived);
  }

  serializePackage(pkg, manifestStatus = undefined, arrivedInfo = {}) {
    if (!pkg) throw new ResourceNotExistException('Package does not exist');
    const pathInfo = _.get(arrivedInfo, `${pkg.id}`, {});
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
      manifestStatus: manifestStatus,
      createAt: pkg.createdAt,
      pathInfo: pathInfo,
      arrivedNode: this.calculateArrived(pathInfo)
    };
    return output;
  }

  serializePackages(packages, manifestMap = {}, arrivedInfoResult = {}) {
    if (!Array.isArray(packages) || packages.length === 0) return [];

    const {pathsList, arrivedInfoList} = arrivedInfoResult;
    const pathsMap = _.keyBy(pathsList, 'manifest_id');

    // aggregate all of arrivedInfo
    const arrivedInfoMap = _.reduce(arrivedInfoList, (result, ai) => {
      const arrivedInfo = {
        pathNode: ai.path_node,
        wayBillNo: ai.way_bill_no,
        next: ai.next,
        from: pathsMap[ai.manifest_id]?.paths[ai.path_node]?.address,
        arrived: ai.arrived,
        takeOver: ai.take_over,
        assignee: ai.assignee,
        type: pathsMap[ai.manifest_id]?.paths[ai.path_node]?.type
      }

      const pkgMap = _.get(result, `${ai.manifest_id}`, {});
      const info = _.get(pkgMap, `${ai.package_id}`, []);
      pkgMap[ai.package_id] = [...info, arrivedInfo];
      result[ai.manifest_id] = pkgMap;
      return result;
    }, {})

    return _.map(packages, (p) => {
      const manifest = manifestMap[p.manifest_id];
      let arrivedInfo = {};
      if (manifestStartShipping(manifest.status)) arrivedInfo = arrivedInfoMap[p.manifest_id]
      return this.serializePackage(p, manifest?.status, arrivedInfo);
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
      size: cargo.size,
      weight: cargo.weight,
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

  serializePaths(pathRec) {
    if (!pathRec) throw new ResourceNotExistException('Path does not exist')

    const output = {
      id: pathRec.id,
      manifestId: pathRec.manifest_id,
      pathList: pathRec.paths
    }
    return output;
  }

  serializeArriveInfoNode(record, index, pathRec) {
    if (!record) return null;
    return {
      id: record.id,
      manifestId: record.manifest_id,
      packageId: record.package_id,
      pathId: record.path_id,
      wayBillNo: record.way_bill_no,
      pathNode: record.path_node,
      arrived: record.arrived,
      assignee: record.assignee,
      takeOver: record.take_over,
      from: pathRec[index].address,
      next: record.next
    }
  }

  serializeArriveInfo(records, pathRec) {
    if (!Array.isArray(records) || records.length === 0) return [];
    return _.map(records, (r, index) => {
      return this.serializeArriveInfoNode(r, index, pathRec);
    });
  }

  serializeFeedback(feedback) {
    if (!feedback) return null;
    return {
      id: feedback.id,
      userId: feedback.user_id,
      phone: feedback.user_phone,
      problem: feedback.problem,
      idea: feedback.idea,
    }
  }

  serializeFeedbacks(feedbacks) {
    if (!Array.isArray(feedback) || feedback.length === 0) return [];
    return _.map(feedbacks, (f) => {
      return this.serializeFeedback(f);
    });
  }
}
module.exports = SerializerService;
