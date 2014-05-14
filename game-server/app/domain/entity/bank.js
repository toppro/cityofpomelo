var consts = require('../../consts/consts');
var utils = require('../../util/utils');

function Bank(roomObj) {
  this.balance = consts.ROOM.MAX_COIN_IN_BANK;
  this.roomObj = roomObj;
}

Bank.prototype.withdraw = function(amount) {
  // utils.myPrint('withdraw ~1 amount, balance = ', amount, this.balance);
  amount = Math.min(amount, this.balance);
  this.balance = Math.max(this.balance - amount, 0);
  // utils.myPrint('withdraw ~2 amount, balance = ', amount, this.balance);

  this.updateBank();

  return amount;
};

Bank.prototype.deposit = function(amount) {
  // utils.myPrint('deposit ~1 amount, balance = ', amount, this.balance);
  this.balance = Math.min(this.balance + amount, consts.ROOM.MAX_COIN_IN_BANK);
  // utils.myPrint('deposit ~2 amount, balance = ', amount, this.balance);

  this.updateBank();
};

Bank.prototype.updateBank = function() {
  var infoDict = {};
  infoDict.balance = this.balance;
  this.roomObj.channel.pushMessage('onUpdateBank', infoDict, null);
};

/**
 * Expose 'Bank' constructor.
 */
module.exports = Bank;

