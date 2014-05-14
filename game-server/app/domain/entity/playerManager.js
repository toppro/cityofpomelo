var consts = require('../../consts/consts');
var utils = require('../../util/utils');


var START_UP_COIN = 2
  , START_UP_BLUEPRINT_NUM = 4
  , ONE_ROUND_COIN = 2
  , ALTERNATIVE_BLUEPRINT_NUM = 3;

var ROLE_COLOR_MAP = {
  4: consts.ROOM.COLOR.GOLDEN,
  5: consts.ROOM.COLOR.BLUE,
  6: consts.ROOM.COLOR.GREEN,
  8: consts.ROOM.COLOR.RED
};


function PlayerManager(roomObj, memberNum) {
  this.roomObj = roomObj;
  this.playerDataArray = new Array(memberNum);
  this.playerNum = 0;
  this.curSeatNum = 1;
  this.timerList = [];

  var arr = this.playerDataArray;
  for(var i = 0; i < arr.length; ++i) {
    arr[i] = {playerId: consts.ROOM.PLAYER_ID_NONE,
      playerName: consts.ROOM.PLAYER_NAME_NONE, seatNum: consts.ROOM.SEAT_ID_NONE,
      serverId: consts.ROOM.SERVER_ID_NONE, roleId: consts.ROOM.ROOM_ID_NONE,
      teamId: consts.ROOM.TEAM_ID_NONE, buildings: [], blueprints: [], coin: 0, score: 0};
  }
}

PlayerManager.prototype.addPlayer = function(data, cb) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    if(arr[i].playerId === consts.ROOM.PLAYER_ID_NONE) {
      arr[i] = {playerId: data.playerId, playerName: data.playerName,
        seatNum: this.curSeatNum, serverId: data.serverId,
        roleId: consts.ROOM.ROOM_ID_NONE, isRobot: data.isRobot,
        teamId: consts.ROOM.TEAM_ID_NONE, buildings: [], blueprints: [], coin: 0, score: 0};

      if(this.playerNum < consts.ROOM.MAX_MEMBER_NUM) {
        this.playerNum ++;
        this.curSeatNum ++;
      }

      var ret = {roomId: this.roomObj.roomId, seatNum: arr[i].seatNum};
      utils.invokeCallback(cb, ret);
      return true;
    }
  }
  return false;
};

// player num in the room
PlayerManager.prototype.getPlayerNum = function() {
  return this.playerNum;
};

// is there a empty position in the room
PlayerManager.prototype.isRoomHasPosition = function() {
  return this.getPlayerNum() < consts.ROOM.MAX_MEMBER_NUM;
};

// are there MAX_MEMBER_NUM members in the room
PlayerManager.prototype.isRoomFull = function() {
  return this.getPlayerNum() >= consts.ROOM.MAX_MEMBER_NUM;
};

PlayerManager.prototype.kick = function(playerId) {
  // utils.myPrint('playerId = ', playerId);
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId !== consts.ROOM.PLAYER_ID_NONE && o.playerId === playerId) {
      // utils.myPrint('playerName = ', o.playerName);
      arr[i] = {playerId: consts.ROOM.PLAYER_ID_NONE,
        playerName: consts.ROOM.PLAYER_NAME_NONE,
        seatNum: consts.ROOM.SEAT_ID_NONE,
        serverId: consts.ROOM.SERVER_ID_NONE, roleId: consts.ROOM.ROOM_ID_NONE,
        teamId: consts.ROOM.TEAM_ID_NONE, buildings: [], blueprints: [], coin: 0, score: 0};

      this.playerNum = Math.max(this.playerNum - 1, 0);
      return true;
    }
  }
};

PlayerManager.prototype.replaceWithRobot = function(playerId) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId !== consts.ROOM.PLAYER_ID_NONE && o.playerId === playerId) {
      o.isRobot = true;
      return true;
    }
  }
};

PlayerManager.prototype.isPlayerInRoom = function(playerId) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    if(arr[i].playerId !== consts.ROOM.PLAYER_ID_NONE && arr[i].playerId === playerId) {
      return true;
    }
  }
  return false;
};

