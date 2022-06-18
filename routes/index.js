/*
var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/health', function(req, res, next) {
  res.json({ name: 'Health Page'})
});

module.exports = router;
*/
const controllers = require('../controllers');
const {createControllerFunction} = require('../helper/routerHelper');
const apiPrefix = '/api/v1'
const {
  projectsController,
  usersController,
  qrController,
  manifestsController,
  companiesController,
  packagesController,
  cargosController
} = controllers;

module.exports = function(app) {
  // Projects
  app.get(`${apiPrefix}/projects`, createControllerFunction(projectsController, 'list'));
  app.get(`${apiPrefix}/projects/:projectId`, createControllerFunction(projectsController, 'get'));
  app.post(`${apiPrefix}/projects`, createControllerFunction(projectsController, 'post'));
  app.patch(`${apiPrefix}/projects/:projectId`, createControllerFunction(projectsController, 'patch'));
  app.delete(`${apiPrefix}/projects/:projectId`, createControllerFunction(projectsController, 'delete'));

  // Project Users
  app.get(`${apiPrefix}/projects/:projectId/users`, createControllerFunction(projectsController, 'listProjectUsers'));
  app.post(`${apiPrefix}/projects/:projectId/users/:userId`, createControllerFunction(projectsController, 'addProjectUsers'));

  // QR Code
  app.post(`${apiPrefix}/qrcode`, createControllerFunction(qrController, 'post'));

  // Users
  app.get(`${apiPrefix}/users/:userId`, createControllerFunction(usersController, 'get'));
  app.post(`${apiPrefix}/users`, createControllerFunction(usersController, 'post'));
  app.get(`${apiPrefix}/users`, createControllerFunction(usersController, 'list'));

  // Manifests
  app.get(`${apiPrefix}/manifests`, createControllerFunction(manifestsController, 'list'));
  app.get(`${apiPrefix}/manifests/:manifestId`, createControllerFunction(manifestsController, 'get'));
  app.post(`${apiPrefix}/manifests`, createControllerFunction(manifestsController, 'post'));
  app.patch(`${apiPrefix}/manifests/:manifestId`, createControllerFunction(manifestsController, 'patch'));
  app.delete(`${apiPrefix}/manifests/:manifestId`, createControllerFunction(manifestsController, 'delete'));

  // Companies
  app.get(`${apiPrefix}/companies`, createControllerFunction(companiesController, 'list'));
  app.post(`${apiPrefix}/companies`, createControllerFunction(companiesController, 'post'));

  // Packages
  app.get(`${apiPrefix}/manifests/:manifestId/packages`, createControllerFunction(packagesController, 'list'));
  app.get(`${apiPrefix}/manifests/:manifestId/packages/:packageId`, createControllerFunction(packagesController, 'get'));
  app.post(`${apiPrefix}/manifests/:manifestId/packages`, createControllerFunction(packagesController, 'post'));
  app.patch(`${apiPrefix}/manifests/:manifestId/packages/:packageId`, createControllerFunction(packagesController, 'patch'));
  app.delete(`${apiPrefix}/manifests/:manifestId/packages/:packageId`, createControllerFunction(packagesController, 'delete'));
  app.get(`${apiPrefix}/packages`, createControllerFunction(packagesController, 'query'));

  // Cargos
  app.get(`${apiPrefix}/manifests/:manifestId/cargos`, createControllerFunction(cargosController, 'list'));
  app.get(`${apiPrefix}/manifests/:manifestId/cargos/:cargoId`, createControllerFunction(cargosController, 'get'));
  app.post(`${apiPrefix}/manifests/:manifestId/cargos`, createControllerFunction(cargosController, 'post'));
  app.patch(`${apiPrefix}/manifests/:manifestId/cargos/:cargoId`, createControllerFunction(cargosController, 'patch'));
  app.delete(`${apiPrefix}/manifests/:manifestId/cargos/:cargoId`, createControllerFunction(cargosController, 'delete'));
  app.get(`${apiPrefix}/cargos`, createControllerFunction(cargosController, 'query'));

  // Paths

};
