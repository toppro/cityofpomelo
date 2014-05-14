var pomelo = window.pomelo;

gPlayerId = 0;

var gSeatNum = -1;

var GameLobbyLayer = cc.Layer.extend({
  mRoomNameStr: 'RoomOfPomelo',
  mRoomIdList: [],
  mRoomNameList: [],
  mPlayerNumList: [],
  mEnterRoomMenuList: [],
  mExitRoomMenuList: [],
  mRoomNumPerPage: 9,
  mBaseX4Id: 147,
  mBaseX4Name: 243,
  mBaseX4Num: 425,
  mBaseX4Room: 527,
  mBaseY: 491,
  mOffsetY: 42,
  mIdColorList: [48, 199, 106],
  mNameColorList: [73, 216, 222],
  mPageColorList: [255, 255, 255],
  mCurPageNum: 1,
  mMaxPageNum: 1,
  mMyRoomId: 0,

  ctor:function () {
    this._super();
    this.init();
  },

  init:function () {
    var bRet = false;
    if (this._super()) {
      gWinSize = cc.Director.getInstance().getWinSize();

      var panelBgSprite = cc.Sprite.create(inputPanelBgPNG);
      panelBgSprite.setAnchorPoint(0, 0);
      panelBgSprite.setPosition(0, 11);
      this.addChild(panelBgSprite);

      var bgSprite = cc.Sprite.create(gameLobbyPNG);
      bgSprite.setAnchorPoint(0, 0);
      var halfH = bgSprite.getContentSize().height / 2;
      bgSprite.setPosition(124, gWinSize.height/2-Math.floor(halfH));
      this.addChild(bgSprite);

      // room id list
      var blockSize = cc.size(82, 26);
      var i = 0;
      for(i = 0; i < this.mRoomNumPerPage+1; i++) {
        var tmpIdStr = i + 1;
        if(i >= this.mRoomNumPerPage) {
          tmpIdStr = '***';
        }
        this.mRoomIdList[i] = cc.LabelTTF.create(tmpIdStr, 'Arial', 16, blockSize, cc.TEXT_ALIGNMENT_CENTER);
        this.mRoomIdList[i].setAnchorPoint(0, 0);
        this.mRoomIdList[i].setPosition(this.mBaseX4Id, this.mBaseY-i*this.mOffsetY);
        this.mRoomIdList[i].setColor(new cc.Color3B(this.mIdColorList[0], this.mIdColorList[1], this.mIdColorList[2]));
        this.mRoomIdList[i].setVisible(i >= this.mRoomNumPerPage);
        this.addChild(this.mRoomIdList[i]);
      }

      // room name
      blockSize = cc.size(180, 26);
      for(i = 0; i < this.mRoomNumPerPage; i++) {
        this.mRoomNameList[i] = cc.LabelTTF.create(this.mRoomNameStr, 'Arial', 16, blockSize, cc.TEXT_ALIGNMENT_CENTER);
        this.mRoomNameList[i].setAnchorPoint(0, 0);
        this.mRoomNameList[i].setPosition(this.mBaseX4Name, this.mBaseY-i*this.mOffsetY);
        this.mRoomNameList[i].setColor(new cc.Color3B(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
        this.mRoomNameList[i].setVisible(false);
        this.addChild(this.mRoomNameList[i]);
      }

      blockSize = cc.size(180, 30);
      this.mEdit4Name = cc.EditBox.create(blockSize, cc.Scale9Sprite.create(inputNameEditPNG));
      this.mEdit4Name.setPlaceholderFontColor(cc.c3b(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
      this.mEdit4Name.setPlaceHolder(this.mRoomNameStr);
      this.mEdit4Name.setAnchorPoint(0, 0);
      this.mEdit4Name.setPosition(this.mBaseX4Name, this.mBaseY-i*this.mOffsetY+5);
      this.mEdit4Name.setDelegate(this);
      this.mEdit4Name.setFontColor(cc.c3b(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
      this.mEdit4Name.setMaxLength(12);
      this.addChild(this.mEdit4Name);

      // player num
      blockSize = cc.size(82, 26);
      for(i = 0; i < this.mRoomNumPerPage; i++) {
        this.mPlayerNumList[i] = cc.LabelTTF.create('6 / 6', 'Arial', 16, blockSize, cc.TEXT_ALIGNMENT_CENTER);
        this.mPlayerNumList[i].setAnchorPoint(0, 0);
        this.mPlayerNumList[i].setPosition(this.mBaseX4Num, this.mBaseY-i*this.mOffsetY);
        this.mPlayerNumList[i].setColor(new cc.Color3B(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
        this.mPlayerNumList[i].setVisible(false);
        this.addChild(this.mPlayerNumList[i]);
      }

      blockSize = cc.size(73, 30);
      this.mEdit4Num = cc.EditBox.create(blockSize, cc.Scale9Sprite.create(inputNameEditPNG));
      this.mEdit4Num.setPlaceholderFontColor(cc.c3b(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
      this.mEdit4Num.setPlaceHolder(1);
      this.mEdit4Num.setAnchorPoint(0, 0);
      this.mEdit4Num.setPosition(this.mBaseX4Num+8, this.mBaseY-i*this.mOffsetY+5);
      this.mEdit4Num.setDelegate(this);
      this.mEdit4Num.setFontColor(cc.c3b(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
      this.mEdit4Num.setMaxLength(1);
      this.addChild(this.mEdit4Num);

      // create room
      this.mCreateRoomBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("createRoom_1.png"),
        cc.Sprite.createWithSpriteFrameName("createRoom_2.png"),
        this.createRoomBtnCb,
        this
      );
      this.mCreateRoomBtn.setAnchorPoint(0, 0);
      this.mCreateRoomBtn.setPosition(527, 118);
      this.mCreateRoomMenu = cc.Menu.create(this.mCreateRoomBtn);
      this.mCreateRoomMenu.setPosition(0,0);
      this.addChild(this.mCreateRoomMenu);

      // page
      blockSize = cc.size(100, 26);
      this.mLabelCurPage = cc.LabelTTF.create(this.mCurPageNum + ' / ' + this.mMaxPageNum + ' 页', 'Arial', 14, blockSize, cc.TEXT_ALIGNMENT_LEFT);
      this.mLabelCurPage.setAnchorPoint(0, 0);
      this.mLabelCurPage.setPosition(151, 84);
      this.mLabelCurPage.setColor(new cc.Color3B(this.mPageColorList[0], this.mPageColorList[1], this.mPageColorList[2]));
      this.addChild(this.mLabelCurPage);

      // previous page
      this.mPrePageBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("preNextPage_1.png"),
        cc.Sprite.createWithSpriteFrameName("preNextPage_3.png"),
        this.prePageBtnCb,
        this
      );
      this.mPrePageBtn.setAnchorPoint(0, 0);
      this.mPrePageBtn.setPosition(496, 93);
      this.mPrePageMenu = cc.Menu.create(this.mPrePageBtn);
      this.mPrePageMenu.setPosition(0,0);
      this.addChild(this.mPrePageMenu);

      // next page
      this.mNextPageBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("preNextPage_5.png"),
        cc.Sprite.createWithSpriteFrameName("preNextPage_7.png"),
        this.nextPageBtnCb,
        this
      );
      this.mNextPageBtn.setAnchorPoint(0, 0);
      this.mNextPageBtn.setPosition(560, 93);
      this.mNextPageMenu = cc.Menu.create(this.mNextPageBtn);
      this.mNextPageMenu.setPosition(0,0);
      this.addChild(this.mNextPageMenu);

      // refresh page
      this.mRefreshBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("refreshBtn_1.png"),
        cc.Sprite.createWithSpriteFrameName("refreshBtn_3.png"),
        this.refreshRoomListCb,
        this
      );
      this.mRefreshBtn.setAnchorPoint(0, 0);
      this.mRefreshBtn.setPosition(465, 95);
      this.mRefreshMenu = cc.Menu.create(this.mRefreshBtn);
      this.mRefreshMenu.setPosition(0,0);
      this.addChild(this.mRefreshMenu);

      this.makeEnterRoomCb();
      for(i = 0; i < this.mRoomNumPerPage; i++) {
        // enter room
        var enterRoomBtn = cc.MenuItemSprite.create(
          cc.Sprite.createWithSpriteFrameName("enterRoom_1.png"),
          cc.Sprite.createWithSpriteFrameName("enterRoom_2.png"),
          this['enterRoomBtnCb_' + i],
          this
        );
        enterRoomBtn.setAnchorPoint(0, 0);
        enterRoomBtn.setPosition(this.mBaseX4Room, this.mBaseY-i*this.mOffsetY+7);
        this.mEnterRoomMenuList[i] = cc.Menu.create(enterRoomBtn);
        this.mEnterRoomMenuList[i].setPosition(0, 0);
        this.mEnterRoomMenuList[i].setVisible(false);
        this.addChild(this.mEnterRoomMenuList[i]);

        // exit room
        var exitRoomBtn = cc.MenuItemSprite.create(
          cc.Sprite.createWithSpriteFrameName("exitRoom_1.png"),
          cc.Sprite.createWithSpriteFrameName("exitRoom_2.png"),
          this.exitRoomBtnCb,
          this
        );
        exitRoomBtn.setAnchorPoint(0, 0);
        exitRoomBtn.setPosition(this.mBaseX4Room, this.mBaseY-i*this.mOffsetY+7);
        this.mExitRoomMenuList[i] = cc.Menu.create(exitRoomBtn);
        this.mExitRoomMenuList[i].setPosition(0, 0);
        this.mExitRoomMenuList[i].setVisible(false);
        this.addChild(this.mExitRoomMenuList[i]);
      }

      // help btn
      this.helpBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("helpBtn_1.png"),
        cc.Sprite.createWithSpriteFrameName("helpBtn_2.png"),
        this.helpBtnCb,
        this
      );
      this.helpBtn.setAnchorPoint(0, 0);
      this.helpBtn.setPosition(700, 199);
      this.helpMenu = cc.Menu.create(this.helpBtn);
      this.helpMenu.setPosition(0,0);
      this.addChild(this.helpMenu);

      // refresh room list
      this.refreshRoomListCb();

      bRet = true;
    }
    return bRet;
  },

  showAllItems: function(isShow) {
    this.mEdit4Name.setVisible(isShow);
    this.mEdit4Num.setVisible(isShow);
    this.mCreateRoomMenu.setVisible(isShow);
    this.mPrePageMenu.setVisible(isShow);
    this.mNextPageMenu.setVisible(isShow);
    this.mRefreshMenu.setVisible(isShow);
    this.helpBtn.setVisible(isShow);

    if(!isShow) {
      // hide
      for(var i = 0; i < this.mRoomNumPerPage; i++) {
        // enter room
        this.mEnterRoomMenuList[i].setVisible(isShow);
        // exit room
        this.mExitRoomMenuList[i].setVisible(isShow);
      }
    } else {
      // show
      this.refreshRoomListCb();
    }
  },

  helpBtnCb: function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);

    if(!!this.mHelpSprite) {
      this.removeChild(this.mHelpSprite);
    }
    this.mHelpSprite = new HelpSprite();
    this.mHelpSprite.setPosition(474, 325);
    this.addChild(this.mHelpSprite);

    this.showAllItems(false);
  },

  onUpdateRoomList: function(data) {
    if(!data) {
      return;
    }

    if(!!data.curPageNum && !!data.maxPageNum) {
      this.mCurPageNum = data.curPageNum;
      this.mMaxPageNum = data.maxPageNum;
      this.mLabelCurPage.setString(data.curPageNum + ' / ' + data.maxPageNum + ' 页');
    }

    for(var i = 0; i < this.mRoomNumPerPage; i++) {
     this.mRoomIdList[i].setVisible(false);
     this.mRoomNameList[i].setVisible(false);
     this.mPlayerNumList[i].setVisible(false);
     this.mEnterRoomMenuList[i].setVisible(false);
     this.mExitRoomMenuList[i].setVisible(false);
    }
    this.mCreateRoomMenu.setVisible(false);

    var j = 0;
    for(var k in data.roomInfoList) {
      var d = data.roomInfoList[k];
      this.mRoomIdList[j].setString(d.roomId);
      this.mRoomIdList[j].setVisible(true);

      this.mRoomNameList[j].setString(d.roomName);
      this.mRoomNameList[j].setVisible(true);

      this.mPlayerNumList[j].setString(d.playerNum);
      this.mPlayerNumList[j].setVisible(true);

      // cc.log('this.mMyRoomId, d.roomId = ', this.mMyRoomId, d.roomId);
      if(this.mMyRoomId === d.roomId) {
        this.mExitRoomMenuList[j].setVisible(true);
      }

      ++j;
    }

    var isShowExit = false;
    if(this.mMyRoomId > 0) {
      isShowExit = true;
    }

    if(!isShowExit) {
      this.mCreateRoomMenu.setVisible(true);

      j = 0;
      for(var k in data.roomInfoList) {
        var d = data.roomInfoList[k];

        if(!d.isFull) {
          this.mEnterRoomMenuList[j].setVisible(true);
        }

        ++j;
      }
    }
  },

  replaceScene2MainGame: function() {
    var nextScene = cc.Scene.create();
    gMainGamePanelLayer = new MainGamePanelLayer(gPlayerName, gSeatNum);
    nextScene.addChild(gMainGamePanelLayer);
    cc.Director.getInstance().replaceScene(cc.TransitionSlideInR.create(1, nextScene));
  },

  exitRoomBtnCb: function(sender){
    var self = this;
    var route = "game.gameHandler.exitRoom";
    pomelo.request(route, {
      playerId: gPlayerId
    }, function(data) {
      self.mMyRoomId = 0;
      // console.log('exitRoom ~ data = ', data);
      self.onUpdateRoomList(data.ret);
    });
  },

  getRoomList: function(pageNum){
    // cc.log('GetRoomList ~ pageNum = ', pageNum);
    var self = this;
    var route = "game.gameHandler.getRoomList";
    pomelo.request(route, {
      pageNum: pageNum
    }, function(data) {
      // console.log('GetRoomList ~ data = ', data);
      self.onUpdateRoomList(data.ret);
    });
  },

  prePageBtnCb: function(sender){
    var pageNum = Math.max(this.mCurPageNum - 1, 1);
    this.getRoomList(pageNum);
  },

  nextPageBtnCb: function(sender){
    var pageNum = Math.min(this.mCurPageNum + 1, this.mMaxPageNum);
    this.getRoomList(pageNum);
  },

  refreshRoomListCb: function(sender){
    this.getRoomList(this.mCurPageNum);
  },

  makeEnterRoomCb: function(){
    var self = this;
    for(var i = 0; i < this.mRoomNumPerPage; i++) {
      (function(j) {
        self['enterRoomBtnCb_' + j] = function(sender){
          var roomId = self.mRoomIdList[j].getString();
          if(!!roomId) {
            // cc.log('enterRoomBtnCb_: roomId = ', roomId);
            var route = "connector.entryHandler.enterRoom";
            pomelo.request(route, {
              playerId: gPlayerId,
              playerName: gPlayerName,
              roomId: roomId
            }, function(data) {
              self.mMyRoomId = parseInt(data.roomId);
              // console.log('enterRoom: data = ', data);
              gSeatNum = parseInt(data.seatNum);
              if(gSeatNum < 0) {
                self.refreshRoomListCb();
              }
            });
          }
        };
      })(i);
    }
  },

  createRoomBtnCb: function(sender){
    // audio effect
    gSharedEngine.playEffect(EFFECT_CONFIRM);

    // create room
    var self = this;
    var realPlayerNum = this.mEdit4Num.getText();
    var roomName = this.mEdit4Name.getText();
    var route = "connector.entryHandler.enterRoom";
    pomelo.request(route, {
      playerId: gPlayerId,
      playerName: gPlayerName,
      realPlayerNum: realPlayerNum,
      roomId: -1,
      roomName: roomName
    }, function(data) {
      self.mMyRoomId = parseInt(data.roomId);
      // console.log('enterRoom: data = ', data);
      gSeatNum = parseInt(data.seatNum);
      if(gSeatNum < 0) {
        self.refreshRoomListCb();
      }
    });
  }

});

