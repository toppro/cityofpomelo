var pomelo = window.pomelo;

var BlueprintPopupSprite = cc.Sprite.extend({
  mBgW: 0,
  mBgH: 0,
  mRegisterDelegate: true,

  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    var bRet = false;
    if(this._super()) {
      this.initWithFile(blueprintDescBgPNG);
      this.setAnchorPoint(0, 0);
      var mySize = this.getContentSize();
      this.mBgW = mySize.width;
      this.mBgH = mySize.height;

      var blueprintFrameSprite = cc.Sprite.create(blueprintFramePNG);
      blueprintFrameSprite.setAnchorPoint(0, 0);
      blueprintFrameSprite.setPosition(18, 10);
      this.addChild(blueprintFrameSprite);

      // dismantle
      var dismantleBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("dismantle_1.png"),
        cc.Sprite.createWithSpriteFrameName("dismantle_2.png"),
        this.dismantleBtnCb,
        this
      );
      dismantleBtn.setAnchorPoint(0, 0);
      dismantleBtn.setPosition(143, 132);
      this.dismantleMenu = cc.Menu.create(dismantleBtn);
      this.dismantleMenu.setPosition(0, 0);
      // this.addChild(this.dismantleMenu);

      // building function description
      this.mDescLabel = cc.LabelTTF.create('Building', 'Arial', 13, cc.size(198, 59), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
      this.mDescLabel.setAnchorPoint(0, 0);
      this.mDescLabel.setPosition(198, 20);
      this.mDescLabel.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.addChild(this.mDescLabel);
      this.mDescLabel.setString('');

      // close
      var closeBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("close_1.png"),
        cc.Sprite.createWithSpriteFrameName("close_3.png"),
        this.closeBtnCb,
        this
      );
      closeBtn.setAnchorPoint(0, 0);
      closeBtn.setPosition(372, 160);
      var closeMenu = cc.Menu.create(closeBtn);
      closeMenu.setPosition(0,0);
      this.addChild(closeMenu);

      bRet = true;
    }
    return bRet;
  },

  initData: function(data) {
    this.mPlayerId = data.playerId;
    this.mId = data.id;
    this.mTypeId = data.typeId;
    this.mCostNum = data.costNum;
    this.mDesc = data.desc;
    this.mCanConstruct = data.canConstruct;

    if(!!this.mBlueprintImage) {
      this.removeChild(this.mBlueprintImage);
    }
    this.mBlueprintImage = cc.Sprite.createWithSpriteFrameName('blueprintAvailableBig_' + this.mTypeId + '.png');
    this.mBlueprintImage.setAnchorPoint(0, 0);
    this.mBlueprintImage.setPosition(20, 18);
    this.addChild(this.mBlueprintImage);

    if(!!this.mConstructMenu) {
      this.removeChild(this.mConstructMenu);
    }
    if(!!this.mBlueprintName) {
      this.removeChild(this.mBlueprintName);
    }
    if(this.mCanConstruct) {
      this.mConstructBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName('blueprintName_' + this.mTypeId + '.png'),
        cc.Sprite.createWithSpriteFrameName('blueprintNameDecolor_' + this.mTypeId + '.png'),
        this.constructBtnCb,
        this
      );
      this.mConstructBtn.setAnchorPoint(0, 0);
      this.mConstructBtn.setPosition(253, 131);
      this.mConstructMenu = cc.Menu.create(this.mConstructBtn);
      this.mConstructMenu.setPosition(0,0);
      this.addChild(this.mConstructMenu);
    } else {
      this.mBlueprintName = cc.Sprite.createWithSpriteFrameName('blueprintName_' + this.mTypeId + '.png');
      this.mBlueprintName.setAnchorPoint(0, 0);
      this.mBlueprintName.setPosition(253, 131);
      this.addChild(this.mBlueprintName);
    }

    if(!!this.mCostNumImage) {
      this.removeChild(this.mCostNumImage);
    }
    this.mCostNumImage = cc.Sprite.createWithSpriteFrameName('coinBig_' + this.mCostNum + '.png');
    this.mCostNumImage.setAnchorPoint(0, 0);
    this.mCostNumImage.setPosition(275, 106);
    this.addChild(this.mCostNumImage);

    this.mDescLabel.setString(this.mDesc);

    if(!!this.dismantleMenu) {
      this.removeChild(this.dismantleMenu);
    }
    if(gShowDismantleFlag && !this.mCanConstruct) {
      this.addChild(this.dismantleMenu);
    }
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

  constructBtnCb: function(sender){
    this.setVisible(false);
    var route = "game.gameHandler.constructBuilding";
    pomelo.request(route, {
      playerId: gPlayerId,
      blueprintId: this.mId
    }, function(data) {
      /*
      if(!data.ret) {
        gSharedEngine.playEffect(EFFECT_WARNING);
      }
      */
    });
  },

  dismantleBtnCb: function(sender){
    gShowDismantleFlag = false;

    var route = "game.gameHandler.dismantleBuilding";
    pomelo.request(route, {
      playerId: gPlayerId,
      targetId: this.mPlayerId,
      buildingId: this.mId
    }, function(data) {
      // cc.log('dismantleBuilding ~ data', JSON.stringify(data));
    });

    this.setVisible(false);
  },

  closeBtnCb:function(sender){
    this.setVisible(false);
  },

  getBgSize: function() {
    return [this.mBgW, this.mBgH];
  },

  onTouchBegan: function(touch, event) {
    // console.log('popup ~ onTouchBegan is running ...');
    if(containsTouchLocation.bind(this, touch, true)()) {
      return true;
    } else {
      return false;
    }
  },

  onTouchEnded:function (touch, event) {
    // console.log('popup ~ onTouchEnded is running ...');
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

