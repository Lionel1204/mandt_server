const Exception = require('./exception');
const ErrorCode = require('./code');

// 400
class BadRequestException extends Exception {
  constructor(detailDescription, innerException) {
    super(
      ErrorCode.ERR_BAD_REQUEST.code,
      ErrorCode.ERR_BAD_REQUEST.title,
      detailDescription,
      innerException,
      false,
      400
    );
  }
}

// 401
class NotAuthenticatedException extends Exception {
  constructor(detailDescription, innerException) {
    super(
      ErrorCode.ERR_AUTHENTICATED_ERROR.code,
      ErrorCode.ERR_AUTHENTICATED_ERROR.title,
      detailDescription,
      innerException,
      false,
      401
    );
  }
}

// 403
class NotAllowedException extends Exception {
  constructor(detailDescription, innerException) {
    super(
      ErrorCode.ERR_NOT_ALLOWED.code,
      ErrorCode.ERR_NOT_ALLOWED.title,
      detailDescription,
      innerException,
      false,
      403
    );
  }
}

// 404
class ResourceNotExistException extends Exception {
  constructor(detailDescription, innerException) {
    super(
      ErrorCode.ERR_RESOURCE_NOT_EXIST.code,
      ErrorCode.ERR_RESOURCE_NOT_EXIST.title,
      detailDescription,
      innerException,
      false,
      404
    );
  }
}

// 409
class ConflictException extends Exception {
  constructor(detailDescription, innerException) {
    super(ErrorCode.ERR_CONFLICT.code, ErrorCode.ERR_CONFLICT.title, detailDescription, innerException, false, 409);
  }
}

// 500
class InternalServerException extends Exception {
  constructor(detailDescription, innerException) {
    super(
      ErrorCode.ERR_INTERNAL_SERVER_ERROR.code,
      ErrorCode.ERR_INTERNAL_SERVER_ERROR.title,
      detailDescription,
      innerException,
      true,
      500
    );
  }
}

module.exports = {
  BadRequestException,
  NotAuthenticatedException,
  NotAllowedException,
  ResourceNotExistException,
  ConflictException,
  InternalServerException
};
