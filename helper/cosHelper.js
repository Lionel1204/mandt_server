const cred = require('../config/cred.json');
const COS = require('cos-nodejs-sdk-v5');
const STORAGE_CLASS = 'STANDARD';

const createCOS = () => {
  return new COS({
    SecretId: cred.AK,
    SecretKey: cred.SK
  });
};

/**
 * uploadBase64
 * @param cos
 * @param bucket
 * @param region
 * @param filepath
 * @param filename
 * @param fileext
 * @param url
 * @param thumbnail
 * @returns {void | Promise<COS.PutObjectResult>}
 */
const uploadBase64 = async (logger, cos, bucket, region, filepath, filename, fileext, url, thumbnail = false) => {
  const body = Buffer.from(url.split(',')[1], 'base64');
  return new Promise((resolve, reject) => {
    const options = {
      Bucket: bucket,
      Region: region,
      Key: `${filepath}/${filename}.${fileext}`,
      StorageClass: STORAGE_CLASS,
      Body: body
    };
    if (thumbnail) options.Headers =  {
      // Use imageMogr2 to resize the image, width=200
      'Pic-Operations': `{"is_pic_info": 1, "rules": [{"fileid": "${filename}_thumbnail.${fileext}", "rule": "imageMogr2/thumbnail/200x/"}]}`
    }
    cos.putObject(
      options,
      function (err, data) {
        if (err) return reject(err);
        return resolve(data.Location);
      }
    );
  });
};

const listObjects = async (logger, cos, bucket, region, path) => {
  return new Promise((resolve, reject) => {
    cos.getBucket({
      Bucket: bucket,
      Region: region,
      Prefix: `${path}/`,
      MaxKeys: 1000
    }, function(err, data) {
      if (err) return reject(err);
      return resolve(data.Contents);
    });
  })
};

/**
 * getObjectUrl
 * @param logger
 * @param cos
 * @param bucket
 * @param region
 * @param path
 * @param name
 * @returns {Promise<unknown>}
 */
const getObjectUrl = async (logger, cos, bucket, region, path, name) => {
  return new Promise((resolve, reject) => {
    cos.getObjectUrl({
      Bucket: bucket,
      Region: region,
      Key: `${path}/${name}`,
      Sign: true,
      Expires: 60 //60 sec
    }, function(err, data) {
      if (err) return reject(err);
      return resolve(data.Url);
    });
  });
};

/**
 * deleteObject
 * @param logger
 * @param cos
 * @param bucket
 * @param region
 * @param filePath
 * @returns {Promise<unknown>}
 */
const deleteObject = async (logger, cos, bucket, region, filePath) => {
  return new Promise((resolve, reject) => {
    cos.deleteObject({
      Bucket: bucket,
      Region: region,
      Key: filePath,
    }, function(err, data) {
      if (err) return reject(err);
      return resolve(data.statusCode === 204);
    });
  });
};

module.exports = {
  createCOS,
  uploadBase64,
  listObjects,
  getObjectUrl,
  deleteObject
};
