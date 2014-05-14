var us = require('underscore');
var utils = module.exports;

// control variable of func "myPrint"
// var isPrintFlag = false;
var isPrintFlag = true;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function(cb) {
  if(!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};

/**
 * clone an object
 */
utils.clone = function(origin) {
  if(!origin) {
    return;
  }

  var obj = {};
  for(var f in origin) {
    if(origin.hasOwnProperty(f)) {
      obj[f] = origin[f];
    }
  }
  return obj;
};

utils.size = function(obj) {
  if(!obj) {
    return 0;
  }

  var size = 0;
  for(var f in obj) {
    if(obj.hasOwnProperty(f)) {
      size++;
    }
  }

  return size;
};

// print the file name and the line number ~ begin
function getStack(){
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

function getFileName(stack) {
  return stack[1].getFileName();
}

function getLineNumber(stack){
  return stack[1].getLineNumber();
}

utils.myPrint = function() {
  if (isPrintFlag) {
    var len = arguments.length;
    if(len <= 0) {
      return;
    }
    var stack = getStack();
    var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
    for(var i = 0; i < len; ++i) {
      aimStr += arguments[i] + ' ';
    }
    console.log('\n' + aimStr);
  }
};
// print the file name and the line number ~ end

utils.extractBuildingColors = function(buildings) {
  var colorL = [];
  for(var j in buildings) {
    var bp = buildings[j];
    if(!bp.isDismantled) {
      colorL.push(bp.card.color);
    }
  }
  colorL = us.uniq(colorL);
  return colorL;
};

utils.extractBuildingData = function(buildings) {
  var bdList = [];
  for(var j in buildings) {
    var bp = buildings[j];
    var desc = '';
    if(!!bp.card.specialBpClass) {
      desc = bp.card.desc;
    }
    var item = {id: bp.id, card: {typeId: bp.card.typeId, cost: bp.card.cost, desc: desc}, isNewFlag: bp.isNewFlag, isDismantled: bp.isDismantled};
    bdList.push(item);
  }
  return bdList;
};

utils.extractBlueprintData = utils.extractBuildingData;

utils.onUpdatePlayerCoin = function(roomObj, playerObj) {
  if(!(!!roomObj && !!playerObj)) {
    return;
  }
  var infoDict = {};
  infoDict.playerId = playerObj.playerId;
  infoDict.seatNum = playerObj.seatNum;
  infoDict.coin = playerObj.coin;
  roomObj.channel.pushMessage('onUpdatePlayerCoin', infoDict, null);
};

utils.onUpdatePlayerBlueprint = function(roomObj, playerObj) {
  if(!(!!roomObj && !!playerObj)) {
    return;
  }
  var infoDict = {};
  infoDict.playerId = playerObj.playerId;
  infoDict.seatNum = playerObj.seatNum;
  infoDict.blueprintNum = playerObj.blueprints.length;
  infoDict.blueprints = this.extractBlueprintData(playerObj.blueprints);
  roomObj.channel.pushMessage('onUpdatePlayerBlueprint', infoDict, null);
};

utils.onUpdatePlayerBuilding = function(roomObj, playerObj) {
  if(!(!!roomObj && !!playerObj)) {
    return;
  }
  var infoDict = {};
  infoDict.playerId = playerObj.playerId;
  infoDict.seatNum = playerObj.seatNum;
  infoDict.coin = playerObj.coin;
  infoDict.blueprintNum = playerObj.blueprints.length;
  infoDict.blueprints = utils.extractBlueprintData(playerObj.blueprints);
  infoDict.buildings = utils.extractBuildingData(playerObj.buildings);
  infoDict.colors = utils.extractBuildingColors(playerObj.buildings);
  infoDict.score = playerObj.score;
  infoDict.teamScoreDict = roomObj.teamManager.getScoreDict();
  roomObj.channel.pushMessage('onUpdatePlayerBuilding', infoDict, null);
};

