var consts = require('../../consts/consts');
var rIds = consts.ROOM.ROLE_ID;
var util = require('util');
var utils = require('../../util/utils');
var events = require('events');


var gRoleList = [rIds.ASSASSIN, rIds.THIEF, rIds.MAGICIAN, rIds.KING, rIds.WARLORD];

var SKILL_PREFIX = 'SKILL_';
var CONSTRUCT_PREFIX = 'CONSTRUCT_';

////////////////////////////////////////////////

function Skill(roomObj, playerDataArray, i) {
  events.EventEmitter.call(this);
  this.roomObj = roomObj;
  this.playerDataArray = playerDataArray;
  this.playerObj = this.playerDataArray[i];
  this.roleId = this.playerObj.roleId;
  this.skillId = SKILL_PREFIX + this.roleId;
  this.constructId = CONSTRUCT_PREFIX + this.roleId;
}

util.inherits(Skill, events.EventEmitter);

// handle effect
// Skill.prototype.trigger = function(targetId, extraParam) {
Skill.prototype.trigger = function(data) {
  // utils.myPrint('this.skillId = ', this.skillId);
  if(this.skillId) {
    // this.emit(this.skillId, targetId, extraParam);
    this.emit(this.skillId, data);
    return true;
  }
};

Skill.prototype.notifyFail2Do = function(route) {
  if(this.playerObj.isRobot) {
    return;
  }

  var playerId = this.playerObj.playerId;
  var sid = this.roomObj.channel.getMember(playerId)['sid'];
  this.roomObj.channelService.pushMessageByUids(route, {}, [{
    uid: playerId,
    sid: sid
  }]);
};

Skill.prototype.handleEffect = function() {
  // effect handler: virtual interface
};

////////////////////////////////////////////////

// kill a role
function SkillKill(roomObj, playerDataArray, i) {
  Skill.call(this, roomObj, playerDataArray, i);
}

util.inherits(SkillKill, Skill);

// SkillKill.prototype.handleEffect = function(targetRoleId) {
SkillKill.prototype.handleEffect = function(data) {
  var targetRoleId = data.targetRoleId;
  // utils.myPrint('data = ', JSON.stringify(data));
  // utils.myPrint('typeof targetRoleId = ', typeof targetRoleId);

  var killIdList = this.roomObj.roleSet.getKillAvailableIdList();
  var killedRoleId = parseInt(targetRoleId);
  // utils.myPrint('killIdList = ', killIdList);
  // utils.myPrint('killedRoleId = ', killedRoleId);
  if(killIdList.indexOf(killedRoleId) > -1) {
    var ret = this.roomObj.roleSet.setKilledId(killedRoleId);
    if(ret) {
      this.playerObj.usedSkillFlag = true;
      var infoDict = {killedRoleId: killedRoleId};
      this.roomObj.channel.pushMessage('onKillRoleNotify', infoDict, null);
    }
    return ret;
  }
};

////////////////////////////////////////////////

// steal a role
function SkillSteal(roomObj, playerDataArray, i) {
  Skill.call(this, roomObj, playerDataArray, i);
}

util.inherits(SkillSteal, Skill);

// SkillSteal.prototype.handleEffect = function(targetRoleId) {
SkillSteal.prototype.handleEffect = function(data) {
  var targetRoleId = data.targetRoleId;
  var stealIdList = this.roomObj.roleSet.getStealAvailableIdList();
  var stolenRoleId = parseInt(targetRoleId);
  if(stealIdList.indexOf(stolenRoleId) > -1) {
    var ret = this.roomObj.roleSet.setStolenId(stolenRoleId);
    if(ret) {
      this.playerObj.usedSkillFlag = true;
      var infoDict = {stolenRoleId: stolenRoleId};
      this.roomObj.channel.pushMessage('onStealRoleNotify', infoDict, null);
    }
    return ret;
  }
};

////////////////////////////////////////////////

// exchange card
function SkillExchangeCard(roomObj, playerDataArray, i) {
  Skill.call(this, roomObj, playerDataArray, i);
}

util.inherits(SkillExchangeCard, Skill);