PlayerManager.prototype.getPlayerNameById = function(playerId) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId !== consts.ROOM.PLAYER_ID_NONE && o.playerId === playerId) {
      return o.playerName;
    }
  }
  return '';
};

PlayerManager.prototype.initData4game = function() {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId !== consts.ROOM.PLAYER_ID_NONE) {
      var v = o.seatNum % 2;
      if(v === 1) {
        o.teamId = consts.ROOM.WINNER_INDEX.TEAM_A;
      } else {
        o.teamId = consts.ROOM.WINNER_INDEX.TEAM_B;
      }
      o.buildings = [];
      o.blueprints = [];
      for(var j = 0; j < START_UP_BLUEPRINT_NUM; j++) {
        var bp = this.roomObj.getNextBlueprint();
        if(bp) {
          o.blueprints.push(bp);
        }
      }
      o.coin = this.roomObj.bank.withdraw(START_UP_COIN);
      o.score = 0;
    }
  }
};

PlayerManager.prototype.initData4client = function() {
  var arr = this.playerDataArray;
  var infoObjDict = {};
  for (var i in arr) {
    var o = arr[i];
    var playerId = o.playerId;
    if(playerId === consts.ROOM.PLAYER_ID_NONE) {
      continue;
    }
    var crownFlag = (this.roomObj.crownIdx === o.seatNum);
    var bps = utils.extractBlueprintData(o.blueprints);
    infoObjDict[playerId] = {playerName: o.playerName, seatNum: o.seatNum, coin: o.coin, blueprintNum: o.blueprints.length, score: o.score, blueprints: bps, crownFlag: crownFlag};
  }
  this.roomObj.channel.pushMessage('onInitAllPlayerData', infoObjDict, null);
  this.roomObj.bank.updateBank();
};

PlayerManager.prototype.isRobotPlayer = function(playerObj) {
  return playerObj.isRobot;
};


PlayerManager.prototype.isEmptyPosition = function(playerObj) {
  return (playerObj.playerName === consts.ROOM.PLAYER_NAME_NONE);
};

PlayerManager.prototype.getRealPlayerNum = function() {
  var tmpNum = 0;
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    var isRobot = this.isRobotPlayer(o);
    var isEmpty = this.isEmptyPosition(o);
    // utils.myPrint('playerName = ', arr[i].playerName);
    if(!isRobot && !isEmpty) {
      tmpNum++;
    }
  }
  // utils.myPrint('tmpNum = ', tmpNum);
  return tmpNum;
};

PlayerManager.prototype.getCrownIdx = function() {
  var arr = this.playerDataArray;
  for (var i in arr) {
    var o = arr[i];
    if (this.roomObj.crownIdx === o.seatNum) {
      return i;
    }
  }
  return -1;
};

PlayerManager.prototype.startEmployRole = function(idx) {
  var arr = this.playerDataArray;
  var o = arr[idx];
  if(!o) {
    return;
  }
  var isRobot = this.isRobotPlayer(o);
  if(isRobot) {
    var availableIdList = this.roomObj.roleSet.getAvailableIdList4select();
    var len = availableIdList.length;
    var rnd = Math.floor(Math.random() * len);
    var roleId = availableIdList[rnd];

    /*
    // testing code
    if(idx === 1 && availableIdList.indexOf(7) > -1) {
      roleId = 7;
    }
    // testing code
    */

    this.selectRoleId(o.playerId, roleId);
  } else {
    var availableIdList4select = this.roomObj.roleSet.getAvailableIdList4select();
    var obj = {playerId: o.playerId, playerName: o.playerName, seatNum: o.seatNum, availableIdList4select: availableIdList4select};
    this.roomObj.channel.pushMessage('onEmployRole', obj, null);
  }
};

