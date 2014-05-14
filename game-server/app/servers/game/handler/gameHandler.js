var roomManager = require('../../../services/roomManager');
var utils = require('../../../util/utils');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;

handler.selectRoleId = function(msg, session, next) {
  var playerId = session.uid;
  // utils.myPrint('playerId = ' , playerId);
  playerId = session.get('playerId');
  // utils.myPrint('playerId = ' , playerId);
  // utils.myPrint('msg = ' , JSON.stringify(msg));

  var roomId = session.get('roomId');
  msg.roomId = roomId;
  var ret = roomManager.selectRoleId(msg)
  next(null, {
    ret: ret
  });
};

handler.roundEnd = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // console.log('roundEnd ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.roundEnd(msg);
  next(null, {
    ret: ret
  });
};

handler.constructBuilding = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // utils.myPrint('constructBuilding ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.constructBuilding(msg);
  next(null, {
    ret: ret
  });
};

handler.selectCoin = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // console.log('selectCoin ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.selectCoin(msg);
  next(null, {
    ret: ret
  });
};

handler.selectBlueprint = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // utils.myPrint('selectBlueprint ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.selectBlueprint(msg);
  next(null, {
    ret: ret
  });
};

handler.getKillOrStealIdList = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // console.log('getKillOrStealIdList ~ msg = ', JSON.stringify(msg));
  var L = roomManager.getKillOrStealIdList(msg) || [];
  // console.log('getKillOrStealIdList ~ L = ', L);
  next(null, {
    killOrStealIdList: L
  });
};

handler.kill = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // console.log('kill ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.kill(msg);
  // utils.myPrint('kill ~ ret = ', ret);
  next(null, {
    ret: ret
  });
};

handler.steal = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // console.log('steal ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.steal(msg);
  next(null, {
    ret: ret
  });
};

handler.exchangeCardWithSys = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // console.log('exchangeCardWithSys ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.exchangeCardWithSys(msg);
  next(null, {
    ret: ret
  });
};

handler.exchangeCardWithPlayer = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // console.log('exchangeCardWithPlayer ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.exchangeCardWithPlayer(msg);
  next(null, {
    ret: ret
  });
};

handler.dismantleBuilding = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // utils.myPrint('dismantleBuilding ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.dismantleBuilding(msg);
  next(null, {
    ret: ret
  });
};

handler.collectTaxes = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // utils.myPrint('collectTaxes ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.collectTaxes(msg);
  next(null, {
    ret: ret
  });
};

handler.doAction4robot = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  // utils.myPrint('doAction4robot ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.doAction4robot(msg);
  next(null, {
    ret: ret
  });
};

handler.getRoomList = function(msg, session, next) {
  // utils.myPrint('getRoomList ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.getRoomList(msg);
  next(null, {
    ret: ret
  });
};

handler.exitRoom = function(msg, session, next) {
  var roomId = session.get('roomId');
  var serverId = this.app.get('serverId');

  msg.roomId = roomId;
  msg.serverId = serverId;

  // utils.myPrint('exitRoom ~ msg = ', JSON.stringify(msg));
  var ret = roomManager.kick(msg);
  // utils.myPrint('ret = ', JSON.stringify(ret));
  next(null, {
    ret: ret
  });
};

handler.chatInRoom = function(msg, session, next) {
  var roomId = session.get('roomId');
  msg.roomId = roomId;
  var ret = roomManager.chatInRoom(msg);
  next(null, {
    ret: ret
  });
};

// testing code
// roomManager.createSomeRooms();
// testing code

