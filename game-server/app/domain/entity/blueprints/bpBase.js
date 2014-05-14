var events = require('events');
var util = require('util');
var consts = require('../../../consts/consts');
var utils = require('../../../util/utils');


var EFFECT_PREFIX = 'EFFECT_';
var REMOVE_EFFECT_PREFIX = 'REMOVE_EFFECT_';

var Blueprint = function(id, card) {
  events.EventEmitter.call(this);

  this.id = id;
  this.card = card;
  if(consts.ROOM.COLOR.PURPLE === this.card.color) {
    this.effectId = EFFECT_PREFIX + this.card.typeId;
    this.removeEffectId = REMOVE_EFFECT_PREFIX + this.card.typeId;
  }
};

util.inherits(Blueprint, events.EventEmitter);

Blueprint.prototype.triggerEffect = function(triggerTiming) {
  if(!!this.effectId && !!this.triggerTiming && (this.triggerTiming ===  triggerTiming)) {
    this.emit(this.effectId);
  }
};

Blueprint.prototype.removeEffect = function(triggerTiming) {
  if(!!this.removeEffectId && !!this.triggerTiming && (this.triggerTiming ===  triggerTiming)) {
    this.emit(this.removeEffectId);
  }
};

Blueprint.prototype.handleEffect = function() {
  // effect handler: virtual interface
};

Blueprint.prototype.setPlayer = function(o) {
  this.playerObj = o;
};

Blueprint.prototype.setRoomObj = function(roomObj) {
  this.roomObj = roomObj;
};

Blueprint.prototype.showPurpleFlag = function() {
  var infoDict = {};
  infoDict.playerId = this.playerObj.playerId;
  infoDict.seatNum = this.playerObj.seatNum;
  infoDict.bdId = this.id;
  this.roomObj.channel.pushMessage('onShowPurpleFlag', infoDict, null);
};

Blueprint.prototype.updatePlayerCoin = function() {
  utils.onUpdatePlayerCoin(this.roomObj, this.playerObj);
};

Blueprint.prototype.updatePlayerBlueprint = function() {
  utils.onUpdatePlayerBlueprint(this.roomObj, this.playerObj);
};

/**
 * Expose 'Blueprint' constructor.
 */
module.exports = Blueprint;
