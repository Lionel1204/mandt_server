const redis = require('redis');
const { promisify } = require('util');

const quitGracefully = async (logger, redisClient) => {
  try {
    const res = await promisify(redisClient.quit.bind(redisClient))();
    logger.info(`redis client succeed to quit. return code is ${res}`);
  } catch (e) {
    logger.error(`redis client fail to quit, err=${JSON.stringify(e)}`);
  }
};

const createClient = (host, port, password, options = {}) => {
  return new Promise((resolve) => {
    if (password) {
      const tlsClient = redis.createClient({
        url: `redis://${username}:${password}@${host}:${port}`
      });
      tlsClient.on('ready', () => resolve(tlsClient));
      tlsClient.on('error', () => resolve(redis.createClient({
        url: `redis://${host}:${port}`
      })));
    } else resolve(redis.createClient({
      url: `redis://${host}:${port}`
    }));
  });
};

module.exports = { quitGracefully, createClient };
