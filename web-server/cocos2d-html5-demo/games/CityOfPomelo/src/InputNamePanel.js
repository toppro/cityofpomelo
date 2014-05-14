var pomelo = window.pomelo;

var strNight = '夜 ~ ';
var strTips = '敢问阁下大名 ...';
var strTeamBattle = '团队战';

var gMaxRandomNum = 999999999;
var gRoomId = "127";
// gRoomId = Math.floor(Math.random() * gMaxRandomNum + 1);

var playerId = Math.floor(Math.random() * gMaxRandomNum + 1);
playerId ^= Date.now();
gPlayerId = playerId > 0 ? playerId : -playerId;

var gPlayerName = "palmtoy";
var gSeatNum = -1;

var InputNameLayer = cc.Layer.extend({
  mRoleId: -1,

  ctor:function () {
    this._super();
    this.init();
  },

  init:function () {
    var bRet = false;
    if (this._super()) {
      this.setKeyboardEnabled(true);
      gWinSize = cc.Director.getInstance().getWinSize();

      var panelBgSprite = cc.Sprite.create(inputPanelBgPNG);
      panelBgSprite.setAnchorPoint(0, 0);
      panelBgSprite.setPosition(0, 0);
      this.addChild(panelBgSprite);

      var bgSprite = cc.Sprite.create(inputNameBgPNG);
      bgSprite.setAnchorPoint(0, 0);
      var halfH = bgSprite.getContentSize().height / 2;
      bgSprite.setPosition(124, gWinSize.height/2-Math.floor(halfH));
      this.addChild(bgSprite);

      this.mNightStr = cc.LabelTTF.create(strNight, 'Arial', 14);
      this.mNightStr.setAnchorPoint(0, 0);
      this.mNightStr.setPosition(155, 535);
      this.mNightStr.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      // this.mNightStr.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.FadeIn.create(2.0), cc.FadeOut.create(1.5))));
      // this.addChild(this.mNightStr);

      this.mTeamBattleStr = cc.LabelTTF.create(strTeamBattle, 'Arial', 12);
      this.mTeamBattleStr.setAnchorPoint(0, 0);
      this.mTeamBattleStr.setPosition(722, 351);
      this.mTeamBattleStr.setColor(new cc.Color3B(255, 0, 0));
      this.addChild(this.mTeamBattleStr);

      this.mTipsStr = cc.LabelTTF.create(strTips, 'Arial', 16);
      this.mTipsStr.setAnchorPoint(0, 0);
      this.mTipsStr.setPosition(335, 385);
      this.mTipsStr.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.addChild(this.mTipsStr);

      this.mInputNameOrnamentPNG = cc.Sprite.create(inputNameOrnamentPNG);
      this.mInputNameOrnamentPNG.setPosition(249, 348);
      this.addChild(this.mInputNameOrnamentPNG);

      this.edit4name = cc.EditBox.create(cc.size(100, 32), cc.Scale9Sprite.create(inputNameEditPNG));
      this.edit4name.setPlaceholderFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      var nameIdx = Math.floor(Math.random() * 99 + 1);
      this.edit4name.setPlaceHolder("大名_" + nameIdx);
      this.edit4name.setPosition(515, 318);
      this.edit4name.setDelegate(this);
      this.edit4name.setFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.edit4name.setMaxLength(7);
      this.addChild(this.edit4name);

      // LabelTTF for room id
      this.mRoomIdLabel = cc.LabelTTF.create('房间号:', 'Arial', 14);
      this.mRoomIdLabel.setAnchorPoint(0, 0);
      this.mRoomIdLabel.setPosition(415, 268);
      this.mRoomIdLabel.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.addChild(this.mRoomIdLabel);

      // EditBox for room id
      this.edit4roomId = cc.EditBox.create(cc.size(100, 32), cc.Scale9Sprite.create(inputNameEditPNG));
      this.edit4roomId.setPlaceholderFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.edit4roomId.setPlaceHolder("127");
      this.edit4roomId.setPosition(515, 278);
      this.edit4roomId.setDelegate(this);
      this.edit4roomId.setFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.edit4roomId.setMaxLength(3);
      this.addChild(this.edit4roomId);

      // LabelTTF for realPlayerNum
      this.mRealPlayerNumLabel = cc.LabelTTF.create('真实玩家数:', 'Arial', 14);
      this.mRealPlayerNumLabel.setAnchorPoint(0, 0);
      this.mRealPlayerNumLabel.setPosition(387, 228);
      this.mRealPlayerNumLabel.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.addChild(this.mRealPlayerNumLabel);

      // EditBox for real player num
      this.edit4realPlayerNum = cc.EditBox.create(cc.size(100, 32), cc.Scale9Sprite.create(inputNameEditPNG));
      this.edit4realPlayerNum.setPlaceholderFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.edit4realPlayerNum.setPlaceHolder("1");
      this.edit4realPlayerNum.setPosition(515, 238);
      this.edit4realPlayerNum.setDelegate(this);
      this.edit4realPlayerNum.setFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.edit4realPlayerNum.setMaxLength(1);
      this.addChild(this.edit4realPlayerNum);

      this.confirmBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("confirmBig_1.png"),
        cc.Sprite.createWithSpriteFrameName("confirmBig_3.png"),
        this.confirmBtnCb,
        this
      );
      this.confirmBtn.setAnchorPoint(0, 0);
      this.confirmBtn.setPosition(704, 213);
      this.confirmMenu = cc.Menu.create(this.confirmBtn);
      this.confirmMenu.setPosition(0,0);
      this.addChild(this.confirmMenu);

      // help button
      this.helpBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("helpBtn_1.png"),
        cc.Sprite.createWithSpriteFrameName("helpBtn_2.png"),
        this.helpBtnCb,
        this
      );
      this.helpBtn.setAnchorPoint(0, 0);
      this.helpBtn.setPosition(223, 266);
      this.helpMenu = cc.Menu.create(this.helpBtn);
      this.helpMenu.setPosition(0,0);
      this.addChild(this.helpMenu);

      this.mWaitingMsg = cc.LabelTTF.create('请稍等 ...', 'Arial', 14);
      this.mWaitingMsg.setAnchorPoint(0, 0);
      this.mWaitingMsg.setPosition(696, 218);
      this.mWaitingMsg.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));

      // player num icon
      this.mPlayerNumSprite = cc.Sprite.create(playerNumPNG);
      this.mPlayerNumSprite.setAnchorPoint(0, 0);
      this.mPlayerNumSprite.setPosition(697, 236);

      this.mPlayerNumLabel = cc.LabelTTF.create('1/' + gMaxPlayerNum, 'Arial', 14);
      this.mPlayerNumLabel.setAnchorPoint(0, 0);
      this.mPlayerNumLabel.setPosition(715, 235);
      this.mPlayerNumLabel.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));

      bRet = true;
    }
    return bRet;
  },

  loginGameSvr: function() {
    gRoomId = this.edit4roomId.getText();
    gPlayerName = this.edit4name.getText();
    var realPlayerNum = this.edit4realPlayerNum.getText();
    var self = this;
    pomelo.init({
      host: gGameSvrAddr.ip,
      port: gGameSvrAddr.port,
      log: true
    }, function() {
      var routeA = 'gate.gateHandler.queryEntry';
      pomelo.request(routeA, {
        playerId: gPlayerId
      }, function(data) {
        pomelo.disconnect();
        pomelo.init({
          host: data.host,
          port: data.port,
          log: true
        }, function() {
          var routeB = "connector.entryHandler.enterRoom";
          pomelo.request(routeB, {
            roomId: gRoomId,
            playerId: gPlayerId,
            playerName: gPlayerName,
            realPlayerNum: realPlayerNum
          }, function(data) {
            // cc.log('enter ~ data = ', JSON.stringify(data));
            gSeatNum = parseInt(data.seatNumber);
            if(gSeatNum < 0) {
              self.mPlayerNumLabel.setString('已满');
              self.mWaitingMsg.setString('请刷新后选择其它房间 ...');
            }
          });
        });
      });
    });
  },

  confirmBtnCb:function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);

    this.removeChild(this.confirmMenu);
    this.addChild(this.mWaitingMsg);
    this.addChild(this.mPlayerNumSprite);
    this.addChild(this.mPlayerNumLabel);

    // login
    this.loginGameSvr();
  },

  helpBtnCb: function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);

    if(!!this.mHelpSprite) {
     this.removeChild(this.mHelpSprite);
    }
    this.mHelpSprite = new HelpSprite();
    this.mHelpSprite.setPosition(477, 325);
    this.addChild(this.mHelpSprite, 1);

    this.showAllItems(false);
  },

  showAllItems: function(isShow) {
    this.edit4name.setVisible(isShow);
    this.edit4roomId.setVisible(isShow);
    this.edit4realPlayerNum.setVisible(isShow);

    this.confirmBtn.setVisible(isShow);
    this.helpBtn.setVisible(isShow);
  },

  onUpdatePlayerNum: function(data) {
    this.mPlayerNumLabel.setString(data.num + '/' + gMaxPlayerNum);
  },

  replaceScene2mainGame: function() {
    var nextScene = cc.Scene.create();
    gMainGamePanelLayer = new MainGamePanelLayer(gPlayerName, gSeatNum);
    nextScene.addChild(gMainGamePanelLayer);
    cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1, nextScene));
  }
});


var MyGameScene = cc.Scene.extend({
  onEnter:function () {
    this._super();

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


    gInputNameLayer = new InputNameLayer;
    this.addChild(gInputNameLayer);

    // bg music
    gSharedEngine.setMusicVolume(0.2);
    gSharedEngine.setEffectsVolume(0.5);
    // gSharedEngine.playMusic(MUSIC_BACKGROUND, true);
  }
});

