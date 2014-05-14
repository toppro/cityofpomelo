var pomelo = window.pomelo;

var strDesc4Common = '选择获得两个金币, 或者一张图纸';

var SelectSource4CommonLayer = cc.Layer.extend({
  mRegisterDelegate: true,
  mBaseY: 423,
  mBlueprintSprite: [],
  mBlueprintSpritePos: [[465, 373], [533, 373]],

  ctor: function(blueprints) {
    this._super();
    this.init(blueprints);
  },

  init: function(blueprints) {
    var bRet = false;
    if (this._super()) {
      // bg
      var selectSourceBgSprite = cc.Sprite.create(selectSourceSmallPNG);
      selectSourceBgSprite.setAnchorPoint(0, 0);
      selectSourceBgSprite.setPosition(311, 348);
      this.addChild(selectSourceBgSprite);
      // desc msg
      if(this.mDescMsg) {
        this.removeChild(this.mDescMsg);
      }
      this.mDescMsg = cc.LabelTTF.create(strDesc4Common, 'Arial', 12);
      this.mDescMsg.setAnchorPoint(0, 0);
      this.mDescMsg.setPosition(326, 481);
      this.mDescMsg.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.addChild(this.mDescMsg);
      // select coin
      var selectCoinBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("selectCoin_1.png"),
        cc.Sprite.createWithSpriteFrameName("selectCoin_3.png"),
        this.selectCoinCb,
        this
      );
      selectCoinBtn.setAnchorPoint(0, 0);
      selectCoinBtn.setPosition(346, this.mBaseY);
      var selectCoinMenu = cc.Menu.create(selectCoinBtn);
      selectCoinMenu.setPosition(0,0);
      this.addChild(selectCoinMenu);
      // select blueprint_1
      var selectBlueprintBtn_1 = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("selectBlueprint_1.png"),
        cc.Sprite.createWithSpriteFrameName("selectBlueprint_3.png"),
        this.selectBlueprint1Cb,
        this
      );
      selectBlueprintBtn_1.setAnchorPoint(0, 0);
      selectBlueprintBtn_1.setPosition(451, this.mBaseY);
      var selectBlueprintMenu_1 = cc.Menu.create(selectBlueprintBtn_1);
      selectBlueprintMenu_1.setPosition(0,0);
      this.addChild(selectBlueprintMenu_1);
      // select blueprint_2
      var selectBlueprintBtn_2 = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("selectBlueprint_1.png"),
        cc.Sprite.createWithSpriteFrameName("selectBlueprint_3.png"),
        this.selectBlueprint2Cb,
        this
      );
      selectBlueprintBtn_2.setAnchorPoint(0, 0);
      selectBlueprintBtn_2.setPosition(520, this.mBaseY);
      var selectBlueprintMenu_2 = cc.Menu.create(selectBlueprintBtn_2);
      selectBlueprintMenu_2.setPosition(0,0);
      this.addChild(selectBlueprintMenu_2);
      // blueprint
      // this.mBlueprintSprite[0] = new BlueprintSprite(gPlayerId, blueprints[0].id, blueprints[0].card.typeId, blueprints[0].card.cost);
      var bpData = {playerId: gPlayerId, id: blueprints[0].id, typeId: blueprints[0].card.typeId, costNum: blueprints[0].card.cost, desc: blueprints[0].card.desc, canConstruct: false};
      this.mBlueprintSprite[0] = new BlueprintSprite(bpData);
      this.mBlueprintSprite[0].setAnchorPoint(0, 0);
      this.mBlueprintSprite[0].setPosition(this.mBlueprintSpritePos[0][0], this.mBlueprintSpritePos[0][1]);
      this.addChild(this.mBlueprintSprite[0]);

      // this.mBlueprintSprite[1] = new BlueprintSprite(gPlayerId, blueprints[1].id, blueprints[1].card.typeId, blueprints[1].card.cost);
      bpData = {playerId: gPlayerId, id: blueprints[1].id, typeId: blueprints[1].card.typeId, costNum: blueprints[1].card.cost, desc: blueprints[1].card.desc, canConstruct: false};
      this.mBlueprintSprite[1] = new BlueprintSprite(bpData);
      this.mBlueprintSprite[1].setAnchorPoint(0, 0);
      this.mBlueprintSprite[1].setPosition(this.mBlueprintSpritePos[1][0], this.mBlueprintSpritePos[1][1]);
      this.addChild(this.mBlueprintSprite[1]);
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
      if(!!gPopupLayer) {
        gPopupLayer.setVisible(false);
      }
      this.onExit();
    }
  },

  selectCoinCb:function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);
    this.setVisible(false);
    var route = "game.gameHandler.selectCoin";
    pomelo.request(route, {
      playerId: gPlayerId
    }, function() {
      // cc.log('selectCoin4common ret ...');
    });
  },

  selectBlueprint1Cb:function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);
    this.setVisible(false);
    var idL = [];
    idL.push(this.mBlueprintSprite[0].mId);

    var route = "game.gameHandler.selectBlueprint";
    pomelo.request(route, {
      playerId: gPlayerId,
      blueprintIdList: idL
    }, function() {
      cc.log('selectBlueprint1 ret ...');
    });
  },

  selectBlueprint2Cb:function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);
    this.setVisible(false);
    var idL = [];
    idL.push(this.mBlueprintSprite[1].mId);

    var route = "game.gameHandler.selectBlueprint";
    pomelo.request(route, {
      playerId: gPlayerId,
      blueprintIdList: idL
    }, function() {
      cc.log('selectBlueprint2 ret ...');
    });
  },

  onTouchBegan: function(touch, event) {
    // console.log('selectSource4Common ~ onTouchBegan is running ...');
    return true;
  },

  onTouchEnded:function (touch, event) {
    // console.log('selectSource4Common ~ onTouchEnded is running ...');
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

