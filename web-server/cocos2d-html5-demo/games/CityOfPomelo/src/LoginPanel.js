var pomelo = window.pomelo;

var LoginLayer = cc.Layer.extend({

 ctor: function () {
    this._super();
    this.init();
  },

  init: function () {
    var bRet = false;
    if(this._super()) {
      this.setKeyboardEnabled(true);

      this.connect2svr();

      var panelBgSprite = cc.Sprite.create(loginBgPNG);
      panelBgSprite.setAnchorPoint(0, 0);
      panelBgSprite.setPosition(128, 169);
      this.addChild(panelBgSprite);

      var blockSize = cc.size(117, 22);
      // player name
      this.mEdit4Name = cc.EditBox.create(blockSize, cc.Scale9Sprite.create(inputBgPNG));
      this.mEdit4Name.setPlaceholderFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.mEdit4Name.setPlaceHolder('阁下的账号');
      this.mEdit4Name.setAnchorPoint(0, 0);
      this.mEdit4Name.setPosition(628, 370);
      this.mEdit4Name.setDelegate(this);
      this.mEdit4Name.setFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.mEdit4Name.setMaxLength(6);
      this.addChild(this.mEdit4Name);

      // password
      this.mEdit4Pwd = cc.EditBox.create(blockSize, cc.Scale9Sprite.create(inputBgPNG));
      this.mEdit4Pwd.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
      this.mEdit4Pwd.setAnchorPoint(0, 0);
      this.mEdit4Pwd.setPosition(628, 343);
      this.mEdit4Pwd.setDelegate(this);
      this.mEdit4Pwd.setFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.mEdit4Pwd.setMaxLength(8);
      this.addChild(this.mEdit4Pwd);

      // password tips
      this.mTips = cc.LabelTTF.create('', 10, blockSize, cc.TEXT_ALIGNMENT_LEFT);
      this.mTips.setAnchorPoint(0, 0);
      this.mTips.setPosition(749, 325);
      this.mTips.setColor(new cc.Color3B(255, 0, 0));
      this.addChild(this.mTips);

      // login btn
      this.mLoginBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("loginBtn_1.png"),
        cc.Sprite.createWithSpriteFrameName("loginBtn_3.png"),
        this.loginSvr,
        this
      );
      this.mLoginBtn.setAnchorPoint(0, 0);
      this.mLoginBtn.setPosition(623, 232);
      this.mLoginMenu = cc.Menu.create(this.mLoginBtn);
      this.mLoginMenu.setPosition(0,0);
      this.addChild(this.mLoginMenu);

      bRet = true;
    }
    return bRet;
  },

  connect2svr: function() {
    pomelo.init({
      host: gGameSvrAddr.ip,
      port: gGameSvrAddr.port,
      log: true
    }, function() {
      var route = 'gate.gateHandler.queryEntry';
      pomelo.request(route, {}, function(data) {
        pomelo.disconnect();
        pomelo.init({
          host: data.host,
          port: data.port,
          log: true
        }, function() {});
      });
    });
  },

  loginSvr: function() {
    var self = this;
    gPlayerName = self.mEdit4Name.getText();
    var password = self.mEdit4Pwd.getText();
    password = md5(password);

    self.mTips.setString('');

    route = "connector.entryHandler.loginSvr";
    pomelo.request(route, {
      playerName: gPlayerName,
      password: password
    }, function(data) {
      if(data.ret) {
        gPlayerId = data.playerId;
        var nextScene = cc.Scene.create();
        gGameLobbyLayer = new GameLobbyLayer();
        nextScene.addChild(gGameLobbyLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1, nextScene));
      } else {
        self.mTips.setString('密码错误');
      }
    });
  }

});

