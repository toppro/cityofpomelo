var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');
var utils = require('../../../util/utils');


var BpLighthouse = function(id, card) {
  Blueprint.call(this, id, card);
  this.triggerTiming = consts.ROOM.EFFECT_TRIGGER_TIMING.LIGHTHOUSE;
};

util.inherits(BpLighthouse, Blueprint);

BpLighthouse.prototype.handleEffect = function() {
  if(!this.playerObj) {
    return;
  }

  var bps = this.playerObj.blueprints;
  if(bps.length < consts.ROOM.MAX_BLUEPRINT_NUM_IN_HAND) {
    if(!!this.roomObj) {
      var bp = this.roomObj.getNextBlueprint();
      if(bp) {
        this.playerObj.blueprints.push(bp);
      }

      this.updatePlayerBlueprint();
      this.showPurpleFlag();
    }
  }
};

/**
 * Expose 'BpLighthouse' constructor.
 */
module.exports = BpLighthouse;
