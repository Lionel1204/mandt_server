const _ = (code, title) => {
  return {
    code,
    title
  };
};

module.exports = {
  //400
  ERR_BAD_REQUEST: _('ERR_BAD_REQUEST', 'The request has invalid header or body'),

  //401
  ERR_AUTHENTICATED_ERROR: _('ERR_AUTHENTICATED_ERROR', 'Authentication header is not correct'),

  //403
  ERR_NOT_ALLOWED: _('ERR_NOT_ALLOWED', 'Operation not allowed'),

  //404
  ERR_RESOURCE_NOT_EXIST: _('ERR_RESOURCE_NOT_EXIST', 'The resource does not exist'),

  //405
  ERR_METHOD_NOT_ALLOWED: _('ERR_METHOD_NOT_ALLOWED', 'The method is not allowed'),

  // 409
  ERR_CONFLICT: _('ERR_CONFLICT', 'Resource is conflict'),

  // 406
  ERR_NOT_ACCEPTABLE: _('ERR_NOT_ACCEPTABLE', 'Resource cannot be parsed'),

  // 413
  ERR_REQUEST_ENTITY_TOO_LARGE: _('ERR_REQUEST_ENTITY_TOO_LARGE', 'Request entity is too large'),

  // 422
  ERR_UNPROCESSABLE_ENTITY: _('ERR_UNPROCESSABLE_ENTITY', 'Unable to process the request'),

  // 423
  ERR_RESOURCE_LOCKED: _('ERR_RESOURCE_LOCKED', 'The resource has been locked'),

  // 429
  ERR_TOO_MANY_REQUESTS: _('ERR_TOO_MANY_REQUESTS', 'Too many requests, please retry later'),

  // 500
  ERR_INTERNAL_SERVER_ERROR: _('ERR_INTERNAL_SERVER_ERROR', 'Internal server error'),

  // 501
  ERR_NOT_IMPLEMENTED: _('ERR_NOT_IMPLEMENTED', 'Function is not implemented'),

  // 503
  ERR_SERVICE_UNAVAILABLE: _('ERR_SERVICE_UNAVAILABLE', 'Service unavailable'),

  // 504
  ERR_GATEWAY_TIMEOUT: _('ERR_GATEWAY_TIMEOUT', 'Gateway Timeout')
};
