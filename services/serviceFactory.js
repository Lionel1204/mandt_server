const DBService = require('./dbService');
const DataService = require('./dataService');
const SerializerService = require('./serializerService');

class ServiceFactory {
    constructor() {
        this._service = {}
    }

    async getService(...serviceNames) {
        if (serviceNames.length === 0) return Promise.resolve([]);

        if (serviceNames.length > 1) {

            return await Promise.all(serviceNames.map(async (name) => {
                return await this.getService(name)
            }));
        }
        const serviceName = serviceNames[0];
        const service = this._service[serviceName];
        if (!service) {
            return Promise.reject(`Service ${serviceName} does not exist`);
        }
        if (service.initPromise) {
            return service.initPromise;
        }

        service.initPromise = Promise.all(
            service.dependingServices.map(async (dep) => {
                return await this.getService(dep);
            })
        ).then(async (deps) => {
            service.instance = new service.ClassConstructor(...deps);
            return service.instance.initialize();
        }).then(() => {
            return service.instance;
        }).catch((err) => {
            return Promise.reject(`${err.message}`);
        });

        return service.initPromise;
    }

    registerService(serviceName, dependingServices, ClassConstructor) {
        if (this._service[serviceName]) return this;
        this._service[serviceName] = {
            ClassConstructor,
            dependingServices
        };
        return this;
    }
}

const serviceFactory = new ServiceFactory();
serviceFactory.registerService('DBService', [], DBService);
serviceFactory.registerService('DataService', ['DBService'], DataService);
serviceFactory.registerService('SerializerService', [], SerializerService);
module.exports = serviceFactory;
