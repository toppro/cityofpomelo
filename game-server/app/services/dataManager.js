/**
 * Module dependencies
 */
var fs = require('fs');
var util = require('util');
var consts = require('../consts/consts');
var utils = require('../util/utils');
var logger = require('pomelo-logger').getLogger(__filename);

var exp = module.exports;

var gDataDir = './app/data/';
var gGlobalFile = 'global.json';
var gGlobalInfo = null;


// init
exp.initDataFromFile = function() {
  if(!!gGlobalInfo) {
    return;
  }
  var tmpGFile = gDataDir + gGlobalFile;
  try {
    fs.openSync(tmpGFile, 'r');
    gGlobalInfo = require('../data/' + gGlobalFile);
  } catch(_) {
    gGlobalInfo = {gPlayerId: 0, playerInfoDict: {}};
    try {
      // var tmpStr = util.inspect(gGlobalInfo, {depth: null});
      var tmpStr = JSON.stringify(gGlobalInfo);
      fs.writeFileSync(tmpGFile, tmpStr);
    } catch(ex) {
      console.error(tmpGFile + ' is not saved!');
    }
  }

  this.isSavingMutex = false;
};

exp.getPlayerId = function(data) {
  var playerName = data.playerName;
  var password = data.password;
  // utils.myPrint('data = ', JSON.stringify(data));

  var d = gGlobalInfo.playerInfoDict;
  if(!!d[playerName]) {
    var obj = d[playerName];
    if(password === obj.password) {
      return parseInt(obj.playerId);
    } else {
      return 0;
    }
  }

  gGlobalInfo.gPlayerId ++;
  d[playerName] = {password: data.password,
    playerId: gGlobalInfo.gPlayerId};

  var self = this;
  if(!self.isSavingMutex) {
    self.isSavingMutex = true;

    var tmpGFile = gDataDir + gGlobalFile;
    // var tmpStr = util.inspect(gGlobalInfo, {depth: null});
    var tmpStr = JSON.stringify(gGlobalInfo);
    fs.writeFile(tmpGFile, tmpStr, function() {
      self.isSavingMutex = false;
    });
  }

  return gGlobalInfo.gPlayerId;
};
