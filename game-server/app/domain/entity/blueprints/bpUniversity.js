var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');

var EXTRA_SCORE = 2;

var BpUniversity = function(id, card) {
  Blueprint.call(this, id, card);
  this.triggerTiming = consts.ROOM.EFFECT_TRIGGER_TIMING.GAME_OVER;
};

util.inherits(BpUniversity, Blueprint);

BpUniversity.prototype.handleEffect = function() {
  if(!this.playerObj) {
    return;
  }
  this.playerObj.score += EXTRA_SCORE;

  this.showPurpleFlag();
};

/**
 * Expose 'BpUniversity' constructor.
 */
module.exports = BpUniversity;