// SkillExchangeCard.prototype.handleEffect = function(targetPlayerId, withSysFlag) {
SkillExchangeCard.prototype.handleEffect = function(data) {
  var targetPlayerId = data.targetPlayerId;
  var withSysFlag = data.withSysFlag;
  if(withSysFlag) {
    var o = this.playerObj;
    var bpNum = o.blueprints.length;

    for(var j in o.blueprints) {
      this.roomObj.returnBlueprint2set(o.blueprints[j]);
    }
    o.blueprints = [];

    for(var k = 0; k < bpNum; k++) {
      var bp = this.roomObj.getNextBlueprint();
      if(bp) {
        o.blueprints.push(bp);
      }
    }

    utils.onUpdatePlayerBlueprint(this.roomObj, o);

    o.usedSkillFlag = true;
    return true;

  } else {

    var arr = this.playerDataArray;
    var targetO = null;
    for(var i in arr) {
      var o = arr[i];
      if(o.playerId === parseInt(targetPlayerId) && (o.roleId !== consts.ROOM.ROLE_ID.MAGICIAN)) {
        targetO = o;
        break;
      }
    }
    var o = this.playerObj;
    if(this.roomObj.curRoleId !== o.roleId) {
      return;
    }
    // utils.myPrint('targetPlayerId = ', targetPlayerId);
    if(o.usedSkillFlag) {
      return;
    }
    if(!!targetO) {
      var tmpBps = o.blueprints;
      o.blueprints = targetO.blueprints;
      targetO.blueprints = tmpBps;

      // MAGICIAN
      utils.onUpdatePlayerBlueprint(this.roomObj, o);
      // target player
      utils.onUpdatePlayerBlueprint(this.roomObj, targetO);

      o.usedSkillFlag = true;

      this.roomObj.channel.pushMessage('onExchangeWithPlayerNotify', {}, null);

      return true;
    }
  }
};

////////////////////////////////////////////////

// get crown
function SkillGetCrown(roomObj, playerDataArray, i) {
  Skill.call(this, roomObj, playerDataArray, i);
}

util.inherits(SkillGetCrown, Skill);

SkillGetCrown.prototype.handleEffect = function() {
  var oldCrownIdx = this.roomObj.crownIdx;
  var arr = this.playerDataArray;
  this.roomObj.crownIdx = this.playerObj.seatNum;
  // utils.myPrint('oldCrownIdx, crownIdx = ', oldCrownIdx, this.roomObj.crownIdx);
  // sync crown
  if(oldCrownIdx !== this.roomObj.crownIdx) {
    var infoObjDict = {};
    for(var i in arr) {
      var o = arr[i];
      var crownFlag = (this.roomObj.crownIdx === o.seatNum);
      infoObjDict[o.playerId] = {seatNum: o.seatNum, crownFlag: crownFlag};
    }
    this.roomObj.channel.pushMessage('onUpdateCrownStatus', infoObjDict, null);
    // throne hall effect
    this.roomObj.triggerAllEffect(consts.ROOM.EFFECT_TRIGGER_TIMING.THRONE_CHANGE);
  }
};

////////////////////////////////////////////////

// dismantle building
function SkillDismantle(roomObj, playerDataArray, i) {
  Skill.call(this, roomObj, playerDataArray, i);
}

util.inherits(SkillDismantle, Skill);

SkillDismantle.prototype.notifyFail2Do = function() {
  Skill.prototype.notifyFail2Do.call(this, 'onNotifyFail2Dismantle');
};

// SkillDismantle.prototype.handleEffect = function(targetPlayerId, bdId) {
SkillDismantle.prototype.handleEffect = function(data) {
  var targetPlayerId = data.targetPlayerId;
  var bdId = parseInt(data.bdId);
  var arr = this.playerDataArray;
  if(this.playerObj.usedSkillFlag) {
    return this.notifyFail2Do();
  }

  for(var i in arr) {
    var o = arr[i];
    if(o.playerId === parseInt(targetPlayerId)) {
      // bishop's building can't be dismantled
      if(o.roleId === consts.ROOM.ROLE_ID.BISHOP) {
        return this.notifyFail2Do();
      }
      for(var j in o.buildings) {
        var bd = o.buildings[j];
        if(bdId === bd.id) {
          // building fort can't be dismantled
          if(!!bd.canBeDismantled && !bd.canBeDismantled()) {
            return this.notifyFail2Do();
          }
          // utils.myPrint('data = ', JSON.stringify(data));
          // utils.myPrint('playerObj.coin = ', this.playerObj.coin);
          // utils.myPrint('bd.card.cost = ', bd.card.cost);
          this.roomObj.triggerAllEffect(consts.ROOM.EFFECT_TRIGGER_TIMING.WALL, o.playerId);
          var costNum = bd.card.dismantleCost;
          if(this.playerObj.coin >= costNum) {
            this.playerObj.coin -= costNum;
            this.roomObj.bank.deposit(costNum);
            utils.onUpdatePlayerCoin(this.roomObj, this.playerObj);

            this.playerObj.usedSkillFlag = true;

            o.buildings.splice(j, 1);
            o.buildings.push(bd);
            var lastBd = o.buildings[o.buildings.length-1];
            lastBd.isDismantled = true;

            o.score -= bd.card.cost;
            this.roomObj.teamManager.updateScore(o.teamId, -bd.card.cost);
            utils.onUpdatePlayerBuilding(this.roomObj, o);

            this.roomObj.triggerAllEffect(consts.ROOM.EFFECT_TRIGGER_TIMING.WALL, o.playerId);

            if(!!bd.removeEffectId && !!bd.handleRemoveEffect) {
              this.roomObj.removeAllEffect(consts.ROOM.EFFECT_TRIGGER_TIMING.WALL, o.playerId);
            }

            o.buildings.pop();

            return true;
          }
        }
      }
    }
  }

  return this.notifyFail2Do();
};

