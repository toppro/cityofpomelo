var ChannelUtil = module.exports;

var GLOBAL_CHANNEL_NAME = 'pomelo';
var ROOM_CHANNEL_PREFIX = 'room_';

ChannelUtil.getGlobalChannelName = function() {
  return GLOBAL_CHANNEL_NAME;
};

ChannelUtil.getRoomChannelName = function(roomId) {
  return ROOM_CHANNEL_PREFIX + roomId;
};