PlayerManager.prototype.selectRoleId = function(playerId, roleId) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === playerId) {
      o.roleId = roleId;

      var ret = this.roomObj.roleSet.selectRoleId(roleId);
      if(ret) {
        var c = ROLE_COLOR_MAP[o.roleId];
        if(c) {
          var taxesCnt = 0;
          for(var j in o.buildings) {
            var bd = o.buildings[j];
            if(bd.card.color === c) {
              taxesCnt += 1;
            }
          }
          o.taxesCnt = taxesCnt;
        }
        // notify clients to hide EmployRoleLayer
        var isRobot = this.isRobotPlayer(o);
        if(!isRobot) {
          this.roomObj.channel.pushMessage('onHideEmployRoleLayer', {}, null);
        }

        this.selectRoleNum++;
        // utils.myPrint('selectRoleNum = ', this.selectRoleNum);
        // utils.myPrint('i = ', i);

        var self = this;
        if(this.selectRoleNum < consts.ROOM.MAX_MEMBER_NUM) {
          i = (parseInt(i) + 1) % consts.ROOM.MAX_MEMBER_NUM;
          process.nextTick(function() {
            self.startEmployRole(i);
          });
        } else {
          this.roomObj.resetAllSkills();
          this.timerList[2] = setTimeout(function() {
            self.comeOnStage1by1(self.roomObj.curRoleId);
          }, 100);
        }
      }

      return ret;
    }
  }
};

PlayerManager.prototype.checkCurRoleId = function(playerId) {
  playerId = parseInt(playerId);
  if(playerId === 0) {
    return true;
  }
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === playerId) {
      if(o.roleId !== this.roomObj.curRoleId) {
        return false;
      } else {
        return true;
      }
    }
  }
};

PlayerManager.prototype.queenGet3coins = function(i, o) {
  if(o.roleId !== consts.ROOM.ROLE_ID.QUEEN) {
    return;
  }
  // utils.myPrint('i = ', i);
  i = parseInt(i);
  var left = (i - 1 + consts.ROOM.MAX_MEMBER_NUM) % consts.ROOM.MAX_MEMBER_NUM;
  var right = (i + 1) % consts.ROOM.MAX_MEMBER_NUM;
  var arr = this.playerDataArray;
  // utils.myPrint('arr[left].roleId = ', arr[left].roleId);
  // utils.myPrint('arr[right].roleId = ', arr[right].roleId);
  if((arr[left].roleId === consts.ROOM.ROLE_ID.KING) || (arr[right].roleId === consts.ROOM.ROLE_ID.KING)) {
    o.coin += this.roomObj.bank.withdraw(consts.ROOM.QUEEN_EXTRA_COIN_NUM);
    // utils.myPrint('o.coin = ', o.coin);
  }
};

