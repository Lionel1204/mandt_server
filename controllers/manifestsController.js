const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');

class ManifestsController extends BaseController {
    constructor() {
        super();
    }

    async list(req, res) {
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const manifests = await dataService.listManifests();
        res.json(manifests);
    }

    async get(req, res) {
        const { manifestId } = req.params;
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const manifest = await dataService.getManifestById(manifestId);
        res.json(manifest);
    }

    async post(req, res) {
        const payload = {
            name: req.body.name
        };
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const manifest = await dataService.createManifest(payload);
        const output = serializerService.serializeManifest(manifest);
        res.status(201).json(output);
    }

    async patch(req, res) {
        const { projectId } = req.params;
        const payload = req.body;

        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const result = await dataService.updateManifest(manifestId, payload);
        if (result) res.status(200).end();
        else res.status(404).end();
    }

    async delete(req, res) {
        const { projectId } = req.params;
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const result = await dataService.deleteManifest(manifestId);
        if (result) res.status(204).end();
        else res.status(404).end();
    }
}

module.exports = ManifestsController;
