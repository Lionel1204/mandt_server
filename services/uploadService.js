'use strict';
const _ = require('lodash');
const cosHelper = require('../helper/cosHelper');
const nConfig = require('../config');
const shortid = require('shortid');
const logger = require('../helper/loggerHelper');

/**
 * Redis service
 */
class UploadService {
  /**
   * constructor
   */
  constructor() {}

  /**
   * initialize
   */
  async initialize() {
    this.logger = logger.getLogger();
    this._bucket = nConfig.get('cos:bucket');
    this._region = nConfig.get('cos:region');
    this._cos = cosHelper.createCOS();
    return Promise.resolve();
  }

  /**
   * upload
   * @param prefix
   * @param manifestId
   * @param packageId
   * @param base64Url
   * @returns {Promise<void|COS.PutObjectResult>}
   */
  async upload(prefix, manifestId, packageId, base64Url) {
    const timestamp = new Date().getTime();
    const uploadFilename = `${prefix}/${manifestId}/${packageId}/${timestamp}_${shortid.generate()}.jpg`;
    await cosHelper.uploadBase64(this.logger, this._cos, this._bucket, this._region, uploadFilename, base64Url);
  }

  async getImages(prefix) {
    return cosHelper.listObjects(this.logger, this._cos, this._bucket, this._region, prefix);
  }
}

module.exports = UploadService;
