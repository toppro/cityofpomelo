var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');


var BpWall = function(id, card) {
  Blueprint.call(this, id, card);
  this.triggerTiming = consts.ROOM.EFFECT_TRIGGER_TIMING.WALL;
};

util.inherits(BpWall, Blueprint);

BpWall.prototype.handleEffect = function() {
  if(!this.playerObj) {
    return;
  }
  var bds = this.playerObj.buildings;
  for(var i in bds) {
    var bd = bds[i];
    bd.card.dismantleCost = bd.card.cost;
  }

  this.showPurpleFlag();
};

BpWall.prototype.handleRemoveEffect = function() {
  if(!this.playerObj) {
    return;
  }
  var bds = this.playerObj.buildings;
  for(var i in bds) {
    var bd = bds[i];
    bd.card.dismantleCost = Math.max(bd.card.cost - 1, 0);
  }
};


/**
 * Expose 'BpWall' constructor.
 */
module.exports = BpWall;

