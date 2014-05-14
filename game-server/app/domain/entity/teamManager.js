var consts = require('../../consts/consts');
var utils = require('../../util/utils');


function TeamManager(roomObj) {
  this.scoreDict = [0, 0];
  this.roomObj = roomObj;
};

// + or - score
TeamManager.prototype.updateScore = function(teamId, score) {
  var d = this.scoreDict;
  if(d[teamId] >= 0) {
    d[teamId] += parseInt(score);
    d[teamId] = Math.max(0, d[teamId])
  }
};

TeamManager.prototype.getScoreDict = function() {
  return this.scoreDict;
};

TeamManager.prototype.recalcScore = function(playerDataArray) {
  this.scoreDict = [0, 0];
  var arr = playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    var cL = utils.extractBuildingColors(o.buildings);
    if(cL.length === consts.ROOM.MAX_COLOR_NUM) {
      // five colors
      o.score += 2;
    }
    this.scoreDict[o.teamId] += o.score;
    var infoDict = {playerId: o.playerId, seatNum: o.seatNum, score: o.score};
    this.roomObj.channel.pushMessage('onUpdatePlayerScore', infoDict, null);
  }
};

TeamManager.prototype.getWinner = function() {
  var d = this.scoreDict;
  if(d[0] > d[1]) {
    return consts.ROOM.WINNER_INDEX.TEAM_A;
  } else if(d[0] === d[1]) {
    return consts.ROOM.WINNER_INDEX.DRAW;
  } else {
    return consts.ROOM.WINNER_INDEX.TEAM_B;
  }
};

/**
 * Expose 'TeamManager' constructor.
 */
module.exports = TeamManager;