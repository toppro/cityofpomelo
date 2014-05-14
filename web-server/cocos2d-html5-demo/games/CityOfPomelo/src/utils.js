containsTouchLocation = function(touch, isAnchorPoint00) {
  // console.log('containsTouchLocation ~ this.mPlayerId = ', this.mPlayerId);
  // console.log('containsTouchLocation ~ this.mMsg = ', this.mMsg);
  var halfW = this.getContentSize().width / 2;
  var halfH = this.getContentSize().height / 2;
  // console.log('halfW, halfH = ', halfW, halfH);
  var touchPos = touch.getLocation();
  // console.log('touchPos = ', touchPos);
  var offsetX = 0
    , offsetY = 0;
  if(isAnchorPoint00) {
    offsetX += halfW;
    offsetY += halfH;
  }
  // console.log('offsetX, offsetY = ', offsetX, offsetY);
  var posX = 0 | (touchPos.x - this.getPosition().x - offsetX);
  var posY = 0 | (touchPos.y - this.getPosition().y - offsetY);
  // console.log('X, Y = ', this.getPosition().x, this.getPosition().y);
  // console.log('posX, posY = ', posX, posY);
  if(posX > -halfW && posX < halfW && posY > -halfH && posY < halfH) {
    return true;
  } else {
    return false;
  }
};

calcBlueprintPopupAnchor = function(pos) {
  var halfWinW = gWinSize.width / 2;
  var halfWinH = gWinSize.height / 2;
  var x = 0
    , y = 0;
  if(pos.x < halfWinW) {
    x = 0;
  } else {
    x = 1;
  }
  if(pos.y < halfWinH) {
    y = 0;
  } else {
    y = 1;
  }
  return [x, y];
};
