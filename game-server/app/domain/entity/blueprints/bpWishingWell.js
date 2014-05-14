var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');

var BpWishingWell = function(id, card) {
  Blueprint.call(this, id, card);
  this.triggerTiming = consts.ROOM.EFFECT_TRIGGER_TIMING.GAME_OVER;
};

util.inherits(BpWishingWell, Blueprint);

BpWishingWell.prototype.handleEffect = function() {
  if(!this.playerObj) {
    return;
  }

  for(var j in this.playerObj.buildings) {
    var bd = this.playerObj.buildings[j];
    if((bd.card.color === consts.ROOM.COLOR.PURPLE) && (bd.id !== this.id)) {
      this.playerObj.score += 1;
    }
  }

  this.showPurpleFlag();
};

/**
 * Expose 'BpWishingWell' constructor.
 */
module.exports = BpWishingWell;
