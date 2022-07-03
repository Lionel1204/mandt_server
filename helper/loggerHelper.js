const log4js = require('log4js');

log4js.configure({
  appenders: {
    MTServer: {
      type: 'dateFile',
      filename: 'logs/log',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  replaceConsole: true,
  categories: {
    default: {
      appenders: ['MTServer'],
      level: 'info'
    }
  }
});

let ProxyCreateLoggerSingleton = (function(){
  let instance = null;
  return function(){
    if(instance){
      return instance
    }
    return instance = new LoggerSingleton();
  }
})();

let LoggerSingleton = function(){
  this.logger = log4js.getLogger('MTServer');
}

LoggerSingleton.prototype.getLogger = function(){
  return this.logger;
}

module.exports = ProxyCreateLoggerSingleton();
