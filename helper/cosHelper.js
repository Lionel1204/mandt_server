const cred = require('../config/cred.json');
const COS = require('cos-nodejs-sdk-v5');
const util = require('util');
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
 * @param filename full path name
 * @param url
 * @returns {void | Promise<COS.PutObjectResult>}
 */
const uploadBase64 = async (logger, cos, bucket, region, filename, url) => {
  const body = Buffer.from(url.split(',')[1], 'base64');
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: filename,
        StorageClass: STORAGE_CLASS,
        Body: body
      },
      function (err, data) {
        if (err) return reject(err);
        return resolve(data);
      }
    );
  });
};

const listObjects = async (logger, cos, bucket, region, path) => {
  const getBucket = util.promisify(cos.getBucket);
  try {
    const result = await getBucket({
      Bucket: bucket,
      Region: region,
      Prefix: path,
      Delimiter: '/'
    });
    return result;
  } catch (ex) {
    logger.info(ex);
  }
};

const download = () => {
  cos.getObject({});
};

module.exports = {
  createCOS,
  uploadBase64,
  listObjects
};
