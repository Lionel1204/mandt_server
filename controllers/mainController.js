'use strict'
const fs = require('fs');
const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');

class MainController extends BaseController {
  constructor() {
    super();
  }

  async health(req, res) {
    try {
      const output = {mysql: false, redis: false};
      const [redisService, dataService] = await serviceFactory.getService('RedisService', 'DataService');
      const user = await dataService.getUser(1);
      if (user) output.mysql = true;
      await redisService.setKey('health', 'OK', 10);
      const redisResult = await redisService.getKey('health');
      if (redisResult === 'OK') output.redis = true;
      output.version = this._getVersion();
      res.json(output);
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  _getVersion() {
    const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    return pkgJson.version
  }
}

module.exports = MainController;

