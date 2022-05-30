const ErrorCode = require('./code');
const CommonExceptions = require('./commonExceptions');
const Exception = require('./exception');

module.exports = Object.assign(
  {},
  { ErrorCode },
  CommonExceptions,
  Exception
);
