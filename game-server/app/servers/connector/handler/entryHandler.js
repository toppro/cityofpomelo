var DataManager = require('../../../services/dataManager');
var utils = require('../../../util/utils');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
  // init data manager
  DataManager.initDataFromFile();
};

var handler = Handler.prototype;

// login svr
handler.loginSvr = function(msg, session, next) {
  var self = this;
  var sessionService = self.app.get('sessionService');

  var playerId = DataManager.getPlayerId(msg);

  // password error or duplicate login
  if((playerId <= 0) || !!sessionService.getByUid(playerId)) {
    next(null, {
      ret: false
    });
    return;
  }

  session.bind(playerId);
  session.set('playerId', playerId);
  session.on('closed', onPlayerLeave.bind(null, self.app));

  session.pushAll(
    function() {
      next(null, {
        playerId: playerId,
        ret: true
      });
    }
  );
};

/**
 * New client entry game server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.enterRoom = function(msg, session, next) {
  msg.serverId = this.app.get('serverId');

  // put player into room
  this.app.rpc.game.gameRemote.enterRoom(session, msg, function(data) {
    if(!!data.roomId && data.roomId > 0) {
      session.set('roomId', data.roomId);
    }

    session.push('roomId', function(err) {
      if(err) {
        console.error('Set roomId for session service failed! error is : %j', err.stack);
      } else {
        next(null, {
          roomId: data.roomId,
          seatNum: data.seatNum
        });
      }
    });
  });
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onPlayerLeave = function(app, session) {
  if(!session || !session.uid) {
    return;
  }
  var d = {roomId: session.get('roomId'), playerId: session.get('playerId'), serverId: app.get('serverId')};
  app.rpc.game.gameRemote.kick(session, d, null);
};

