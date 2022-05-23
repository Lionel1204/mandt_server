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
module.exports = function(app) {

  const {
    projectsController,
    usersController,
    qrController
  } = controllers;

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
  app.post(`${apiPrefix}/users/`, createControllerFunction(usersController, 'post'));

};
