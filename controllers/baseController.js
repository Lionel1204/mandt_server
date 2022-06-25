const Ajv = require("ajv");

const Exceptions = require('../exceptions');

class BaseController {
  constructor() {
    const defaultOptions = {
      useDefaults: true,
      coerceTypes: true,
      $data: true
    };
    this.bodyAjv = new Ajv(defaultOptions);
    this.queryAjv = new Ajv(defaultOptions);
    this.paramsAjv = new Ajv(defaultOptions);
  }

  validateParam(schema, params) {
    if (!this.paramsAjv.validate(schema, params)) {
      throw new Exceptions.BadRequestException(this.paramsAjv.errorsText())
    }
  }

  validateBody(schema, body) {
    if (!this.bodyAjv.validate(schema, body)) {
      throw new Exceptions.BadRequestException(this.bodyAjv.errorsText())
    }
  }

  validateQuery(schema, query) {
    if (!this.queryAjv.validate(schema, query)) {
      throw new Exceptions.BadRequestException(this.queryAjv.errorsText())
    }
  }

  _getErrorCode(ex) {
    return (ex && ex.getErrorCode && ex.getErrorCode()) || (ex && ex.code) || 'ERR_UNKNOWN_ERROR';
  }

  _getErrorTitle(ex) {
    return (ex && ex.getMessage && ex.getMessage()) || (ex && (ex.title || ex.name));
  }

  _getErrorDetail(ex) {
    return (ex && ex.getDetailDescription && ex.getDetailDescription()) || (ex && (ex.detail || ex.message));
  }

  getErrorStatus(ex) {
    let status;
    if (ex instanceof Exceptions.BadRequestException) {
      status = 400;
    } else if (ex instanceof Exceptions.NotAuthenticatedException) {
      status = 401;
    } else if (ex instanceof Exceptions.NotAllowedException) {
      status = 403;
    } else if (ex instanceof Exceptions.ResourceNotExistException) {
      status = 404;
    } else if (ex instanceof Exceptions.ConflictException) {
      status = 409;
    } else if (ex instanceof Exceptions.InternalServerException) {
      status = 500;
    } else {
      status = 500; // unknown error, make it 500
    }
    return [status, ex];
  }

  buildErrorResponseBody(ex) {
    return {
      code: this._getErrorCode(ex),
      title: this._getErrorTitle(ex),
      detail: this._getErrorDetail(ex)
    };
  }

  errorResponse(res, err) {
    const [status, ex] = this.getErrorStatus(err);
    const body = this.buildErrorResponseBody(ex);
    res.status(status).json(body);
  }
}

module.exports = BaseController;
