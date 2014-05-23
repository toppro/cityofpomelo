var fs = require('fs');
require('./config');

var w = width / column
  , h = height / row;

var plistFD = fs.openSync('./' + fileName + '.plist', 'w');

function hereDoc(fn) {
  return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
}

var header = hereDoc(function(){/*
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>frames</key>
        <dict>
*/});

var body1 = hereDoc(function(){/*
            <dict>
                <key>frame</key>
*/});

var body2 = hereDoc(function(){/*
                <key>offset</key>
                <string>{0,0}</string>
                <key>rotated</key>
                <false/>
                <key>sourceColorRect</key>
*/});

var body3 = hereDoc(function(){/*
                <key>sourceSize</key>
*/});

var body4 = hereDoc(function(){/*
            </dict>
*/});

var footer1 = hereDoc(function(){/*
        </dict>
        <key>metadata</key>
        <dict>
            <key>format</key>
            <integer>2</integer>
            <key>realTextureFileName</key>
*/});

var footer2 = hereDoc(function(){/*
            <key>size</key>
*/});

var footer3 = hereDoc(function(){/*
            <key>smartupdate</key>
            <string>$TexturePacker:SmartUpdate:07a7b7a5ec3b6ad1041725dc5000cc1b:2be82f208c2373e0257f96aaef4c2dfc:f95f748b3a8b54f12883e620a9cfc0f1$</string>
            <key>textureFileName</key>
*/});

var footer4 = hereDoc(function(){/*
        </dict>
    </dict>
</plist>
*/});


fs.writeSync(plistFD, header);

var num = 1;

for(var i = 0; i < row; i++) {
  for(var j = 0; j < column; j++) {
    var tmpName = '            <key>' + frameName + num + '.png</key>\n';
    fs.writeSync(plistFD, tmpName);
    num++;
    fs.writeSync(plistFD, body1);
    var pos = '{' + (j*w) + ',' + (i*h) + '},';
    var size = '{' + w + ',' + h + '}';
    var str = '                <string>{' + pos + size + '}</string>\n';
    fs.writeSync(plistFD, str);
    fs.writeSync(plistFD, body2);
    str = '                <string>{{0,0},' + size + '}</string>\n';
    fs.writeSync(plistFD, str);
    fs.writeSync(plistFD, body3);
    str = '                <string>' + size + '</string>\n';
    fs.writeSync(plistFD, str);
    fs.writeSync(plistFD, body4);
  }
}

fs.writeSync(plistFD, footer1);
str = '            <string>' + fileName + '.png</string>\n';
fs.writeSync(plistFD, str);
fs.writeSync(plistFD, footer2);
str = '            <string>{' + width + ',' + height + '}</string>\n';
fs.writeSync(plistFD, str);
fs.writeSync(plistFD, footer3);
str = '            <string>' + fileName + '.png</string>\n';
fs.writeSync(plistFD, str);
fs.writeSync(plistFD, footer4);

