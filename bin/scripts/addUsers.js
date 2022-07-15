const serviceFactory = require('../../services/serviceFactory');
const args = require('minimist')(process.argv.slice(2));
/**
 *
 * @returns {Promise<void>}
 */
const run = async () => {
  try {
    const phone = args.phone;
    const password = args.password;
    const dataService = await serviceFactory.getService('DataService');
    const result = await dataService.setLogin(phone, password);
    if (result[0]) process.exit();
    process.exit(-1);
  } catch (ex) {
    process.exit(-1);
  }
};

run();
