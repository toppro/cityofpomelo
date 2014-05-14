
var GrassBgSprite = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      this.initWithFile(grass6PNG);
    }
  },

  onTouchBegan: function(touch, event) {
    var touchPos = touch.getLocation();
    var x = touchPos.x;
    var y = touchPos.y;
    // cc.log('x, y = ', x, y);
    if(!(x > 3 && x < 870 && y > 167 && y < 560)) {
      return;
    }
    // audio effect
    gSharedEngine.playEffect(EFFECT_SPRING);

    touchPos.x = touchPos.x - 18;
    touchPos.y = touchPos.y - 8;
    var self = this;
    if(self.mWishingWell) {
      self.removeChild(self.mWishingWell);
    }
    self.mWishingWell = new WishingWellAnimation();
    self.mWishingWell.setAnchorPoint(0, 0);
    self.mWishingWell.setPosition(touchPos);
    self.addChild(self.mWishingWell);
    setTimeout(function() {
      self.removeChild(self.mWishingWell);
      self.mWishingWel = null;
    }, 600);

    return false;
  },

  onTouchEnded:function (touch, event) {
    // ...
  },

  onEnter:function () {
    if(sys.platform == "browser")
      cc.registerTargetedDelegate(1, true, this);
    else
      cc.registerTargettedDelegate(1, true, this);
    this._super();
  },

  onExit:function () {
    cc.unregisterTouchDelegate(this);
    this._super();
  }
});

