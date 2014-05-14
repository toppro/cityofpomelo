var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');

var BpSlum = function(id, card) {
  Blueprint.call(this, id, card);
  this.triggerTiming = consts.ROOM.EFFECT_TRIGGER_TIMING.ROUND_END;
};

util.inherits(BpSlum, Blueprint);

BpSlum.prototype.handleEffect = function() {
  if(!this.playerObj) {
    return;
  }
  if(this.playerObj.coin === 0) {
    this.playerObj.coin += this.roomObj.bank.withdraw(1);
    if(!!this.roomObj) {
      this.updatePlayerCoin();
      this.showPurpleFlag();
    }
  }
};

/**
 * Expose 'BpSlum' constructor.
 */
module.exports = BpSlum;

