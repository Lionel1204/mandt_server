module.exports = {
  cors: {
    allow: true,
    allowOrigin: 'http://localhost:3000',
    allowMethods: 'GET, POST, PUT, DELETE, PATCH',
    allowHeaders:
      'content-type, x-ads-token-data, x-ads-gateway-secret, x-ads-ul-ctx-head-span-id, x-ads-ul-ctx-caller-span-id, x-ads-ul-ctx-workflow-id, x-ads-ul-ctx-scope, x-ads-ul-ctx-source, x-ads-ul-ctx-oxygen-id, x-ads-ul-ctx-client-id',
    allowCredentials: true
  },
  redis: {
    redisHost: 'localhost',
    redisPassword: null,
    redisPort: 6379
  }
};
