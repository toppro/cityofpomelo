/**
 * Module dependencies
 */
var consts = require('../../consts/consts');
var Event = consts.Event;
var pomelo = require('pomelo');
var utils = require('../../util/utils');
var channelUtil = require('../../util/channelUtil');
var BlueprintSet = require('../../../../shared/blueprintSet');
var RoleSet = require('../../../../shared/roleSet');
var TeamManager = require('./teamManager');
var PlayerManager = require('./playerManager');
var Bank = require('./bank');
var SkillSet = require('./skillSet');

///////////////////////////////////////////////////////
function Room(roomId, name){
  this.init4gameFlag = false;
  this.ownerId = 0;
  this.curRoleId = 0;
  this.alternativeBlueprint = [];
  this.teamManager = new TeamManager(this);
  this.playerManager = new PlayerManager(this, consts.ROOM.MAX_MEMBER_NUM);
  this.bank = new Bank(this);
  this.skillSet = null;
  // room channel, push msg within the room
  this.channel = null;
  this.roomId = roomId;
  this.name = name;
  this.channelService = pomelo.app.get('channelService');
  this.createChannel();
}

Room.prototype.createChannel = function() {
  if(this.channel) {
    return this.channel;
  }
  var channelName = channelUtil.getRoomChannelName(this.roomId);
  this.channel = this.channelService.getChannel(channelName, true);
  if(this.channel) {
    return this.channel;
  }
  return null;
};

Room.prototype.addPlayer2Channel = function(data) {
  if(!this.channel) {
    return false;
  }
  if(data) {
    this.channel.add(data.playerId, data.serverId);
    return true;
  }
  return false;
};

Room.prototype.kick = function(data) {
  if(!!this.channel && !!data) {
    this.channel.leave(data.playerId, data.serverId);
  }

  if(!this.init4gameFlag) {
    return this.playerManager.kick(data.playerId);
  } else {
    return this.playerManager.replaceWithRobot(data.playerId);
  }
};

Room.prototype.getIsEmpty = function() {
  return (this.playerManager.getRealPlayerNum() <= 0);
};

Room.prototype.getPlayerNum = function() {
  return this.playerManager.getPlayerNum();
};

Room.prototype.addPlayer = function(data, cb) {
  if(!data || typeof data !== 'object') {
    return consts.ROOM.JOIN_ROOM_RET_CODE.SYS_ERROR;
  }

  if(!this.playerManager.isRoomHasPosition()) {
    return consts.ROOM.JOIN_ROOM_RET_CODE.NO_POSITION;
  }

  if(this.playerManager.isPlayerInRoom(data.playerId)) {
    return consts.ROOM.JOIN_ROOM_RET_CODE.ALREADY_IN_ROOM;
  }

  if(!this.playerManager.addPlayer(data, cb)) {
    return consts.ROOM.JOIN_ROOM_RET_CODE.SYS_ERROR;
  }

  if(!this.playerManager.isPlayerInRoom(data.playerId)) {
    return consts.ROOM.JOIN_ROOM_RET_CODE.SYS_ERROR;
  }

  if(!this.addPlayer2Channel(data)) {
    return consts.ROOM.JOIN_ROOM_RET_CODE.SYS_ERROR;
  }

  /*
  var playerNum = this.getPlayerNum();
  this.channel.pushMessage('onUpdatePlayerNum', {num: playerNum}, null);
  */

  return consts.ROOM.JOIN_ROOM_RET_CODE.OK;
};

// the owner_id is just a player_id
Room.prototype.setOwnerId = function(ownerId) {
  this.ownerId = ownerId;
};

// realPlayerNum: real player num (not include robot)
Room.prototype.setRealPlayerNum = function(realPlayerNum) {
  this.realPlayerNum = realPlayerNum;
  // utils.myPrint('realPlayerNum = ', realPlayerNum);
};

// realPlayerNum: real player num (not include robot)
Room.prototype.getRealPlayerNum = function() {
  return this.realPlayerNum;
};

// is there any robot in the room
Room.prototype.isRobotInRoom = function() {
  return (consts.ROOM.MAX_MEMBER_NUM > this.realPlayerNum);
};

// are there MAX_MEMBER_NUM members in the room
Room.prototype.isRoomFull = function() {
  return this.playerManager.isRoomFull();
};

// push msg to all of the room members
Room.prototype.pushChatMsg2All = function(msg) {
  if(!this.channel) {
    return false;
  }
  var playerId = msg.playerId;
  var playerName = this.playerManager.getPlayerNameById(playerId);
  if(!playerName) {
    return false;
  }
  var content = playerName + ': ' + msg.text;
  this.channel.pushMessage('onChat', content, null);
  return true;
};

Room.prototype.getNextBlueprint = function() {
  // console.log('blueprintSet = ', this.blueprintSet);
  if(!!this.blueprintSet) {
    return this.blueprintSet.getNextBlueprint();
  }
  return null;
};

Room.prototype.returnBlueprint2set = function(bp) {
  // console.log('blueprintSet = ', this.blueprintSet);
  if(!!this.blueprintSet) {
    return this.blueprintSet.returnBlueprint2set(bp);
  }
  return null;
};

