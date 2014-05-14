var pomelo = window.pomelo;

var ExchangeCardLayer = cc.Layer.extend({
  mRegisterDelegate: true,
  mMyRoleId: -1,

  ctor: function(roleId) {
    this._super();
    this.init(roleId);
  },

  init: function(roleId) {
    var bRet = false;
    if (this._super()) {
      this.mMyRoleId = roleId;
      var exchangeCardBgSprite = cc.Sprite.create(exchangeCardBgPNG);
      exchangeCardBgSprite.setAnchorPoint(0, 0);
      exchangeCardBgSprite.setPosition(312, 401);
      this.addChild(exchangeCardBgSprite);
      // with player
      var withPlayerBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("exchangeCardWithPlayer_1.png"),
        cc.Sprite.createWithSpriteFrameName("exchangeCardWithPlayer_3.png"),
        this.withPlayerCb,
        this
      );
      withPlayerBtn.setAnchorPoint(0, 0);
      withPlayerBtn.setPosition(324, 411);
      var withPlayerMenu = cc.Menu.create(withPlayerBtn);
      withPlayerMenu.setPosition(0,0);
      this.addChild(withPlayerMenu);
      // with sys
      var withSysBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("exchangeCardWithSys_1.png"),
        cc.Sprite.createWithSpriteFrameName("exchangeCardWithSys_3.png"),
        this.withSysCb,
        this
      );
      withSysBtn.setAnchorPoint(0, 0);
      withSysBtn.setPosition(468, 411);
      var withSysMenu = cc.Menu.create(withSysBtn);
      withSysMenu.setPosition(0,0);
      this.addChild(withSysMenu);
      // close
      var closeBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("close_1.png"),
        cc.Sprite.createWithSpriteFrameName("close_3.png"),
        this.closeBtnCb,
        this
      );
      closeBtn.setAnchorPoint(0, 0);
      closeBtn.setPosition(584, 457);
      var closeMenu = cc.Menu.create(closeBtn);
      closeMenu.setPosition(0,0);
      this.addChild(closeMenu);

      bRet = true;
    }
    return bRet;
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

  withPlayerCb: function(sender){
    if(gMainGamePanelLayer) {
      gMainGamePanelLayer.showExchangeX(true);
    }
    this.setVisible(false);
  },

  withSysCb:function(sender){
    var self = this;
    this.setVisible(false);
    var route = "game.gameHandler.exchangeCardWithSys";
    pomelo.request(route, {
      playerId: gPlayerId,
      roleId: this.mMyRoleId
    }, function(data) {
      // cc.log('exchangeCardWithSys ret ...');
      if(data.ret && gMainGamePanelLayer) {
        gMainGamePanelLayer.showMagicAnimation(self.mMyRoleId);
      }
    });
  },

  closeBtnCb:function(sender){
    this.setVisible(false);
  },


  onTouchBegan: function(touch, event) {
    // console.log('exchange ~ onTouchBegan is running ...');
    return true;
  },

  onTouchEnded:function (touch, event) {
    // console.log('exchange ~ onTouchEnded is running ...');
    // ...
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

