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

module.exports = {
  ProjectStatus,
  ManifestStatus,
  PackageStatus
};
