'use strict';
const _ = require('lodash');
const cosHelper = require('../helper/cosHelper');
const nConfig = require('../config');
const shortid = require('shortid');
const logger = require('../helper/loggerHelper');
const Exceptions = require('../exceptions');

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
};

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
  async upload(prefix, manifestId, packageId, pathNode, base64Url) {
    try {
      const timestamp = new Date().getTime();
      const filePath = `${prefix}/${manifestId}/${packageId}/${pathNode}`;
      const fileName = `${timestamp}_${shortid.generate()}`;
      const fileExt = 'png';
      return await cosHelper.uploadBase64(
        this.logger,
        this._cos,
        this._bucket,
        this._region,
        filePath,
        fileName,
        fileExt,
        base64Url,
        true
      );
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
  async listImageNames(prefix, manifestId, packageId, filter = {}) {
    const THUMBNAIL_SUFFIX = 'thumbnail';
    const filepath = `${prefix}/${manifestId}/${packageId}`;
    const { thumbnail, pathnode } = filter;
    const contents = await cosHelper.listObjects(this.logger, this._cos, this._bucket, this._region, filepath);
    const imageNames = contents.map((c) => c.Key.replace(filepath + '/', ''));
    let imageList = imageNames;
    if (thumbnail) imageList = imageNames.filter((n) => _.includes(n, THUMBNAIL_SUFFIX));
    const result = _.reduce(
      imageList,
      (acc, v) => {
        const [key, name] = v.split('/');
        if (!_.get(acc, key)) acc[key] = [name];
        else acc[key] = [...acc[key], name];
        return acc;
      },
      {}
    );
    if (!pathnode || !Number(pathnode)) return result;
    else return { [pathnode]: _.get(result, pathnode) };
  }

  async getImages(prefix, manifestId, packageId, payload) {
    const filepath = `${prefix}/${manifestId}/${packageId}`;
    const imageUrls = await Promise.all(
      payload.map(async (p) => {
        const fullPath = `${filepath}/${p.pathNode}`;
        return await cosHelper.getObjectUrl(this.logger, this._cos, this._bucket, this._region, fullPath, p.imageName);
      })
    );
    return imageUrls;
  }

  async deleteImage(prefix, manifestId, packageId, pathnode, imageName) {
    const filepath = `${prefix}/${manifestId}/${packageId}/${pathnode}/${imageName}`;
    const fileExt = '.png'
    const realFilename = _.trimEnd(imageName, fileExt);

    const filepathList = [
      `${prefix}/${manifestId}/${packageId}/${pathnode}/${imageName}`,// image name
      `${prefix}/${manifestId}/${packageId}/${pathnode}/${realFilename}_thumbnail${fileExt}`
    ]

    const results = await Promise.all(
      filepathList.map(async (fp) => {
        return await cosHelper.deleteObject(this.logger, this._cos, this._bucket, this._region, fp);
      })
    );
    return _.every(results, Boolean);
  }
}

module.exports = UploadService;
