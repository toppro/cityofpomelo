
var HelpSprite = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      this.initWithFile(helpPNG);

      // close
      var closeBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("close_1.png"),
        cc.Sprite.createWithSpriteFrameName("close_3.png"),
        this.closeBtnCb,
        this
      );
      closeBtn.setAnchorPoint(0, 0);
      closeBtn.setPosition(563, 543);
      var closeMenu = cc.Menu.create(closeBtn);
      closeMenu.setPosition(0,0);
      this.addChild(closeMenu);
    }
  },

  closeBtnCb:function(sender){
    this.setVisible(false);
    gGameLobbyLayer.showAllItems(true);
  },

  onTouchBegan: function(touch, event) {
    return true;
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