var getDiscardRoleIdList = function(discardNum) {
  var retList = [];
  var tmpList = [];
  var rnd = Math.floor(Math.random() * consts.ROOM.ROLE_ID.QUEEN + 1);
  // console.log('1 ~ rnd = ', rnd);
  retList.push(rnd);
  // console.log('1 ~ retList = ', retList);
  for(var i = consts.ROOM.ROLE_ID.ASSASSIN; i <= consts.ROOM.ROLE_ID.QUEEN; i++) {
    if(i !== rnd) {
      tmpList.push(i);
    }
  }
  // console.log('1 ~ tmpList = ', tmpList);

  for(var i = 0; i < discardNum - 1; i++) {
    rnd = Math.floor(Math.random() * tmpList.length);
    // console.log('%d ~ rnd = ', i, rnd);
    var arr = tmpList.splice(rnd, 1);
    // utils.myPrint('i, arr = ', i, arr);
    retList = retList.concat(arr);
    // console.log('%d ~ retList = ', i, retList);
    // console.log('%d ~ tmpList = ', i, tmpList);
  }

  return retList;
};

Room.prototype.initData4game = function() {
  this.blueprintSet = new BlueprintSet();
  this.playerManager.initData4game();

  this.crownIdx = Math.floor(Math.random() * consts.ROOM.MAX_MEMBER_NUM + 1);
  this.crownIdx = 1;

  this.roleSet = new RoleSet();
  var discardList = getDiscardRoleIdList(consts.ROOM.DISCARD_ROLE_NUM);
  this.roleSet.setDiscardRoleIdList(discardList);

  this.playerManager.initData4client();

  this.init4gameFlag = true;
};

Room.prototype.startRound = function() {
  if(!this.init4gameFlag) {
    this.initData4game();
  }
  this.playerManager.resetData();
  var idx = this.playerManager.getCrownIdx();
  this.playerManager.startEmployRole(idx);
};

Room.prototype.selectRoleId = function(playerId, roleId) {
  return this.playerManager.selectRoleId(playerId, roleId);
};

Room.prototype.resetAllSkills = function() {
  this.curRoleId = consts.ROOM.ROLE_ID.ASSASSIN;
  this.skillSet = new SkillSet(this, this.playerManager.playerDataArray);
};

Room.prototype.checkCurRoleId = function(msg) {
  return this.playerManager.checkCurRoleId(msg.playerId);
};

Room.prototype.comeOnStage1by1 = function(roleId) {
  this.curRoleId += 1;
  if(this.curRoleId !== roleId) {
    return;
  }
  this.playerManager.comeOnStage1by1(roleId);
};

Room.prototype.triggerAllEffect = function(triggerTiming, playerId) {
  this.playerManager.triggerAllEffect(triggerTiming, playerId);
};

Room.prototype.removeAllEffect = function(triggerTiming, playerId) {
  this.playerManager.removeAllEffect(triggerTiming, playerId);
};

Room.prototype.allRoleRoundEnd = function(curRoleId) {
  this.curRoleId += 1;
  if(curRoleId !== this.curRoleId) {
    return;
  }
  var gameOverFlag = this.playerManager.getGameOverFlag();
  if(gameOverFlag) {
    this.triggerAllEffect(consts.ROOM.EFFECT_TRIGGER_TIMING.GAME_OVER);
    this.teamManager.recalcScore(this.playerManager.playerDataArray);
    var teamScoreDict = this.teamManager.getScoreDict();
    var infoDict = {teamScoreDict: teamScoreDict};
    this.channel.pushMessage('onUpdateTeamScore', infoDict, null);

    var teamId = this.teamManager.getWinner();
    var winnerNameL = this.playerManager.getNameListByTeamId(teamId);
    var retDict = {teamId: teamId, winnerNameL: winnerNameL};
    this.channel.pushMessage('onGameOver', retDict, null);
  } else {
    if(this.curRoleId > consts.ROOM.ROLE_ID.QUEEN) {
      this.curRoleId = 0;

      this.roleSet.reset();
      var discardList = getDiscardRoleIdList(consts.ROOM.DISCARD_ROLE_NUM);
      this.roleSet.setDiscardRoleIdList(discardList);

      this.channel.pushMessage('onRestartRound', {}, null);

      this.startRound();
    }
  }
};

Room.prototype.constructBuilding = function(msg) {
  return this.playerManager.constructBuilding(msg);
};

// select coin
Room.prototype.selectCoin = function(msg) {
  return this.playerManager.selectCoin(msg);
};

// select blueprint
Room.prototype.selectBlueprint = function(msg) {
  return this.playerManager.selectBlueprint(msg);
};

Room.prototype.getKillOrStealIdList = function(msg) {
  var roleId = parseInt(msg.roleId);
  if(roleId !== consts.ROOM.ROLE_ID.ASSASSIN && roleId !== consts.ROOM.ROLE_ID.THIEF) {
    return;
  }

  return this.playerManager.getKillOrStealIdList(msg);
};

Room.prototype.kill = function(msg) {
  return this.playerManager.kill(msg);
};

Room.prototype.steal = function(msg) {
  return this.playerManager.steal(msg);
};

Room.prototype.exchangeCardWithSys = function(msg) {
  var roleId = parseInt(msg.roleId);
  if(this.curRoleId !== roleId) {
    return;
  }
  if(roleId !== consts.ROOM.ROLE_ID.MAGICIAN) {
    return;
  }
  return this.playerManager.exchangeCard(msg, true);
};

Room.prototype.exchangeCardWithPlayer = function(msg) {
  return this.playerManager.exchangeCard(msg);
};

Room.prototype.dismantleBuilding = function(msg) {
  return this.playerManager.dismantleBuilding(msg);
};

Room.prototype.collectTaxes = function(msg) {
  return this.playerManager.collectTaxes(msg);
};

Room.prototype.doAction4robot = function(msg) {
  return this.playerManager.doAction4robot(msg);
};

Room.prototype.clearAllTimers = function() {
  this.playerManager.clearAllTimers();
};

///////////////////////////////////////////////////////
/**
 * Expose 'Room' constructor.
 */
module.exports = Room;