PlayerManager.prototype.comeOnStage1by1 = function(roleId) {
  // utils.myPrint('comeOnStage1by1 ~ roleId = ', roleId);
  var arr = this.playerDataArray;
  if(!(roleId >= consts.ROOM.ROLE_ID.ASSASSIN && roleId <= consts.ROOM.ROLE_ID.QUEEN)) {
    return;
  }
  var infoDict = {roleId: roleId, isKilledFlag: false};
  var killedId = this.roomObj.roleSet.getKilledId();
  var stolenId = this.roomObj.roleSet.getStolenId();
  var stolenCoinNum = 0;
  var isRobotFlag = true;
  var isKilledFlag = true;
  for(var i in arr) {
    var o = arr[i];
    if(o.roleId === roleId) {
      isKilledFlag = (o.roleId === killedId);
      var isStolenFlag = (o.roleId === stolenId);
      infoDict.playerId = o.playerId;
      infoDict.seatNum = o.seatNum;

      if(isStolenFlag) {
        stolenCoinNum = o.coin;
        o.coin = 0;
      }
      if(!isKilledFlag) {
        // queen: extra 3 coins
        this.queenGet3coins(i, o);
      }
      isRobotFlag = this.isRobotPlayer(o);
      if(isRobotFlag) {
        if(!isKilledFlag) {
          if(o.blueprints.length <= 0) {
            var tmpBpNum = consts.ROOM.CONSTRUCT_NUM_FOR_COMMON;
            if(o.roleId === consts.ROOM.ROLE_ID.ARCHITECT) {
              tmpBpNum = consts.ROOM.CONSTRUCT_NUM_FOR_ARCHITECT;
            }
            for(var j = 0; j < tmpBpNum; j++) {
              var bp4Robot = this.roomObj.getNextBlueprint();
              o.blueprints.push(bp4Robot);
            }
            utils.onUpdatePlayerBlueprint(this.roomObj, o);
          } else {
            o.coin += this.roomObj.bank.withdraw(ONE_ROUND_COIN);
          }
          this.doAction4robot({playerId: o.playerId});
        }
      } else {
        if(!isKilledFlag) {
          for(var j = 0; j < ALTERNATIVE_BLUEPRINT_NUM; j++) {
            var bp = this.roomObj.getNextBlueprint();
            if(bp) {
              this.roomObj.alternativeBlueprint.push(bp);
            }
          }
        }
        infoDict.blueprints = utils.extractBlueprintData(this.roomObj.alternativeBlueprint);
      }
      infoDict.coin = o.coin;
      infoDict.taxesCnt = o.taxesCnt;

      infoDict.isKilledFlag = isKilledFlag;
      infoDict.isStolenFlag = isStolenFlag;

      if(o.roleId === consts.ROOM.ROLE_ID.KING) {
        if(!!o.skill) {
          o.skill.trigger();
        }
      }

      break;
    }
  }
  // utils.myPrint('infoDict = ', JSON.stringify(infoDict));
  this.roomObj.channel.pushMessage('onComeOnStage', infoDict, null);

  if(stolenCoinNum > 0) {
    for(var i in arr) {
      var o = arr[i];
      if(o.roleId === consts.ROOM.ROLE_ID.THIEF) {
        o.coin += stolenCoinNum;
        utils.onUpdatePlayerCoin(this.roomObj, o);
      }
    }
  }

  // utils.myPrint('infoDict = ', JSON.stringify(infoDict));

  // do action for robot or killed player
  if(isRobotFlag || isKilledFlag) {
    roleId ++;
    if(roleId > consts.ROOM.ROLE_ID.QUEEN) {
      this.timerList[1] = setTimeout(this.roomObj.allRoleRoundEnd.bind(this.roomObj), consts.ROOM.ROBOT_TIMEOUT, roleId);
    } else {
      this.timerList[0] = setTimeout(this.roomObj.comeOnStage1by1.bind(this.roomObj), consts.ROOM.ROBOT_TIMEOUT, roleId);
    }
  }
};

PlayerManager.prototype.clearAllTimers = function() {
  var L = this.timerList;
  for(var i in L) {
    if(L[i]) {
      clearTimeout(L[i]);
    }
  }
  this.timerList = [];
};

PlayerManager.prototype.triggerAllEffect = function(triggerTiming, playerId) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(!!playerId && o.playerId !== playerId) {
      continue;
    }
    for(var j in o.buildings) {
      var bd = o.buildings[j];
      bd.triggerEffect(triggerTiming);
    }
  }
};

PlayerManager.prototype.removeAllEffect = function(triggerTiming, playerId) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(!!playerId && o.playerId !== playerId) {
      continue;
    }
    for(var j in o.buildings) {
      var bd = o.buildings[j];
      bd.removeEffect(triggerTiming);
    }
  }
};

PlayerManager.prototype.getGameOverFlag = function() {
  var arr = this.playerDataArray;
  var bdNumDict = [0, 0];
  var gameOverFlag = false;
  var winBdNum = consts.ROOM.WIN_GAME_BUILDING_NUM;
  if(this.roomObj.isRobotInRoom()) {
    winBdNum = consts.ROOM.WIN_GAME_BUILDING_NUM4ROBOT;
  }
  for(var i in arr) {
    var o = arr[i];
    bdNumDict[o.teamId] += o.buildings.length;
    if(bdNumDict[o.teamId] >= winBdNum) {
      gameOverFlag = true;
      break;
    }
  }
  return gameOverFlag;
};

PlayerManager.prototype.constructBuilding = function(msg) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId)) {
      return o.construct.doIt(msg.blueprintId);
    }
  }
};

