const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');

class ManifestsController extends BaseController {
    constructor() {
        super();
    }

    async list(req, res) {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        try {
            const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
            const manifests = await dataService.listManifests({limit, offset});
            res.json(manifests);
        } catch (ex) {
            errorResponse(ex);
        }
    }

    async get(req, res) {
        const { manifestId } = req.params;
        const [dataService, serializerService] = await serviceFactory.getService('DataService', 'SerializerService');
        const manifest = await dataService.getManifestById(manifestId);
        const output = serializerService.serializeManifest(manifest);
        res.json(output);
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
        const [dataService] = await serviceFactory.getService('DataService', 'SerializerService');
        const result = await dataService.deleteManifest(manifestId);
        if (result) res.status(204).end();
        else res.status(404).end();
    }
}

module.exports = ManifestsController;