var MyGameScene = cc.Scene.extend({
  onEnter:function () {
    this._super();
    // load resource
    gSpriteFrameCache.addSpriteFrames(roleAvailablePList, roleAvailablePNG);
    gSpriteFrameCache.addSpriteFrames(roleNotAvailablePList, roleNotAvailablePNG);
    gSpriteFrameCache.addSpriteFrames(confirmAndCancelBigPList, confirmAndCancelBigPNG);
    gSpriteFrameCache.addSpriteFrames(confirmAndCancelSmallPList, confirmAndCancelSmallPNG);
    gSpriteFrameCache.addSpriteFrames(roleNameSmallPList, roleNameSmallPNG);
    gSpriteFrameCache.addSpriteFrames(roleIconSmallPList, roleIconSmallPNG);
    gSpriteFrameCache.addSpriteFrames(roundEndPList, roundEndPNG);
    gSpriteFrameCache.addSpriteFrames(taxesPList, taxesPNG);
    gSpriteFrameCache.addSpriteFrames(roleSkillPList, roleSkillPNG);
    gSpriteFrameCache.addSpriteFrames(skillIconPList, skillIconPNG);
    gSpriteFrameCache.addSpriteFrames(seatNumberCBigPList, seatNumberCBigPNG);
    gSpriteFrameCache.addSpriteFrames(statusPList, statusPNG);
    gSpriteFrameCache.addSpriteFrames(seatNumberCSmallPList, seatNumberCSmallPNG);
    gSpriteFrameCache.addSpriteFrames(exchangeCardPList, exchangeCardPNG);
    gSpriteFrameCache.addSpriteFrames(configAndClosePList, configAndClosePNG);
    gSpriteFrameCache.addSpriteFrames(roleSkillOrnamentPList, roleSkillOrnamentPNG);
    gSpriteFrameCache.addSpriteFrames(blueprintNamePList, blueprintNamePNG);
    gSpriteFrameCache.addSpriteFrames(blueprintAvailableBigPList, blueprintAvailableBigPNG);
    gSpriteFrameCache.addSpriteFrames(coinBigPList, coinBigPNG);
    gSpriteFrameCache.addSpriteFrames(dismantlePList, dismantlePNG);
    gSpriteFrameCache.addSpriteFrames(blueprintAvailableSmallPList, blueprintAvailableSmallPNG);
    gSpriteFrameCache.addSpriteFrames(selectCoinOrBlueprintPList, selectCoinOrBlueprintPNG);
    gSpriteFrameCache.addSpriteFrames(previousAndNextPagePList, previousAndNextPagePNG);
    gSpriteFrameCache.addSpriteFrames(blueprintNameDecolorPList, blueprintNameDecolorPNG);
    gSpriteFrameCache.addSpriteFrames(killSmallPList, killSmallPNG);
    gSpriteFrameCache.addSpriteFrames(killBigPList, killBigPNG);
    gSpriteFrameCache.addSpriteFrames(roleIconBigPList, roleIconBigPNG);
    gSpriteFrameCache.addSpriteFrames(beKilledBigPList, beKilledBigPNG);
    gSpriteFrameCache.addSpriteFrames(beStolenBigPList, beStolenBigPNG);
    gSpriteFrameCache.addSpriteFrames(magicBigPList, magicBigPNG);
    gSpriteFrameCache.addSpriteFrames(employRoleOrnamentPList, employRoleOrnamentPNG);
    gSpriteFrameCache.addSpriteFrames(constructBuildingPList, constructBuildingPNG);
    gSpriteFrameCache.addSpriteFrames(dismantleBuildingPList, dismantleBuildingPNG);
    gSpriteFrameCache.addSpriteFrames(countdownNumPList, countdownNumPNG);
    gSpriteFrameCache.addSpriteFrames(arrowMiddlePList, arrowMiddlePNG);
    gSpriteFrameCache.addSpriteFrames(purpleFlagPList, purpleFlagPNG);
    gSpriteFrameCache.addSpriteFrames(wishingWellPList, wishingWellPNG);
    gSpriteFrameCache.addSpriteFrames(taxesFramePList, taxesFramePNG);
    gSpriteFrameCache.addSpriteFrames(skillFramePList, skillFramePNG);
    gSpriteFrameCache.addSpriteFrames(comeOnStagePList, comeOnStagePNG);
    gSpriteFrameCache.addSpriteFrames(colorBlockPList, colorBlockPNG);
    gSpriteFrameCache.addSpriteFrames(helpBtnPList, helpBtnPNG);
    gSpriteFrameCache.addSpriteFrames(createRoomPList, createRoomPNG);
    gSpriteFrameCache.addSpriteFrames(enterRoomPList, enterRoomPNG);
    gSpriteFrameCache.addSpriteFrames(exitRoomPList, exitRoomPNG);
    gSpriteFrameCache.addSpriteFrames(preNextPagePList, preNextPagePNG);
    gSpriteFrameCache.addSpriteFrames(refreshBtnPList, refreshBtnPNG);
    gSpriteFrameCache.addSpriteFrames(loginBtnPList, loginBtnPNG);
    gSpriteFrameCache.addSpriteFrames(sendBtnPList, sendBtnPNG);

    // show the first panel
    gLoginLayer = new LoginLayer;
    this.addChild(gLoginLayer);

    // bg music
    gSharedEngine.setMusicVolume(0.1);
    gSharedEngine.setEffectsVolume(0.5);
    // gSharedEngine.playMusic(MUSIC_BACKGROUND, true);
  }
});

