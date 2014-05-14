var express = require('express');
var app = express();

app.use(express.logger());
app.use(express.static(__dirname));

var port = 8080;
console.log("cocos2d-html5 web-server is running ... \nPlease visit http://localhost:%d \n", port);
app.listen(port);

