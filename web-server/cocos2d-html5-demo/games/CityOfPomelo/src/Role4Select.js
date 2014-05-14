var MSG_SELECT_ROLE = "MSG_SELECT_ROLE";
var MSG_KILL_ROLE = "MSG_KILL_ROLE";
var MSG_STEAL_ROLE = "MSG_STEAL_ROLE";

var Role4SelectSprite = cc.Sprite.extend({
  mRoleId: -1,
  mAvailable: false,
  mMsg: null,

  ctor: function(available, roleId, msg) {
    this._super();
    this.init(available, roleId, msg);
  },

  init: function(available, roleId, msg) {
    if(this._super()){
      this.initWithFile(selectRoleBgPNG);

      this.mRoleId = parseInt(roleId);
      this.mMsg = msg;
      var prefix = PREFIX_NOT_AVAILABLE;
      if(available) {
        prefix = PREFIX_AVAILABLE;
        this.mAvailable = true;
      }
      var image = prefix + this.mRoleId + '.png';
      // this.initWithSpriteFrameName(image);

      this.mRoleImage = cc.Sprite.createWithSpriteFrameName(image);
      this.mRoleImage.setPosition(33, 33);
      this.addChild(this.mRoleImage);
    }
  },

  onTouchBegan: function(touch, event) {
    if(this.mAvailable && this.mRoleId > 0 && containsTouchLocation.bind(this, touch)()) {
      if(this.mMsg) {
        gNotification.postNotification(this.mMsg, this.mRoleId);
        // audio effect
        gSharedEngine.playEffect(EFFECT_SELECT);
      }
      return true;
    } else {
      return false;
    }
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
