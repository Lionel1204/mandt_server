const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');

class UsersController extends BaseController {
    constructor() {
        super();
    }

    async get(req, res) {
        const { userId } = req.params;
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const user = await dataService.getUser(userId);
        res.json(user);
    }

    async post(req, res) {
        const payload = {
            name: req.body.name,
            title: req.body.title,
            identity: req.body.identity,
            phone: req.body.phone,
            email: req.body.email
        };
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const user = await dataService.createUser(payload);
        const output = serializerService.serializeUser(user);
        res.status(201).json(output);
    }
}

module.exports = UsersController;
