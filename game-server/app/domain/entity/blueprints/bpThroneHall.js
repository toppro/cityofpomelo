var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');


var BpThroneHall = function(id, card) {
  Blueprint.call(this, id, card);
  this.triggerTiming = consts.ROOM.EFFECT_TRIGGER_TIMING.THRONE_CHANGE;
};

util.inherits(BpThroneHall, Blueprint);

BpThroneHall.prototype.handleEffect = function() {
  if(!this.playerObj) {
    return;
  }
  this.playerObj.coin += this.roomObj.bank.withdraw(1);
  this.updatePlayerCoin();
  this.showPurpleFlag();
};

/**
 * Expose 'BpThroneHall' constructor.
 */
module.exports = BpThroneHall;

