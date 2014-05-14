var roomManager = require('../../../services/roomManager');

module.exports = function(app) {
  return new GameRemote(app);
};

var GameRemote = function(app) {
  this.app = app;
};

/**
 * Add user into room.
 *
 * @param {String} msg
 *
 */
GameRemote.prototype.enterRoom = function(msg, cb) {
  roomManager.enterRoom(msg, cb);
};

/**
 * Kick user out room.
 *
 *
 */
GameRemote.prototype.kick = function(data) {
  roomManager.kick(data);
};
