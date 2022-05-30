class RootException extends Error {
  constructor(message, innerException, recoverable = true) {
    super(message);
    this.name = this.constructor.name;
    this._message = message || '';
    this._innerException = innerException;
    this._irrecoverable = !recoverable;
  }

  getMessage() {
    return this._message;
  }

  getInnerException() {
    return this._innerException;
  }

  getRecoverable() {
    return !this._irrecoverable;
  }

  get recoverable() {
    return !this._irrecoverable;
  }

  get title() {
    return this._message;
  }
}

module.exports = RootException;
