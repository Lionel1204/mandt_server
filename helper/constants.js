const {randomUUID} = require("crypto");
const ProjectStatus = {
  Active: 'ACTIVE',
  InActive: 'INACTIVE',
  Completed: 'COMPLETED',
  Void: 'VOID',
  Hold: 'HOLD'
};

const ManifestStatus = {
  Created: 'CREATED',
  Published: 'PUBLISHED',
  Ended: 'ENDED',
  Confirmed: 'CONFIRMED',
  Shipping: 'SHIPPING'
};

const PackageStatus = {
  Created: 'CREATED',
  InTransit: 'INTRANSIT',
  Finished: 'FINISHED'
}

const PathType = {
  Start: 0,
  End: 1,
  Middle: 2
}

const RegisterAction = {
  LOGIN: 'login',
  LOGOUT: 'logout'
}

const RegisterError = {
  ERR_PASSWORD: 'ERR_PASSWORD',
  ERR_CAPTCHA: 'ERR_CAPTCHA'
}

const SALT = '1bf94fe5-0068-453c-b3a6-10b6e0a0a5cb';

module.exports = {
  ProjectStatus,
  ManifestStatus,
  PackageStatus,
  PathType,
  RegisterAction,
  RegisterError,
  SALT
};
