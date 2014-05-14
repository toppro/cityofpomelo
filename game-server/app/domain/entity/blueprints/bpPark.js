var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');
var utils = require('../../../util/utils');

var BpPark = function(id, card) {
  Blueprint.call(this, id, card);
  this.triggerTiming = consts.ROOM.EFFECT_TRIGGER_TIMING.ROUND_END;
};

util.inherits(BpPark, Blueprint);

BpPark.prototype.handleEffect = function() {
  if(!this.playerObj) {
    return;
  }

  var bps = this.playerObj.blueprints;
  if(bps.length === 0) {
    if(!!this.roomObj) {
      for(var i = 0; i < 2; i++) {
        var bp = this.roomObj.getNextBlueprint();
        if(bp) {
          this.playerObj.blueprints.push(bp);
        }
      }
      utils.onUpdatePlayerBlueprint(this.roomObj, this.playerObj);
      this.showPurpleFlag();
    }
  }
};

/**
 * Expose 'BpPark' constructor.
 */
module.exports = BpPark;
