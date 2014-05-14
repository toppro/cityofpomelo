var pomelo = window.pomelo;

var uid = "xyt";
var rid = "127";
var username = "palmtoy";

pomelo.init({
  host: window.location.hostname,
  port: 3014,
  log: true
}, function() {
  var routeA = 'gate.gateHandler.queryEntry';
  pomelo.request(routeA, {
    uid: uid
  }, function(data) {
    pomelo.disconnect();
    pomelo.init({
      host: data.host,
      port: data.port,
      log: true
    }, function() {
      var routeB = "connector.entryHandler.enter";
      pomelo.request(routeB, {
        username: username,
        rid: rid
      }, function(data) {
        cc.log('enter ~ data = ', JSON.stringify(data));
        sendSomeMsg();
      });
    });
  });
});

var idx = null;
var num = 3
  , i = 0;

var sendSomeMsg = function() {
  idx = setInterval(chatSend, 1500);
}

function chatSend() {
  var routeC = "chat.chatHandler.send";
  var target = "*";
  var msg = Date() + " ~ Hi, my friends ~";
  pomelo.request(routeC, {
    rid: rid,
    content: msg,
    from: username,
    target: target
  }, function(data) {
    cc.log('send ~ data = ', JSON.stringify(data));
  });
  if(++i >= num && idx) {
    clearInterval(idx);
  }
}
