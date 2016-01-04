var config = {};

config.port = 80;
config.dataStore = 'local';  //set data store method, local = local server variable || db = mysql database on AWS
config.version ='2.0';   //api version

module.exports = config;