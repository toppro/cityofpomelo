var interval4countdown = 1000;

var CountdownSprite = cc.Sprite.extend({
  mZ4countdown: 2,

  ctor: function(parent, countdownNum, cb) {
    this._super();
    this.init(parent, countdownNum, cb);
  },

  init: function(parent, countdownNum, cb) {
    if(this._super()){
      this.initWithFile(countdownBgPNG);

      this.mParent = parent;
      this.mCountdownNum = countdownNum;
      this.mCb = cb;
      this.timerIdx = setInterval(this.countdown.bind(this), interval4countdown);
      if(!!this.mParent) {
        this.mParent.addChild(this, this.mZ4countdown);
      }

      this.setVisible(false);
    }
  },

  show: function(num) {
    if(!!this.mCountdownNumSprite) {
      this.removeChild(this.mCountdownNumSprite);
    }
    if(num >= 0 && num <= 9) {
      this.setVisible(true);

      this.mCountdownNumSprite = cc.Sprite.createWithSpriteFrameName(PREFIX_COUNTDOWN + num + '.png');
      this.mCountdownNumSprite.setAnchorPoint(0, 0);
      this.mCountdownNumSprite.setPosition(25, 23);
      this.addChild(this.mCountdownNumSprite);
    }
  },

  stop: function() {
    // cc.log('CountdownSprite: stop is running ...');
    if(!!this.timerIdx) {
      clearInterval(this.timerIdx);
    }
    if(!!this.mParent) {
      this.mParent.removeChild(this);
    }
  },

  countdown: function() {
    this.mCountdownNum --;
    var cd = this.mCountdownNum;
    if(gEffectCountdown[cd]) {
      var a = gEffectCountdown[cd];
      gSharedEngine.playEffect(a);
    }
    this.show(cd);
    if(cd === 0) {
      if(!!this.mCb && !!this.mParent) {
        this.mCb.bind(this.mParent)();
      }
    }
  },

  onTouchBegan: function(touch, event) {
    return true;
  },

  onTouchEnded: function (touch, event) {
    // ...
  }
});

