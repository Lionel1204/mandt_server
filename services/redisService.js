'use strict';
const _ = require('lodash');
const redisHelper = require('../helper/redisHelper');
const logger = require('../helper/loggerHelper');
const nConfig = require('../config');
const { InternalServerException } = require('../exceptions');
/**
 * Redis service
 */
class RedisService {
  /**
   * constructor
   */
  constructor() {}

  /**
   * initialize
   */
  async initialize() {
    const redisHost = nConfig.get('redis:redisHost');
    const redisPassword = nConfig.get('redis:redisPassword');
    const redisPort = nConfig.get('redis:redisPort');
    this.logger = logger.getLogger();
    this.logger.info(`initializing with redis url: ${redisHost}`);
    this._client = await redisHelper.createClient(redisHost, redisPort, redisPassword);
    await this._client.connect();
    this._client.on('error', (err) => {
      this.logger.error('Error from redis:', err);
    });
    return Promise.resolve();
  }

  /**
   * close redis connect
   */
  async destroy(logger, redisHelper) {
    await redisHelper.quitGracefully(logger, this._client);
  }

  /**
   * Get the default client
   */
  getClient() {
    return this._client;
  }

  /**
   * Set value for fields in key, a wrapper for hmset
   *
   * @param {Object}   logger   The logger object with caller context.
   * @param {Object}   key      The hash key to update
   * @param {Object}   values   The key-value pair to set
   * @return {Promise} A promise resolve when the value is set
   */
  setFields(logger, key, values) {
    logger.debug(`[RedisService.setKeyField] Set redis hash ${key} to ${JSON.stringify(values)}`);
    const params = [];
    Object.keys(values).forEach((fieldKey) => {
      params.push(fieldKey);
      params.push(values[fieldKey]);
    });

    return new Promise((resolve, reject) => {
      this._client.hmset(key, params, (err, res) => {
        if (err) {
          logger.error(`[RedisService.setKeyField] failed setting fields for key ${key}`, err);
          reject(new RedisException(`Failed setting fields for key ${key}`, err));
        } else {
          logger.debug('[RedisService.setKeyField] setting redis key succeed!');
          resolve(res);
        }
      });
    });
  }

  /**
   * wrapper for set/setex
   *
   * @param {Object}   logger   The logger object with caller context.
   * @param {Object}   key      The hash key to update
   * @param {Object}   value    The key-value pair to set
   * @param {Number}   ttl      key expiration time in seconds, default is -1, no ttl
   * @return {Promise} A promise resolve when the value is set
   */
  async setKey(key, value, ttl = 0) {
    const options = {};
    if (ttl > 0) options.EX = ttl;
    return this._client.set(key, value, options);
  }

  /**
   * setKeyNX
   * @param logger
   * @param key
   * @param value
   * @param ttl
   * @returns {Promise}
   */
  setKeyNX(logger, key, value, ttl = -1) {
    logger.debug(`[RedisService.setKey] Set redis ${key} to ${value}`);

    const setCb = (resolve, reject) => {
      return (err, res) => {
        if (err) {
          logger.error(`[RedisService.setKey] failed setting value for key ${key}`, err);
          reject(new RedisException(`Failed setting value for key ${key}`, err));
        } else {
          logger.debug('[RedisService.setKey] setting redis key succeed!');
          resolve(res);
        }
      };
    };

    return new Promise((resolve, reject) => {
      if (ttl >= 0) {
        this._client.set(key, value, 'EX', ttl, 'NX', setCb(resolve, reject));
      } else {
        this._client.setnx(key, value, setCb(resolve, reject));
      }
    });
  }

