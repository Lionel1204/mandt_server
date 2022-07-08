const _ = require('lodash');
const BaseController = require('./baseController');
const serviceFactory = require('../services/serviceFactory');
const svgCaptcha = require('svg-captcha');
const { loginQuerySchema, loginBodySchema, captchaQuerySchema } = require('../validateSchemas/registerSchemas');
const { RegisterAction, RegisterError, SALT } = require('../helper/constants');
const { ResourceNotExistException, NotAllowedException } = require('../exceptions/commonExceptions');
const { encrypt } = require('../helper/utils');
const svg64 = require('svg64');

class RegisterController extends BaseController {
  constructor() {
    super();
  }

  async getCaptcha(req, res) {
    try {
      this.validateQuery(captchaQuerySchema, req.query);
      const cap = svgCaptcha.create({
        size: 4,
        ignoreChars: '0Oo1iIlL',
        noise: 3,
        color: true,
        background: '#CFCFCF'
      });
      this.logger.info(cap.text);
      req.session.captcha = cap.text;
      if (req.query.base64) {
        const base64fromSVG = svg64(cap.data);
        res.json({image: base64fromSVG});
      } else {
        res.type('svg');
        res.send(cap.data);
      }
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async action(req, res) {
    try {
      this.validateQuery(loginQuerySchema, req.query);
      this.validateBody(loginBodySchema, req.body);

      const { action } = req.query;
      const dataService = await serviceFactory.getService('DataService');

      if (action === RegisterAction.LOGIN) {
        // Login
        const output = await this.checkUsers(req, dataService);
        res.json(output);
      } else if (action === RegisterAction.LOGOUT) {
        // Logout
        const { userId: phone } = req.body;
        if (req.session.phone !== phone) throw new NotAllowedException('Wrong User Id');
        await req.session.destroy();
        res.status(204).end();
      }
    } catch (ex) {
      this.errorResponse(res, ex);
    }
  }

  async checkUsers(req, dataService) {
    const { userId: phone, password, captcha } = req.body;
    const sessionCaptcha = req.session.captcha;
    const output = {
      result: false,
      error: null,
      id: 0,
      company: 0
    };
    if (sessionCaptcha?.toLowerCase() != captcha.toLowerCase()) {
      output.error = RegisterError.ERR_CAPTCHA;
    } else {
      const loginData = await dataService.getLogin(phone);
      if (!loginData) throw new ResourceNotExistException('No User found');
      const encryptPassword = encrypt('sha1', password, 'base64', SALT);
      if (loginData.password !== encryptPassword) {
        output.error = RegisterError.ERR_PASSWORD;
      } else {
        const user = await dataService.getUser(loginData.user_id);
        output.result = true;
        output.id = user.id;
        output.company = user.company_id;

        this.setSession(req, user);
      }
    }

    return output;
  }

  setSession(req, user) {
    req.session.userid = user.id;
    req.session.companyid = user.company_id;
    req.session.username = user.name;
    req.session.phone = user.phone;
    req.session.useremail = user.email;
  }
}

module.exports = RegisterController;
