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
}
module.exports = SerializerService;