  /**
   * Delete fields for a hash key, a wrap if hdel
   *
   * @param {Object}          logger    The logger object with caller context.
   * @param {Object}          key       The hash key to update
   * @param {Array#String}    fields    The fields to delete
   * @return {Promise}                  A promise resolve when the value is set
   */
  deleteFields(logger, key, fields) {
    logger.debug(`[RedisService.deleteFields] delete field ${fields}`);
    if (fields && fields.length === 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this._client.hdel(key, ...fields, (err, res) => {
        if (err) {
          logger.error(`[RedisService.deleteFields] failed delete fields ${fields} for key ${key}`, err);
          reject(new RedisException(`Failed delete fields ${fields} for key ${key}`, err));
        } else {
          logger.debug(`[RedisService.deleteFields] delete redis fields for key ${key} succeed!`);
          resolve(res);
        }
      });
    });
  }

  /**
   * Delete keys, a wrap if del
   *
   * @param {Object}          logger    The logger object with caller context.
   * @param {Array#String}    keys      The keys to delete
   * @return {Promise}                  A promise resolve when the value has deleted
   */
  deleteKeys(logger, keys) {
    logger.debug(`[RedisService.deleteKeys] delete keys ${keys}`);
    if (keys && keys.length === 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this._client.del(...keys, (err, res) => {
        if (err) {
          logger.error(`[RedisService.deleteKeys] failed delete keys ${keys}`, err);
          reject(new RedisException(`Failed delete keys ${keys}`, err));
        } else {
          logger.debug(`[RedisService.deleteKeys] delete redis keys ${keys} succeed!`);
          resolve(res);
        }
      });
    });
  }

  /**
   * retrieve a value for a key a wrap of hgetall
   *
   * @param {Object}          logger   The logger object with caller context.
   * @param {Object}          key      The hash key to read
   * @return {Promise}                 A promise resolve when the value is read
   */
  getHashKey(logger, key) {
    logger.debug(`[RedisService.getHashKey] Get redis hash ${key}`);
    return new Promise((resolve, reject) => {
      this._client.hgetall(key, (err, reply) => {
        if (err) {
          logger.error(`[RedisService.getHashKey] failed read fields for key ${key}`);
          reject(new RedisException(`Failed read fields for key ${key}`, err));
        } else {
          logger.debug(`[RedisService.getHashKey] redis key ${key} read: ${reply}`);
          resolve(reply);
        }
      });
    });
  }

  /**
   * retrieve a value for a key a wrap of get
   *
   * @param {Object}          logger   The logger object with caller context.
   * @param {Object}          key      The key to read
   * @return {Promise}                 A promise resolve when the value is read
   */
  async getKey(key) {
    return this._client.get(key);
  }

  /**
   * retrieve values for specified keys
   *
   * @param  {Object}     logger   The logger object with caller context.
   * @param  {Array}      keys     The keys to read
   * @return {Promise}             A promise resolve when the values are read
   */
  getKeys(logger, keys) {
    logger.debug(`[RedisService.getKeys] Get redis ${keys}`);
    return new Promise((resolve, reject) => {
      this._client.mget(keys, (err, reply) => {
        if (err) {
          logger.error(`[RedisService.getKeys] failed read values for keys ${keys}`);
          reject(new RedisException(`Failed read fields for keys ${keys}`, err));
        } else {
          logger.debug(`[RedisService.getKeys] redis keys ${keys} read: ${reply}`);
          resolve(reply);
        }
      });
    });
  }

  /**
   * lockedState
   * @returns {{AVAILABLE: string, OTHERSLOCKED: string, SELFLOCKED: string}}
   */
  get lockedState() {
    return {
      AVAILABLE: 'available',
      OTHERSLOCKED: 'lockedByOthers',
      SELFLOCKED: 'lockedByMyself'
    };
  }

  /**
   * Set value in redis with order set
   *
   * @param logger {Object}
   * @param key {String} - redis key
   * @param values {Array<{order:, value: }>}
   */
  setValuesWithOrder(logger, key, values) {
    logger.debug(`[RedisService.setValuesWithOrder] Set redis ${key} to ${JSON.stringify(values)}`);

    const setCb = (resolve, reject) => {
      return (err, res) => {
        if (err) {
          logger.errorEx(`[RedisService.setValuesWithOrder] failed setting value for key ${key}`, err);
          reject(new RedisException(`Failed setting value for key ${key}`, err));
        } else {
          logger.debug('[RedisService.setValuesWithOrder] setting redis key succeed!');
          resolve(res);
        }
      };
    };

    return Promise.all(
      values.map((value) => {
        return new Promise((resolve, reject) => {
          this._client.zadd(key, value.order, value.value, setCb(resolve, reject));
        });
      })
    );
  }

  /**
   * Pop top data from redis
   * @param {Object} logger
   * @param {String} key
   * @param {Number} start
   * @param {Number} end
   *
   * @returns pop data
   */
  PopOrderValuesByRange(logger, key, start, end) {
    return new Promise((resolve, reject) => {
      this._client.zrange(key, start, end, (err, data) => {
        if (err) {
          logger.errorEx(`[RedisService.PopOrderValuesByRange] failed read value for key ${key}`);
          reject(new RedisException(`Failed read data for key ${key}`, err));
        } else {
          logger.debug(`[RedisService.PopOrderValuesByRange] redis key ${key} read: ${data}`);
          resolve(data);
        }
      });
    }).then((data) => {
      // remove data
      return new Promise((resolve, reject) => {
        this._client.zremrangebyrank(key, start, end, (err, count) => {
          if (err) {
            logger.errorEx(`[RedisService.PopOrderValuesByRange] failed remove value for key ${key}`);
            reject(new RedisException(`Failed remove value for key ${key}`, err));
          } else {
            logger.debug(`[RedisService.PopOrderValuesByRange] redis key ${key} remove: ${count}`);
            resolve(data);
          }
        });
      });
    });
  }

  /**
   * lock
   * @param logger
   * @param resourceId
   * @param ownerId
   * @param expired
   * @returns {Promise<string>}
   * if return 'available', the key locked by yourself
   * if return others, the key is already locked by some other client
   * if return false, the key is already locked by some other client
   */
  async lock(logger, resourceId, ownerId, expired = 259200) {
    const setResult = await this.setKeyNX(logger, resourceId, ownerId, expired);
    if (setResult === 'OK') return this.lockedState.AVAILABLE;

    const oid = await this.getKey(logger, resourceId);
    return oid === ownerId ? this.lockedState.SELFLOCKED : this.lockedState.OTHERSLOCKED;
  }

  /**
   * unlock
   * @param logger
   * @param resourceId
   * @returns {Promise}
   */
  async unlock(logger, resourceId) {
    return await this.deleteKeys(logger, [resourceId]);
  }
}

module.exports = RedisService;