PlayerManager.prototype.selectCoin = function(msg) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId)) {
      // utils.myPrint('curRoleId = ', this.roomObj.curRoleId);
      // utils.myPrint('o.roleId = ', o.roleId);
      if(this.roomObj.curRoleId !== o.roleId) {
        return;
      }
      for(var j in this.roomObj.alternativeBlueprint) {
        var bp = this.roomObj.alternativeBlueprint[j];
        this.roomObj.returnBlueprint2set(bp);
      }
      this.roomObj.alternativeBlueprint = [];

      o.coin += this.roomObj.bank.withdraw(ONE_ROUND_COIN);

      if(o.roleId === consts.ROOM.ROLE_ID.MERCHANT) {
        o.coin += this.roomObj.bank.withdraw(1);
      }

      utils.onUpdatePlayerCoin(this.roomObj, o);
      return true;
    }
  }
};

PlayerManager.prototype.selectBlueprint = function(msg) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId)) {
      if(this.roomObj.curRoleId !== o.roleId) {
        return;
      }
      // utils.myPrint('msg = ', JSON.stringify(msg));
      var idL = msg.blueprintIdList;
      for(var j in this.roomObj.alternativeBlueprint) {
        var bp = this.roomObj.alternativeBlueprint[j];
        if(idL.indexOf(bp.id) > -1) {
          var bps = o.blueprints;
          if(bps.length < consts.ROOM.MAX_BLUEPRINT_NUM_IN_HAND) {
            bps.push(bp);
          } else {
            this.roomObj.returnBlueprint2set(bp);
          }
        } else {
          this.roomObj.returnBlueprint2set(bp);
        }
      }

      this.roomObj.alternativeBlueprint = [];
      utils.onUpdatePlayerBlueprint(this.roomObj, o);
      return true;
    }
  }
};

PlayerManager.prototype.getKillOrStealIdList = function(msg) {
  var arr = this.playerDataArray;
  // testing code
  var tmpRoleIdL = [];
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId !== parseInt(msg.playerId)) {
      tmpRoleIdL.push(o.roleId);
    }
  }
  utils.myPrint('All roles can be killed/stolen: ', tmpRoleIdL);
  // testing code

  var roleId = parseInt(msg.roleId);
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId) && o.roleId === roleId) {
      if(this.roomObj.curRoleId !== o.roleId) {
        return;
      }
      var killOrStealIdList = [];
      if(o.usedSkillFlag) {
        return killOrStealIdList;
      }
      var crownFlag = (this.roomObj.crownIdx === o.seatNum);
      if(roleId === consts.ROOM.ROLE_ID.ASSASSIN) {
        killOrStealIdList = this.roomObj.roleSet.getKillAvailableIdList(crownFlag);
      } else if(roleId === consts.ROOM.ROLE_ID.THIEF) {
        killOrStealIdList = this.roomObj.roleSet.getStealAvailableIdList(crownFlag);
      }
      return killOrStealIdList;
    }
  }
};

PlayerManager.prototype.kill = function(msg) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId) && o.roleId === consts.ROOM.ROLE_ID.ASSASSIN) {
      if(this.roomObj.curRoleId !== o.roleId) {
        return;
      }
      if(o.usedSkillFlag) {
        return;
      }
      // utils.myPrint('o.skill = ', o.skill);
      if(!!o.skill) {
        var d = {targetRoleId: msg.targetRoleId};
        return o.skill.trigger(d);
      }
    }
  }
};

PlayerManager.prototype.steal = function(msg) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId) && o.roleId === consts.ROOM.ROLE_ID.THIEF) {
      if(this.roomObj.curRoleId !== o.roleId) {
        return;
      }
      if(o.usedSkillFlag) {
        return;
      }
      if(!!o.skill) {
        var d = {targetRoleId: msg.targetRoleId};
        return o.skill.trigger(d);
      }
    }
  }
};

PlayerManager.prototype.exchangeCard = function(msg, withSysFlag) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId) && (o.roleId === consts.ROOM.ROLE_ID.MAGICIAN)) {
      if(o.usedSkillFlag) {
        return;
      }
      if(!!o.skill) {
        var d = {targetPlayerId: msg.targetId, withSysFlag: withSysFlag};
        return o.skill.trigger(d);
      }
    }
  }
};

