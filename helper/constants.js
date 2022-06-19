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

module.exports = {
  ProjectStatus,
  ManifestStatus,
  PackageStatus,
  PathType
};
