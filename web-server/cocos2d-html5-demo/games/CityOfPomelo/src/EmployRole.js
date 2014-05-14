var pomelo = window.pomelo;
var ornamentPrefix = 'employRoleOrnament_';
var maxFrameNum = 20;
var strEmploy = ' 正在雇佣角色 ...';
var time4employ = 25; // seconds

var EmployRoleLayer = cc.Layer.extend({
  mRoleId: -1,
  mBaseX: 139,
  mOffset: 65,
  mBaseY: 415,
  mRadius: 130,
  mCenterX: 317,
  mCenterY: 346,
  mRoleSpriteList: [],
  mInitSelectedRoleMark: false,
  mRegisterDelegate: true,

  ctor:function () {
    this._super();
    this.init();
  },

  init:function () {
    var bRet = false;
    if (this._super()) {
      // this.setKeyboardEnabled(true);
      gWinSize = cc.Director.getInstance().getWinSize();
      var bgSprite = cc.Sprite.create(employRolePNG);
      bgSprite.setAnchorPoint(0, 0);
      bgSprite.setPosition(124, 169);
      this.addChild(bgSprite);

      // animation
      var ornamentSprite = cc.Sprite.createWithSpriteFrameName(ornamentPrefix + "1.png");
      ornamentSprite.setAnchorPoint(0, 0);
      ornamentSprite.setPosition(136, 178);
      this.addChild(ornamentSprite);

      var animFrames = [];
      for (var i = 1; i <= maxFrameNum; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(ornamentPrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.125);
      var animation = cc.Animate.create(rawAnim);
      ornamentSprite.runAction(cc.RepeatForever.create(animation));

      this.mTipsStr = cc.LabelTTF.create(strEmploy, 'Arial', 14);
      this.mTipsStr.setAnchorPoint(0, 0);
      this.mTipsStr.setPosition(135, 529);
      this.mTipsStr.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
      this.addChild(this.mTipsStr);

      // mark
      this.mSelectedRoleMarkPNG = cc.Sprite.create(employRoleMarkPNG);
      this.mSelectedRoleMarkPNG.setPosition(gHidePos.x, gHidePos.y);
      this.mSelectedRoleMarkPNG.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.FadeIn.create(1.0), cc.FadeOut.create(1.0))));
      this.addChild(this.mSelectedRoleMarkPNG, 1);

      gNotification.addObserver(this, this.onSelectRole, MSG_SELECT_ROLE);

      this.mRoleXPNG = cc.Sprite.create(roleXPNG);
      this.mRoleXPNG.setPosition(319, 342);
      this.addChild(this.mRoleXPNG);

      var x1 = Math.floor(Math.random() * gMaxRoleId + gMinRoleId);
      var x2 = Math.floor(x1 + gMaxRoleId/2) % gMaxRoleId + 1;

      for(var i = gMinRoleId; i <= gMaxRoleId; i++) {
        var available = false;
        if(i === x1 || i === x2) {
          // available = false;
        }
        if(!this.mInitSelectedRoleMark && available) {
          this.onSelectRole(i);
          this.mInitSelectedRoleMark = true;
        }
        this.mRoleSpriteList[i] = new Role4SelectSprite(available, i, MSG_SELECT_ROLE);
        // this.mRoleSpriteList[i].setPosition(this.mBaseX+i*this.mOffset, this.mBaseY);
        var pos = this.calcPosByDegree(i);
        this.mRoleSpriteList[i].setPosition(pos.x, pos.y);
        this.addChild(this.mRoleSpriteList[i]);
      }

      this.mConfirmBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("confirmBig_1.png"),
        cc.Sprite.createWithSpriteFrameName("confirmBig_3.png"),
        this.confirmBtnCb,
        this
      );
      this.mConfirmBtn.setAnchorPoint(0, 0);
      this.mConfirmBtn.setPosition(704, 194);

      this.mMenu = cc.Menu.create(this.mConfirmBtn);
      this.mMenu.setPosition(0,0);
      this.addChild(this.mMenu);

      bRet = true;
    }
    return bRet;
  },

  calcPosByDegree: function(roleId){
    roleId = parseInt(roleId);
    var d = (360 / gMaxRoleId) * (roleId - 1);
    var rad = Math.PI * d / 180;
    var x = Math.floor(this.mCenterX + this.mRadius * Math.cos(rad));
    var y = Math.floor(this.mCenterY + this.mRadius * Math.sin(rad));
    return {x: x, y: y};
  },

  confirmBtnCb:function(sender){
    if(!!gMainGamePanelLayer && this.mRoleId > 0) {
      gMainGamePanelLayer.updateRoleId(this.mRoleId);
    }
    this.stopCountdown();
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);
    this.setVisible(false);
  },

  updateRoleSpriteList: function(data) {
    // not available roles
    for(var i = gMinRoleId; i <= gMaxRoleId; i++) {
      this.removeChild(this.mRoleSpriteList[i]);
      this.mRoleSpriteList[i] = new Role4SelectSprite(false, i, MSG_SELECT_ROLE);
      // this.mRoleSpriteList[i].setPosition(this.mBaseX+i*this.mOffset, this.mBaseY);
      var pos = this.calcPosByDegree(i);
      this.mRoleSpriteList[i].setPosition(pos.x, pos.y);
      this.addChild(this.mRoleSpriteList[i]);
    }
    // available roles
    if(data.playerId === gPlayerId) {
      this.mTipsStr.setString('我' + strEmploy);
      this.mMenu.setVisible(true);
      this.mInitSelectedRoleMark = false;
      for(var j in data.availableIdList4select) {
        var id = data.availableIdList4select[j];
        // cc.log('id = ', id);
        // cc.log('mInitSelectedRoleMark = ', this.mInitSelectedRoleMark);
        if(!this.mInitSelectedRoleMark) {
          this.onSelectRole(id);
          this.mInitSelectedRoleMark = true;
        }
        this.removeChild(this.mRoleSpriteList[id]);
        this.mRoleSpriteList[id] = new Role4SelectSprite(true, id, MSG_SELECT_ROLE);
        // this.mRoleSpriteList[id].setPosition(this.mBaseX+id*this.mOffset, this.mBaseY);
        var pos = this.calcPosByDegree(id);
        this.mRoleSpriteList[id].setPosition(pos.x, pos.y);
        this.addChild(this.mRoleSpriteList[id]);
      }
    } else {
      this.mTipsStr.setString(data.playerName + strEmploy);
      this.mMenu.setVisible(false);
      this.mSelectedRoleMarkPNG.setPosition(gHidePos.x, gHidePos.y);
    }
    // countdown
    this.mCountdownSprite = new CountdownSprite(this, time4employ, this.confirmBtnCb);
    this.mCountdownSprite.setAnchorPoint(0, 0);
    this.mCountdownSprite.setPosition(gCountdownBoardPos[0], gCountdownBoardPos[1]);
  },

  stopCountdown: function() {
    if(!!this.mCountdownSprite) {
      this.mCountdownSprite.stop();
      this.mCountdownSprite = null;
    }
  },

  onSelectRole: function(roleId) {
    this.mRoleId = roleId;
    // this.mSelectedRoleMarkPNG.setPosition(this.mBaseX+this.mRoleId*this.mOffset, this.mBaseY);
    var pos = this.calcPosByDegree(roleId);
    this.mSelectedRoleMarkPNG.setPosition(pos.x, pos.y);
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

  onTouchBegan: function(touch, event) {
    // console.log('employRole ~ onTouchBegan is running ...');
    return true;
  },

  onTouchEnded:function (touch, event) {
    // console.log('employRole ~ onTouchEnded is running ...');
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

