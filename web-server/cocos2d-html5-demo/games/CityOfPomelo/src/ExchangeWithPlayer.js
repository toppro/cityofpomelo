var MSG_EXCHANGE_WITH_PLAYER = "MSG_EXCHANGE_WITH_PLAYER";

var ExchangeWithPlayerSprite = cc.Sprite.extend({
  mPlayerId: -1,
  mMsg: null,
  mRegisterDelegate: true,

  ctor: function(playerId, msg) {
    this._super();
    this.init(playerId, msg);
  },

  init: function(playerId, msg) {
    if(this._super()){
      this.mPlayerId = parseInt(playerId);
      this.mMsg = msg;
      this.initWithFile(exchangeWithPlayerPNG);
    }
  },

  onTouchBegan: function(touch, event) {
    // console.log('ExchangeWithPlayerSprite ~ onTouchBegan is running ...');
    // console.log('ExchangeWithPlayerSprite ~ mPlayerId =', this.mPlayerId);
    if(this.mPlayerId > 0 && containsTouchLocation.bind(this, touch, true)()) {
      if(this.mMsg) {
        gNotification.postNotification(this.mMsg, this.mPlayerId);
        // audio effect
        gSharedEngine.playEffect(EFFECT_SELECT);
        return true;
      }
    }
    return false;
  },

  onTouchEnded:function (touch, event) {
    // ...
  },

  setVisible: function(bFlag) {
    this._super(bFlag);
    if(bFlag) {
      if(!this.mRegisterDelegate) {
        this.onEnter();
      }
    } else {
      this.onExit();
    }
  },

  onEnter:function () {
    if(sys.platform == "browser")
      cc.registerTargetedDelegate(1, true, this);
    else
      cc.registerTargettedDelegate(1, true, this);
    this._super();
    this.mRegisterDelegate = true;
  },

  onExit:function () {
    cc.unregisterTouchDelegate(this);
    this._super();
    this.mRegisterDelegate = false;
  }
});