PlayerManager.prototype.dismantleBuilding = function(msg) {
  var arr = this.playerDataArray;

  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId) && o.roleId === consts.ROOM.ROLE_ID.WARLORD) {
      if(this.roomObj.curRoleId !== o.roleId) {
        return;
      }
      if(!!o.skill) {
        var d = {targetPlayerId: msg.targetId, bdId: msg.buildingId};
        return o.skill.trigger(d);
      }
    }
  }
};

PlayerManager.prototype.collectTaxes = function(msg) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId)) {
      if(this.roomObj.curRoleId !== o.roleId) {
        return;
      }
      var c = ROLE_COLOR_MAP[o.roleId];
      if(!c) {
        return false;
      }
      if(o.collectTaxesFlag) {
        return false;
      }
      o.collectTaxesFlag = true;

      if(o.taxesCnt > 0) {
        o.coin += o.taxesCnt;
        utils.onUpdatePlayerCoin(this.roomObj, o);
      }
      return true;
    }
  }
};

PlayerManager.prototype.doAction4robot = function(msg) {
  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(msg.playerId)) {
      if(!this.isRobotPlayer(o)) {
        return;
      }
      // construct some buildings
      var bpIds = [];
      for(var j in o.blueprints) {
        var bp = o.blueprints[j];
        bpIds.push(bp.id);
      }
      for(var k in bpIds) {
        o.construct.doIt(bpIds[k]);
      }

      // use skill
      if(o.roleId === consts.ROOM.ROLE_ID.ASSASSIN || o.roleId === consts.ROOM.ROLE_ID.THIEF) {
        var stealIdList = this.roomObj.roleSet.getStealAvailableIdList();
        var rnd = Math.floor(Math.random() * stealIdList.length);
        if(!!o.skill) {
          var d = {targetRoleId: stealIdList[rnd]};
          o.skill.trigger(d);
        }
      } else {
        /*
        var tmpL = Object.keys(arr);
        tmpL.splice(i, 1);
        */
        i = parseInt(i);
        var tmpL = [(i+1)%consts.ROOM.MAX_MEMBER_NUM, (i+3)%consts.ROOM.MAX_MEMBER_NUM, (i+5)%consts.ROOM.MAX_MEMBER_NUM];
        // utils.myPrint('tmpL = ', JSON.stringify(tmpL));
        var rnd = Math.floor(Math.random() * tmpL.length * 1);
        // utils.myPrint('rnd = ', rnd);
        // utils.myPrint('tmpL[rnd] = ', tmpL[rnd]);
        var targetO = arr[tmpL[rnd]];
        // utils.myPrint('targetO = ', targetO);
        if(targetO) {
          if(!!o.skill) {
            var bdId = (targetO.buildings.length > 0) ? targetO.buildings[0].id : -1;
            var d = {targetRoleId: targetO.roleId, targetPlayerId: targetO.playerId, withSysFlag: false, bdId: bdId};
            // utils.myPrint('o.roleId = ', o.roleId);
            // utils.myPrint('d = ', JSON.stringify(d));
            o.skill.trigger(d);
          }
        }
      }
      return true;
    }
  }
};

PlayerManager.prototype.getNameListByTeamId = function(teamId) {
  var arr = this.playerDataArray;
  var retL = [];
  for(var i in arr) {
    var o = arr[i];
    if(o.teamId === teamId) {
      retL.push(o.playerName);
    }
  }
  return retL;
};

PlayerManager.prototype.resetData = function() {
  var arr = this.playerDataArray;
  for (var i in arr) {
    var o = arr[i];
    o.collectTaxesFlag = false;
    o.constructNum = 0;
    o.usedSkillFlag = false;
    o.taxesCnt = 0;
    o.roleId = -1;
  }
  this.selectRoleNum = 0;
};


/**
 * Expose 'playerManager' constructor.
 */
module.exports = PlayerManager;

