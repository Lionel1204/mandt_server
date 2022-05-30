'use strict';
const RootException = require('./rootException');

class Exception extends RootException {
  constructor(errorCode, message, detailDescription, innerException, recoverable = false, status = '') {
    super(message, innerException, recoverable);
    this._errorCode = errorCode;
    this._detailDescription = detailDescription || '';
    this._status = status;
  }

  get errorCode() {
    return this._errorCode;
  }

  get detail() {
    return this._detailDescription;
  }

  getErrorCode() {
    return this._errorCode;
  }

  /**
   * Getter for error detail description.
   * @return {String} The error detail description.
   */
  getDetailDescription() {
    return this._detailDescription;
  }

  getStatus() {
    return this._status;
  }

  toString() {
    var message = `ErrorCode: ${this._errorCode}\nMessage: ${this._message}\nDetail Description: ${this._detailDescription}`;
    if (this._innerException) {
      message += `\n>>>innerException:\n${this._innerException.toString()}`;
    }
    if (this._status) {
      message += `\n>>>Status:\n${this._status.toString()}`;
    }
    return message;
  }

  toTrace() {
    return {
      errorClass: this.constructor.name,
      errorCode: this._errorCode,
      message: this._message,
      detailDescription: this._detailDescription,
      innerException: this._innerException,
      status: this._status,
      stack: this.stack
    };
  }

  setErrorCode(code) {
    this._errorCode = code;
    return this;
  }

  toErrorResponse() {
    return {
      status: this._status,
      body: {
        error: {
          code: this._errorCode,
          title: this._message,
          detail: this._detailDescription
        }
      }
    };
  }
}

module.exports = Exception;
