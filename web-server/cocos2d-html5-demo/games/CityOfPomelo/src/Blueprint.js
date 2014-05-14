var adjustFactor = [1.7, 0.7];
var newPrefix = 'constructBuilding_';
var dismantlePrefix = 'dismantleBuilding_';
var maxFrameNum4new = 26;
var maxFrameNum4dismantle = 17;
var time4Animation = 1600;

var BlueprintSprite = cc.Sprite.extend({
  // ctor: function(playerId, id, typeId, costNum, canConstruct) {
  ctor: function(data) {
    this._super();
    // this.init(playerId, id, typeId, costNum, canConstruct);
    this.init(data);
  },

  // init: function(playerId, id, typeId, costNum, canConstruct) {
  init: function(data) {
    if(this._super()){
      this.data = data;
      this.mId = data.id;

      // building ornament of my building
      if(data.isMine) {
        this.mBdOrnamentSprite = cc.Sprite.create(bdOrnamentPNG);
        this.mBdOrnamentSprite.setPosition(19, 21);
        this.addChild(this.mBdOrnamentSprite);
      } else if(data.isPlayerX) {
        this.mBdXOrnamentSprite = cc.Sprite.create(bdXOrnamentPNG);
        this.mBdXOrnamentSprite.setAnchorPoint(0, 0);
        this.mBdXOrnamentSprite.setPosition(-4, -3);
        this.addChild(this.mBdXOrnamentSprite);
      }

      var image = 'blueprintAvailableSmall_' + data.typeId + '.png';
      this.initWithSpriteFrameName(image);
      this.w = this.getContentSize().width;
      this.h = this.getContentSize().height;

      // animation
      // cc.log('typeof isNewFlag = ', typeof this.data.isNewFlag);
      // cc.log('isNewFlag = ', this.data.isNewFlag);
      if(this.data.isNewFlag) {
        this.mNewSprite = cc.Sprite.createWithSpriteFrameName(newPrefix + "1.png");
        this.mNewSprite.setAnchorPoint(0, 0);
        this.mNewSprite.setPosition(-31, -27);
        this.addChild(this.mNewSprite);

        var animFrames = [];
        for (var i = 1; i <= maxFrameNum4new; i++) {
          var frame = gSpriteFrameCache.getSpriteFrame(newPrefix + i + ".png");
          animFrames.push(frame);
        }

        var rawAnim = cc.Animation.create(animFrames, 0.1);
        var animation = cc.Animate.create(rawAnim);
        // this.mNewSprite.runAction(cc.RepeatForever.create(animation));
        this.mNewSprite.runAction(animation);

        var self = this;
        setTimeout(function() {
          self.removeChild(self.mNewSprite);
          self.mNewSprite = null;
        }, time4Animation);
      }

      if(this.data.isDismantled) {
        this.mDismantledSprite = cc.Sprite.createWithSpriteFrameName(dismantlePrefix + "1.png");
        this.mDismantledSprite.setAnchorPoint(0, 0);
        this.mDismantledSprite.setPosition(-120, -73);
        this.mDismantledSprite.setScale(0.76);
        this.addChild(this.mDismantledSprite);

        var animFrames = [];
        for (var i = 1; i <= maxFrameNum4dismantle; i++) {
          var frame = gSpriteFrameCache.getSpriteFrame(dismantlePrefix + i + ".png");
          animFrames.push(frame);
        }

        var rawAnim = cc.Animation.create(animFrames, 0.1);
        var animation = cc.Animate.create(rawAnim);
        // this.mDismantledSprite.runAction(cc.RepeatForever.create(animation));
        this.mDismantledSprite.runAction(animation);
        gSharedEngine.playEffect(EFFECT_DISMANTLE);

        var self = this;
        setTimeout(function() {
          self.removeChild(self.mDismantledSprite);
          self.mDismantledSprite = null;
          gMainGamePanelLayer.removeChild(self);
        }, time4Animation);
      }

    }
  },

  initData: function() {
    // ...
  },

  showPurpleFlagAnimation: function() {
    if(!!this.data.desc) {
      this.mPurpleFlagAnimation = new PurpleFlagAnimation();
      this.mPurpleFlagAnimation.setAnchorPoint(0, 0);
      this.mPurpleFlagAnimation.setPosition(-10, 0);
      this.addChild(this.mPurpleFlagAnimation);
      gSharedEngine.playEffect(EFFECT_PURPLE_FLAG);

      var self = this;
      setTimeout(function() {
        self.removeChild(self.mPurpleFlagAnimation);
        self.mPurpleFlagAnimation = null;
      }, time4Animation);
    }
  },

  onTouchBegan: function(touch, event) {
    if(containsTouchLocation.bind(this, touch, true)()) {
      var pos = this.getPosition();
      var anchorP = calcBlueprintPopupAnchor(pos);
      if(!gPopupLayer) {
        gPopupLayer = new BlueprintPopupSprite;
        var runningScene = cc.Director.getInstance().getRunningScene();
        runningScene.addChild(gPopupLayer, 1);
      }
      var popupBgSize = gPopupLayer.getBgSize();
      var offsetX = 0
        , offsetY = 0;
      var signX = adjustFactor[0]
        , signY = adjustFactor[0];
      if(anchorP[0] > 0) {
        offsetX -= popupBgSize[0] + this.w*adjustFactor[1];
        signX = 0;
      }
      if(anchorP[1] > 0) {
        offsetY -= popupBgSize[1] + this.h*adjustFactor[1];
        signY = 0;
      }
      // gPopupLayer.initData(this.mPlayerId, this.mId, this.mTypeId, this.mCostNum, this.mCanConstruct);
      gPopupLayer.initData(this.data);
      var finalX = Math.floor(pos.x+signX*this.w+offsetX)
        , finalY = Math.floor(pos.y+signY*this.h+offsetY);
      gPopupLayer.setPosition(finalX, finalY);
      gPopupLayer.setVisible(true);
      return true;
    }
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
