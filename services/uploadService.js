'use strict';
const _ = require('lodash');
const cosHelper = require('../helper/cosHelper');
const nConfig = require('../config');
const shortid = require('shortid');
const logger = require('../helper/loggerHelper');
const Exceptions = require("../exceptions");

const convertToCommonError = (err) => {
  switch (err.statusCode) {
    case 400:
      return new Exceptions.BadRequestException(err.name, err);
    case 401:
      return new Exceptions.NotAuthenticatedException(err.name, err);
    case 403:
      return new Exceptions.NotAllowedException(err.name, err);
    case 404:
      return new Exceptions.ResourceNotExistException(err.name, err);
    case 409:
      return new Exceptions.ConflictException(err.name, err);
    case 500:
      return new Exceptions.InternalServerException(err.name, err);
    default:
      return new Exceptions.InternalServerException(err.name, err);
  }
}

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
    try {
      const timestamp = new Date().getTime();
      const uploadFilepath = `${prefix}/${manifestId}/${packageId}`
      const uploadFilename = `${timestamp}_${shortid.generate()}.png`;
      return await cosHelper.uploadBase64(this.logger, this._cos, this._bucket, this._region, uploadFilepath, uploadFilename, base64Url, true);
    } catch (ex) {
      if (ex.statusCode) {
        throw convertToCommonError(ex);
      }
    }
  }

  /**
   * listImageNames
   * @param prefix
   * @param manifestId
   * @param packageId
   * @param filter
   * @returns {Promise<*>}
   */
  async listImageNames(prefix, manifestId, packageId, filter = '') {
    const filepath = `${prefix}/${manifestId}/${packageId}`;

    const contents = await cosHelper.listObjects(this.logger, this._cos, this._bucket, this._region, filepath);
    const imageNames = contents.map((c) => _.trimStart(c.Key, filepath));
    if (filter) return imageNames.filter((n) => _.includes(n, filter));
    return imageNames;
  }

  async getImages(prefix, manifestId, packageId, names) {
    const filepath = `${prefix}/${manifestId}/${packageId}`;
    const imageUrls = await Promise.all(names.map(async (name) => {
      return await cosHelper.getObjectUrl(this.logger, this._cos, this._bucket, this._region, filepath, name);
    }));
    return imageUrls;
  }
}

module.exports = UploadService;