////////////////////////////////////////////////

var giveSkill2role = function(roomObj, playerDataArray, i) {
  var o = playerDataArray[i];
  switch(o.roleId)
  {
    case rIds.ASSASSIN:
      return new SkillKill(roomObj, playerDataArray, i);

    case rIds.THIEF:
      return new SkillSteal(roomObj, playerDataArray, i);

    case rIds.MAGICIAN:
      return new SkillExchangeCard(roomObj, playerDataArray, i);

    case rIds.KING:
      return new SkillGetCrown(roomObj, playerDataArray, i);

    case rIds.WARLORD:
      return new SkillDismantle(roomObj, playerDataArray, i);

    default:
      return null;
  }
};

////////////////////////////////////////////////
// construct building
function SkillConstruct(roomObj, playerDataArray, i) {
  Skill.call(this, roomObj, playerDataArray, i);
}

util.inherits(SkillConstruct, Skill);

SkillConstruct.prototype.doIt = function(data) {
  if(this.constructId) {
    this.emit(this.constructId, data);
    return true;
  }
};

SkillConstruct.prototype.notifyFail2Do = function() {
  Skill.prototype.notifyFail2Do.call(this, 'onNotifyFail2Construct');
};

SkillConstruct.prototype.handleConstruct = function(blueprintId) {
  var o = this.playerObj;
  if(this.roomObj.curRoleId !== o.roleId) {
    return this.notifyFail2Do();
  }
  o.constructNum = o.constructNum | 0;
  if(o.roleId === consts.ROOM.ROLE_ID.ARCHITECT) {
    if(o.constructNum >= consts.ROOM.CONSTRUCT_NUM_FOR_ARCHITECT) {
      return this.notifyFail2Do();
    }
  } else {
    if(o.constructNum >= consts.ROOM.CONSTRUCT_NUM_FOR_COMMON) {
      return this.notifyFail2Do();
    }
  }
  // max building limit
  if(o.buildings.length >= consts.ROOM.MAX_BUILDING_NUM) {
    return this.notifyFail2Do();
  }
  var bpId = parseInt(blueprintId);
  for(var j in o.blueprints) {
    var bp = o.blueprints[j];
    if(bpId === bp.id) {
      if(bp.card.cost <= o.coin) {
        o.constructNum += 1;

        o.coin -= bp.card.cost;
        this.roomObj.bank.deposit(bp.card.cost);

        o.blueprints.splice(j, 1);
        o.buildings.push(bp);
        o.score += bp.card.cost;
        // add/remove blueprint effect
        if(!!bp.effectId) {
          bp.setPlayer(o);
          bp.setRoomObj(this.roomObj);
          bp.on(bp.effectId, bp.handleEffect);
          if(!!bp.removeEffectId && !!bp.handleRemoveEffect) {
            bp.on(bp.removeEffectId, bp.handleRemoveEffect);
          }
        }
        var lastBd = o.buildings[o.buildings.length-1];
        lastBd.isNewFlag = true;

        this.roomObj.teamManager.updateScore(o.teamId, bp.card.cost);
        utils.onUpdatePlayerBuilding(this.roomObj, o);

        lastBd.isNewFlag = false;

        var d = {seatNum: o.seatNum};
        this.roomObj.channel.pushMessage('onConstructBuildingNotify', d, null);

        if(bp.card.typeId === consts.ROOM.BLUEPRINT_TYPE_ID.LIGHTHOUSE) {
          // building lighthouse effect
          this.roomObj.triggerAllEffect(consts.ROOM.EFFECT_TRIGGER_TIMING.LIGHTHOUSE, o.playerId);
        }
        return true;
      }
      break;
    }
  }
  return this.notifyFail2Do();
};

////////////////////////////////////////////////

var SkillSet = function(roomObj, playerDataArray) {
  this.playerDataArray = playerDataArray;

  var arr = this.playerDataArray;
  for(var i in arr) {
    var o = arr[i];
    o.skill = null;
    if(gRoleList.indexOf(o.roleId) > -1) {
      var s = giveSkill2role(roomObj, this.playerDataArray, i);
      // utils.myPrint('roleId = ', o.roleId);
      // utils.myPrint('s = ', s);
      if(!!s) {
        s.on(s.skillId, s.handleEffect);
        o.skill = s;
      }
    }

    var c = new SkillConstruct(roomObj, this.playerDataArray, i);
    c.on(c.constructId, c.handleConstruct);
    o.construct = c;
  }
};

/**
 * Expose 'SkillSet' constructor.
 */
module.exports = SkillSet;

