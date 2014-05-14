var pomelo = window.pomelo;

var eDesc = {
  // key is roleId
  1: '选择一个要暗杀的角色, 被杀的角色在本回合失去行动力, 回合结束才能表明身份.',
  2: '选择一个要偷取的角色, 轮到该角色行动时获得对应玩家所有的金钱, 不能对刺客和被暗杀的角色使用.'
};

var eStatus = {
  // key is roleId
  1: killStatusPNG, // kill
  2: stealStatusPNG  // steal
};

var eMsg = {
  // key is roleId
  1: MSG_KILL_ROLE,
  2: MSG_STEAL_ROLE
};

var KillOrStealLayer = cc.Layer.extend({
  mRegisterDelegate: true,
  mMyRoleId: -1,
  mTargetRoleId: -1,
  mRole4SelectSprite: [],
  mBaseX: 24,
  mOffset: 88,
  mBaseY: 454,
  mBaseX4Status: 29,
  mBaseY4Status: 460,
  mDescMsg: null,
  mStatus4Act: null,
  mSelectedRoleMarkPNG: null,
  mActionMsg: null,

  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    var bRet = false;
    if (this._super()) {
      var winSize = cc.Director.getInstance().getWinSize();

      var roleListBgSprite = cc.Sprite.create(roleListBgPNG);
      roleListBgSprite.setAnchorPoint(0, 1);
      roleListBgSprite.setPosition(52, winSize.height/2+223);
      this.addChild(roleListBgSprite);

      var confirmBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("confirmSmall_1.png"),
        cc.Sprite.createWithSpriteFrameName("confirmSmall_3.png"),
        this.confirmBtnCb,
        this
      );
      confirmBtn.setAnchorPoint(0, 0);
      confirmBtn.setPosition(410, 376);
      var confirmMenu = cc.Menu.create(confirmBtn);
      confirmMenu.setPosition(0,0);
      this.addChild(confirmMenu);

      var cancelBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("cancelSmall_1.png"),
        cc.Sprite.createWithSpriteFrameName("cancelSmall_3.png"),
        this.cancelBtnCb,
        this
      );
      cancelBtn.setAnchorPoint(0, 0);
      cancelBtn.setPosition(470, 376);
      var cancelMenu = cc.Menu.create(cancelBtn);
      cancelMenu.setPosition(0,0);
      this.addChild(cancelMenu);

      bRet = true;
    }
    return bRet;
  },

  initData: function(roleId, data) {
    this.mMyRoleId = roleId;
    // desc msg
    if(this.mDescMsg) {
      this.removeChild(this.mDescMsg);
    }
    this.mDescMsg = cc.LabelTTF.create(eDesc[this.mMyRoleId], 'Arial', 12);
    this.mDescMsg.setAnchorPoint(0, 0);
    this.mDescMsg.setPosition(67, 516);
    this.mDescMsg.setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
    this.addChild(this.mDescMsg);
    // status
    if(this.mStatus4Act) {
      this.removeChild(this.mStatus4Act);
    }
    this.mStatus4Act = cc.Sprite.createWithSpriteFrameName(eStatus[this.mMyRoleId]);
    this.mStatus4Act.setAnchorPoint(0, 0);
    this.mStatus4Act.setPosition(gHidePos.x, gHidePos.y);
    this.addChild(this.mStatus4Act, 1);
    // mark
    if(!this.mSelectedRoleMarkPNG) {
      this.mSelectedRoleMarkPNG = cc.Sprite.create(selectedRoleMarkPNG);
      this.mSelectedRoleMarkPNG.setPosition(gHidePos.x, gHidePos.y);
      this.addChild(this.mSelectedRoleMarkPNG, 1);
    } else {
      this.mSelectedRoleMarkPNG.setPosition(gHidePos.x, gHidePos.y);
    }

    gNotification.addObserver(this, this.onKillRole, MSG_KILL_ROLE);
    gNotification.addObserver(this, this.onStealRole, MSG_STEAL_ROLE);

    for(var i = gMinRoleId; i <= gMaxRoleId; i++) {
      var available = true;
      if(data.killOrStealIdList.indexOf(i) === -1) {
        available = false;
      }
      if(this.mRole4SelectSprite[i]) {
        this.removeChild(this.mRole4SelectSprite[i]);
      }
      this.mRole4SelectSprite[i] = new Role4SelectSprite(available, i, eMsg[this.mMyRoleId]);
      this.mRole4SelectSprite[i].setPosition(this.mBaseX+i*this.mOffset, this.mBaseY);
      this.addChild(this.mRole4SelectSprite[i]);
    }
  },

  onKillRole: function(roleId) {
    if(this.mMyRoleId === roleId) {
      return;
    }
    this.mSelectedRoleMarkPNG.setPosition(this.mBaseX+roleId*this.mOffset, this.mBaseY+1);
    this.mStatus4Act.setPosition(this.mBaseX4Status+roleId*this.mOffset, this.mBaseY4Status);
    this.mTargetRoleId = roleId;
    this.mActionMsg = MSG_KILL_ROLE;
    // console.log('OnKillRole is running ...');
  },

  onStealRole: function(roleId) {
    if(this.mMyRoleId === roleId) {
      return;
    }
    this.mSelectedRoleMarkPNG.setPosition(this.mBaseX+roleId*this.mOffset, this.mBaseY+1);
    this.mStatus4Act.setPosition(this.mBaseX4Status+roleId*this.mOffset, this.mBaseY4Status);
    this.mTargetRoleId = roleId;
    this.mActionMsg = MSG_STEAL_ROLE;
    console.log('OnStealRole is running ...');
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

  confirmBtnCb:function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);
    this.setVisible(false);
    if(this.mActionMsg === MSG_KILL_ROLE) {
      var route = "game.gameHandler.kill";
      pomelo.request(route, {
        playerId: gPlayerId,
        targetRoleId: this.mTargetRoleId
      }, function(data) {
        cc.log('kill ret: data = ', data);
      });
    } else if(this.mActionMsg === MSG_STEAL_ROLE) {
      var route = "game.gameHandler.steal";
      pomelo.request(route, {
        playerId: gPlayerId,
        targetRoleId: this.mTargetRoleId
      }, function() {
        cc.log('steal ret ...');
      });
    }
  },

  cancelBtnCb:function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CANCEL);
    this.setVisible(false);
  },

  onTouchBegan: function(touch, event) {
    console.log('killOrSteal ~ onTouchBegan is running ...');
    return true;
  },

  onTouchEnded:function (touch, event) {
    console.log('killOrSteal ~ onTouchEnded is running ...');
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

