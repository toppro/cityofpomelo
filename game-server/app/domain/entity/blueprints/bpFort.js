var util = require('util');
var Blueprint = require('./bpBase');
var consts = require('../../../consts/consts');


var BpFort = function(id, card) {
  Blueprint.call(this, id, card);
};

util.inherits(BpFort, Blueprint);

BpFort.prototype.canBeDismantled = function() {
  this.showPurpleFlag();
  return false;
};

/**
 * Expose 'BpFort' constructor.
 */
module.exports = BpFort;

