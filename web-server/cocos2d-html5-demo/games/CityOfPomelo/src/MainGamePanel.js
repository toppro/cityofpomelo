var pomelo = window.pomelo;

// var gRobotTimeout = 3000;

var time4action = 30; // seconds

var MainGamePanelLayer = cc.Layer.extend({
  mMaxRole: 9,
  mRoleId: -1,
  mCurRoleId: -1,
  mNameColorList: [231, 133, 156],
  mCoinColorList: [48, 199, 106],
  mBlueprintColorList: [73, 216, 222],
  mScoreColorList: [255, 23, 85],
  mBlueprintPosList: [[248, 65], [297, 65], [248, 15], [297, 15]],
  mSkillDict: {1: true, 2: true, 3: true, 8: true}, // assassin, thief, magician, warlord
  mSkillOrnament: {1: 'roleSkillOrnamentRed.png', 2: 'roleSkillOrnamentBlue.png', 3: 'roleSkillOrnamentBlue.png', 8: 'roleSkillOrnamentRed.png'}, // assassin, thief, magician, warlord
  mTaxesEffect: EFFECT_WARNING,
  mRoleXList: [],
  mRoleXAnimation: null,
  mExchangeXList: [],
  mPlayerIdXList: [],
  mCrownXList: [],
  mSeatNumberDict: {},
  mSeatNumberXList: [],
  mNameXList: [],
  mCoinXList: [],
  mBlueprintXList: [],
  mScoreXList: [],
  mStatus4Me: [],
  mStatusIdx4Me: 0,
  mStatus4PlayerX: [[], [], [], [], []],
  mStatusIdx4PlayerX: [],
  mStatus4Role: [],
  mStatusIdx4Role: [],
  mCrown4Me: null,
  mBaseX4MyBuilding: 393,
  mBaseY4MyBuilding: 220,
  mBaseX4Player: 34,
  mOffset4Player: 193,
  mBaseY4Player: 595,
  mBaseX4Crown: 67,
  mBaseY4Crown: 562,
  mBaseX4SeatNumber: 64,
  mBaseY4SeatNumber: 581,
  mBaseX4Name: 67,
  mBaseY4Name: 607,
  mBaseX4Coin: 105,
  mBaseY4Coin: 590,
  mBaseX4Blueprint: 135,
  mBaseX4Score: 165,
  mBaseX4Mark: 930,
  mBaseX4Arrow: 872,
  mOffset4Mark: 38,
  mBaseY4Mark: 523,
  mBaseY4Arrow: 510,
  mBaseX4Status: 145,
  mOffset4Status: 29,
  mBaseY4Status: 169,
  mBaseX4RoleStatus: 871,
  mBaseY4RoleStatus: 509,
  mBaseX4Building: 7,
  mBaseX4Column: 49,
  mBaseY4Building: 483,
  mBaseX4Row: 50,
  mBaseX4StatusX: 87,
  mBaseY4StatusX: 556,
  mKillOrStealLayer: null,
  mExchangeCardLayer: null,
  mSelectSource4CommonLayer: null,
  mZ4ExchangeWithPlayer: 2,
  mZ4RoleBgSprite: 2,
  mZ4RoleIconSprite: 1,
  mZ4Popup: 1,
  mZ4WinnerFlag: 3,
  mZ4Animation: 3,
  mTime4Animation: 2500,
  mPos4Animation: [347, 161],

  mBlueprintSprite: [],
  mBuildingSprite: [],
  mBuildingSpriteX: [[], [], [], [], []],
  mTeamScoreDict: [],
  mBuildingColorL: [{}, {}, {}, {}, {}, {}],
  mBaseX4ColorL: [368, 368, 452, 465, 550, 553],
  mBaseY4ColorL: [118, 37],
  mOffset4Color: 12,

  mMaxChatMsg: 6,

  ctor: function(playerName, seatNumber) {
    this._super();
    this.init(playerName, seatNumber);
  },

  init:function (playerName, seatNumber) {
    var bRet = false;
    if (this._super()) {
      this.mPlayerName = playerName;
      this.mSeatNumber = parseInt(seatNumber);
      gWinSize = cc.Director.getInstance().getWinSize();

      var grassSprite = new GrassBgSprite();
      grassSprite.setAnchorPoint(0, 0);
      grassSprite.setPosition(0, 0);
      this.addChild(grassSprite);

      var headerSprite = cc.Sprite.create(headerPNG);
      headerSprite.setAnchorPoint(0, 1);
      headerSprite.setPosition(0, gWinSize.height);
      this.addChild(headerSprite);

      var teamBattleSprite = cc.Sprite.create(teamBattlePNG);
      var halfW = teamBattleSprite.getContentSize().width / 2;
      var halfH = teamBattleSprite.getContentSize().height / 2;
      teamBattleSprite.setPosition(halfW, gWinSize.height - halfH - 1);
      this.addChild(teamBattleSprite);

      for(var i = 0; i < gMaxPlayerNum-1; i++) {
        this.mRoleXList[i] = cc.Sprite.create(roleXPNG);
        this.mRoleXList[i].setPosition(this.mBaseX4Player+i*this.mOffset4Player, this.mBaseY4Player);
        this.addChild(this.mRoleXList[i]);

        // crown
        this.mCrownXList[i] = cc.Sprite.create(crownPNG);
        this.mCrownXList[i].setAnchorPoint(0, 0);
        this.mCrownXList[i].setPosition(this.mBaseX4Crown+i*this.mOffset4Player, this.mBaseY4Crown);
        this.addChild(this.mCrownXList[i]);
        // seat number
        var idx = (this.mSeatNumber + i + 1) % gMaxPlayerNum;
        idx = (idx === 0) ? gMaxPlayerNum : idx;
        this.mSeatNumberDict[idx] = i;
        this.mSeatNumberXList[i] = cc.Sprite.createWithSpriteFrameName('seatNumberCBig_' + idx + '.png');
        this.mSeatNumberXList[i].setAnchorPoint(0, 0);
        this.mSeatNumberXList[i].setPosition(this.mBaseX4SeatNumber+i*this.mOffset4Player, this.mBaseY4SeatNumber);
        this.addChild(this.mSeatNumberXList[i]);

        // exchange
        gNotification.addObserver(this, this.onExchangeWithPlayerX, MSG_EXCHANGE_WITH_PLAYER);

        // name
        var blockSize = cc.size(115, 16);
        this.mNameXList[i] = cc.LabelTTF.create('Player_'+idx, 'Arial', 12, blockSize, cc.TEXT_ALIGNMENT_CENTER);
        this.mNameXList[i].setAnchorPoint(0, 0);
        this.mNameXList[i].setPosition(this.mBaseX4Name+i*this.mOffset4Player, this.mBaseY4Name);
        this.mNameXList[i].setColor(new cc.Color3B(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
        this.addChild(this.mNameXList[i]);
        // coin
        this.mCoinXList[i] = cc.LabelTTF.create(idx, 'Arial', 12);
        this.mCoinXList[i].setAnchorPoint(0, 0);
        this.mCoinXList[i].setPosition(this.mBaseX4Coin+i*this.mOffset4Player, this.mBaseY4Coin);
        this.mCoinXList[i].setColor(new cc.Color3B(this.mCoinColorList[0], this.mCoinColorList[1], this.mCoinColorList[2]));
        this.addChild(this.mCoinXList[i]);
        // blueprint
        this.mBlueprintXList[i] = cc.LabelTTF.create(idx, 'Arial', 12);
        this.mBlueprintXList[i].setAnchorPoint(0, 0);
        this.mBlueprintXList[i].setPosition(this.mBaseX4Blueprint+i*this.mOffset4Player, this.mBaseY4Coin);
        this.mBlueprintXList[i].setColor(new cc.Color3B(this.mBlueprintColorList[0], this.mBlueprintColorList[1], this.mBlueprintColorList[2]));
        this.addChild(this.mBlueprintXList[i]);
        // score
        this.mScoreXList[i] = cc.LabelTTF.create(idx, 'Arial', 12);
        this.mScoreXList[i].setAnchorPoint(0, 0);
        this.mScoreXList[i].setPosition(this.mBaseX4Score+i*this.mOffset4Player, this.mBaseY4Coin);
        this.mScoreXList[i].setColor(new cc.Color3B(this.mScoreColorList[0], this.mScoreColorList[1], this.mScoreColorList[2]));
        this.addChild(this.mScoreXList[i]);
        // building for playerX
        for(var j = 0; j < gMaxBuildingNum; j++) {
          var blueprintIdx = Math.floor(Math.random() * gMaxBlueprintNum + 1);
          var coinCostNum = Math.floor(Math.random() * gMaxCoinCostNum + 1);
          var column = j % 2;
          var row = Math.floor(j / 2);
          // this.mBuildingSpriteX[i][j] = new BlueprintSprite(0, 0, blueprintIdx, coinCostNum);
          var bpData = {playerId: 0, id: 0, typeId: blueprintIdx, costNum: coinCostNum, desc: '', isPlayerX: true, canConstruct: false};
          this.mBuildingSpriteX[i][j] = new BlueprintSprite(bpData);
          this.mBuildingSpriteX[i][j].setAnchorPoint(0, 0);
          this.mBuildingSpriteX[i][j].setPosition(this.mBaseX4Building+column*this.mBaseX4Column+i*this.mOffset4Player, this.mBaseY4Building-row*this.mBaseX4Row);
          // this.addChild(this.mBuildingSpriteX[i][j]);
        }
        // status for playerX
        for(var j = 0; j < gMaxStatusNum; j++) {
          this.mStatusIdx4PlayerX[i] = this.mStatusIdx4PlayerX[i] || 0;
          var statusIdx = Math.floor(Math.random() * gMaxStatusIconNum + 1);
          var column = j % 3;
          var row = Math.floor(j / 3);
          this.mStatus4PlayerX[i][this.mStatusIdx4PlayerX[i]] = cc.Sprite.createWithSpriteFrameName('status_' + statusIdx + '.png');
          this.mStatus4PlayerX[i][this.mStatusIdx4PlayerX[i]].setAnchorPoint(0, 0);
          this.mStatus4PlayerX[i][this.mStatusIdx4PlayerX[i]].setPosition(this.mBaseX4StatusX+column*this.mOffset4Status+i*this.mOffset4Player, this.mBaseY4StatusX-row*this.mOffset4Status);
          // this.addChild(this.mStatus4PlayerX[i][this.mStatusIdx4PlayerX[i]]);
          // this.mStatusIdx4PlayerX[i]++;
        }
      }

      var footerSprite = cc.Sprite.create(footer6PNG);
      halfW = footerSprite.getContentSize().width / 2;
      halfH = footerSprite.getContentSize().height / 2;
      var footerH = halfH * 2;
      footerSprite.setPosition(halfW, halfH);
      this.addChild(footerSprite);

      var lineLeftSprite = cc.Sprite.create(lineLeftPNG);
      lineLeftSprite.setAnchorPoint(0, 0);
      lineLeftSprite.setPosition(0, footerH-25);
      this.addChild(lineLeftSprite);

      var lineRightSprite = cc.Sprite.create(lineRightPNG);
      lineRightSprite.setAnchorPoint(1, 0);
      lineRightSprite.setPosition(gWinSize.width, footerH);
      this.addChild(lineRightSprite);

      var actionOrderSprite = cc.Sprite.create(actionOrder6PNG);
      actionOrderSprite.setAnchorPoint(0, 0);
      actionOrderSprite.setPosition(900, 200);
      this.addChild(actionOrderSprite);

      var scoreboardSprite = cc.Sprite.create(scoreboard6PNG);
      scoreboardSprite.setAnchorPoint(0, 0);
      scoreboardSprite.setPosition(629, 20);
      this.addChild(scoreboardSprite);

      blockSize = cc.size(31, 31);
      this.mTeamScoreDict[0] = cc.LabelTTF.create('6', 'Arial', 12, blockSize, cc.TEXT_ALIGNMENT_CENTER);
      this.mTeamScoreDict[0].setAnchorPoint(0, 0);
      this.mTeamScoreDict[0].setPosition(641, 17);
      this.mTeamScoreDict[0].setColor(new cc.Color3B(255, 0, 0));
      this.addChild(this.mTeamScoreDict[0]);
      this.mTeamScoreDict[0].setString(0);

      this.mTeamScoreDict[1] = cc.LabelTTF.create('8', 'Arial', 12, blockSize, cc.TEXT_ALIGNMENT_CENTER);
      this.mTeamScoreDict[1].setAnchorPoint(0, 0);
      this.mTeamScoreDict[1].setPosition(693, 17);
      this.mTeamScoreDict[1].setColor(new cc.Color3B(255, 0, 0));
      this.addChild(this.mTeamScoreDict[1]);
      this.mTeamScoreDict[1].setString(0);

      // bank
      var bankSprite = cc.Sprite.create(bankPNG);
      bankSprite.setPosition(943, 183);
      this.addChild(bankSprite);

      blockSize = cc.size(20, 20);
      this.mBank = cc.LabelTTF.create('0', 'Arial', 13, blockSize, cc.TEXT_ALIGNMENT_CENTER);
      this.mBank.setAnchorPoint(0, 0);
      this.mBank.setPosition(936, 167);
      // this.mBank.setColor(new cc.Color3B(225, 179, 56));
      this.mBank.setColor(new cc.Color3B(255, 0, 0));
      this.addChild(this.mBank);

      var roleBgSprite = cc.Sprite.create(roleBgPNG);
      halfW = roleBgSprite.getContentSize().width / 2;
      halfH = roleBgSprite.getContentSize().height / 2;
      roleBgSprite.setPosition(halfW, halfH);
      this.addChild(roleBgSprite, this.mZ4RoleBgSprite);

      this.mCrown4Me = cc.Sprite.create(crownPNG);
      this.mCrown4Me.setAnchorPoint(0, 0);
      this.mCrown4Me.setPosition(7, 86);
      this.addChild(this.mCrown4Me, this.mZ4RoleBgSprite);

      blockSize = cc.size(115, 20);
      var playerNameLabel = cc.LabelTTF.create(this.mPlayerName, "Arial", 16, blockSize, cc.TEXT_ALIGNMENT_CENTER);
      playerNameLabel.setAnchorPoint(0, 0);
      playerNameLabel.setPosition(26, 4);
      playerNameLabel.setColor(new cc.Color3B(this.mNameColorList[0], this.mNameColorList[1], this.mNameColorList[2]));
      this.addChild(playerNameLabel, this.mZ4RoleBgSprite);

      var seatNumberBigSprite = cc.Sprite.createWithSpriteFrameName('seatNumberCBig_' + this.mSeatNumber + '.png');
      seatNumberBigSprite.setAnchorPoint(0, 0);
      seatNumberBigSprite.setPosition(120, 31);
      this.addChild(seatNumberBigSprite, this.mZ4RoleBgSprite);

      // coin
      // this.mCoinNum = Math.floor(Math.random() * gMaxCoinCostNum + 1);
      this.mCoinNum = 0;
      this.mCoinLabel = cc.LabelTTF.create(this.mCoinNum, 'Arial', 13);
      this.mCoinLabel.setAnchorPoint(0, 0);
      this.mCoinLabel.setPosition(207, 92);
      this.mCoinLabel.setColor(new cc.Color3B(this.mCoinColorList[0], this.mCoinColorList[1], this.mCoinColorList[2]));
      this.addChild(this.mCoinLabel, this.mZ4RoleBgSprite);
      // blueprint num
      var blueprintNum = Math.floor(Math.random() * gMaxBlueprintNumInHand + 1);
      this.mBlueprintNumLabel = cc.LabelTTF.create(blueprintNum, 'Arial', 13);
      this.mBlueprintNumLabel.setAnchorPoint(0, 0);
      this.mBlueprintNumLabel.setPosition(207, 66);
      this.mBlueprintNumLabel.setColor(new cc.Color3B(this.mBlueprintColorList[0], this.mBlueprintColorList[1], this.mBlueprintColorList[2]));
      this.addChild(this.mBlueprintNumLabel, this.mZ4RoleBgSprite);
      // score
      var curScore = Math.floor(Math.random() * gMaxBlueprintNumInHand + 1);
      this.mScoreLabel = cc.LabelTTF.create(curScore, 'Arial', 13);
      this.mScoreLabel.setAnchorPoint(0, 0);
      this.mScoreLabel.setPosition(207, 40);
      this.mScoreLabel.setColor(new cc.Color3B(this.mScoreColorList[0], this.mScoreColorList[1], this.mScoreColorList[2]));
      this.addChild(this.mScoreLabel, this.mZ4RoleBgSprite);
      // blueprint
      for(var k = 0; k < gMaxBlueprintNumInHand; k++) {
        var blueprintIdx = Math.floor(Math.random() * gMaxBlueprintNum + 1);
        var coinCostNum = Math.floor(Math.random() * gMaxCoinCostNum + 1);
        // this.mBlueprintSprite[k] = new BlueprintSprite(0, 0, blueprintIdx, coinCostNum, true);
        var bpData = {playerId: 0, id: 0, typeId: blueprintIdx, costNum: coinCostNum, desc: '', canConstruct: true};
        this.mBlueprintSprite[k] = new BlueprintSprite(bpData);
        this.mBlueprintSprite[k].setAnchorPoint(0, 0);
        var idx = k % (gMaxBlueprintNumInHand/2);
        this.mBlueprintSprite[k].setPosition(this.mBlueprintPosList[idx][0], this.mBlueprintPosList[idx][1]);
        if(k < gMaxBlueprintNumInHand/2) {
          // console.log('origin ~ blueprintIdx = ', blueprintIdx);
          // this.addChild(this.mBlueprintSprite[k]);
        }
      }
      // previous and next page
      this.mPreviousBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("previousPage_1.png"),
        cc.Sprite.createWithSpriteFrameName("previousPage_3.png"),
        this.previousBtnCb,
        this
      );
      this.mPreviousBtn.setAnchorPoint(0, 0);
      this.mPreviousBtn.setPosition(244, 112);
      var previousMenu = cc.Menu.create(this.mPreviousBtn);
      previousMenu.setPosition(0,0);
      this.addChild(previousMenu);

      var nextBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("nextPage_1.png"),
        cc.Sprite.createWithSpriteFrameName("nextPage_3.png"),
        this.nextBtnCb,
        this
      );
      nextBtn.setAnchorPoint(0, 0);
      nextBtn.setPosition(291, 112);
      var nextMenu = cc.Menu.create(nextBtn);
      nextMenu.setPosition(0,0);
      this.addChild(nextMenu);

      // building for me
      for(var j = 0; j < gMaxBuildingNum; j++) {
        var blueprintIdx = Math.floor(Math.random() * gMaxBlueprintNum + 1);
        var coinCostNum = Math.floor(Math.random() * gMaxCoinCostNum + 1);
        var column = j % 4;
        var row = Math.floor(j / 4);
        // this.mBuildingSprite[j] = new BlueprintSprite(0, 0, blueprintIdx, coinCostNum);
        var bpData = {playerId: 0, id: 0, typeId: blueprintIdx, costNum: coinCostNum, desc: '', isMine: true, canConstruct: false};
        this.mBuildingSprite[j] = new BlueprintSprite(bpData);
        this.mBuildingSprite[j].setAnchorPoint(0, 0);
        this.mBuildingSprite[j].setPosition(this.mBaseX4MyBuilding+column*this.mBaseX4Column, this.mBaseY4MyBuilding-row*this.mBaseX4Row);
        // this.addChild(this.mBuildingSprite[j]);
      }

      // round end
      var roundEndBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("roundEnd_1.png"),
        cc.Sprite.createWithSpriteFrameName("roundEnd_3.png"),
        this.roundEndBtnCb,
        this
      );
      roundEndBtn.setAnchorPoint(0, 0);
      roundEndBtn.setPosition(146, 169);
      var roundEndMenu = cc.Menu.create(roundEndBtn);
      roundEndMenu.setPosition(0,0);
      this.addChild(roundEndMenu);

      for(var i = 0; i < 3; i++) {
        this.mStatus4Me[this.mStatusIdx4Me] = cc.Sprite.createWithSpriteFrameName('status_' + (i+1) + '.png');
        this.mStatus4Me[this.mStatusIdx4Me].setAnchorPoint(0, 0);
        this.mStatus4Me[this.mStatusIdx4Me].setPosition(this.mBaseX4Status+this.mStatusIdx4Me*this.mOffset4Status, this.mBaseY4Status);
        // this.addChild(this.mStatus4Me[this.mStatusIdx4Me]);
        // this.mStatusIdx4Me++;
      }

      var taxesBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("taxes_1.png"),
        cc.Sprite.createWithSpriteFrameName("taxes_3.png"),
        this.taxesBtnCb,
        this
      );
      taxesBtn.setAnchorPoint(0, 0);
      taxesBtn.setPosition(163, 5);
      var taxesMenu = cc.Menu.create(taxesBtn);
      taxesMenu.setPosition(0,0);
      this.addChild(taxesMenu);

      for(var i = 0; i < gMaxPlayerNum; i++) {
        var seatNumberSmallSprite = cc.Sprite.createWithSpriteFrameName('seatNumberCSmall_' + (i+1) + '.png');
        seatNumberSmallSprite.setAnchorPoint(0, 0);
        var pos4SeatNum = null;
        switch (i+1) {
          case 1:
            pos4SeatNum = new cc.Point(398, 84);
            break;
          case 2:
            pos4SeatNum = new cc.Point(423, 9);
            break;
          case 3:
            pos4SeatNum = new cc.Point(498, 88);
            break;
          case 4:
            pos4SeatNum = new cc.Point(518, 9);
            break;
          case 5:
            pos4SeatNum = new cc.Point(601, 79);
            break;
          case 6:
            pos4SeatNum = new cc.Point(601, 9);
            break;
        }
        if(pos4SeatNum) {
          seatNumberSmallSprite.setPosition(pos4SeatNum);
          this.addChild(seatNumberSmallSprite);

          for(var j in gColorSeatNumMap) {
            var id4color = gColorSeatNumMap[j];
            // cc.log(PREFIX_COLOR + id4color + '.png');
            this.mBuildingColorL[i][id4color] = cc.Sprite.createWithSpriteFrameName(PREFIX_COLOR + id4color + '.png');
            var o4c = this.mBuildingColorL[i][id4color];
            o4c.setAnchorPoint(0, 0);
            var pos4c = new cc.Point(this.mBaseX4ColorL[i]+(id4color-1)*this.mOffset4Color, this.mBaseY4ColorL[i%2]);
            o4c.setPosition(pos4c);
            // cc.log('pos4c = ', pos4c);
            // this.addChild(o4c);
          }
        }
      }

      for(var i = 1; i <= this.mMaxRole; i++) {
        var idx = Math.floor(Math.random() * 2 + 1);
        this.mStatus4Role[i] = cc.Sprite.createWithSpriteFrameName('status_' + idx + '.png');
        this.mStatus4Role[i].setAnchorPoint(0, 0);
        this.mStatus4Role[i].setPosition(this.mBaseX4RoleStatus, this.mBaseY4RoleStatus-(i-1)*this.mOffset4Mark);
        // this.addChild(this.mStatus4Role[i]);
      }

      this.mWinnerFlag4TeamLayer = new WinnerFlag4TeamLayer();
      this.mWinnerFlag4TeamLayer.setPosition(405, 296);
      this.mWinnerFlag4TeamLayer.initData({"teamId":0, "winnerNameL":["我的大名", "Robot_3", "Robot_5"]});
      // this.addChild(this.mWinnerFlag4TeamLayer, this.mZ4WinnerFlag);

      // send msg btn
      this.mSendMsgBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("sendBtn_1.png"),
        cc.Sprite.createWithSpriteFrameName("sendBtn_2.png"),
        this.sendMsgBtnCb,
        this
      );
      this.mSendMsgBtn.setAnchorPoint(0, 0);
      this.mSendMsgBtn.setPosition(911, 5);
      this.mSendMsgMenu = cc.Menu.create(this.mSendMsgBtn);
      this.mSendMsgMenu.setPosition(0,0);
      this.addChild(this.mSendMsgMenu);
      // chat area
      this.mChatMsgList = [];
      this.mChatShowAreaList = [];
      for(var i = 0; i < this.mMaxChatMsg; i++) {
        this.mChatShowAreaList[i] = cc.LabelTTF.create('', 'Arial', 10, cc.size(203, 16), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.mChatShowAreaList[i].setAnchorPoint(0, 0);
        this.mChatShowAreaList[i].setPosition(748, 117-i*16);
        this.mChatShowAreaList[i].setColor(new cc.Color3B(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
        this.addChild(this.mChatShowAreaList[i]);
      }
      // chat msg input box
      this.refreshEdit4Chat(true);

      // audio
      gSharedEngine.playEffect(EFFECT_ROUND_START);

      bRet = true;
    }
    return bRet;
  },

  // chat msg input box
  refreshEdit4Chat: function(isInit) {
    if(this.mEdit4Chat) {
      this.removeChild(this.mEdit4Chat);
    }
    var blockSize = cc.size(161, 22);
    this.mEdit4Chat = cc.EditBox.create(blockSize, cc.Scale9Sprite.create(chatInputBgPNG));
    this.mEdit4Chat.setPlaceholderFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
    var initText = '';
    if(isInit) {
      initText = '请输入聊天信息 ...';
    }
    this.mEdit4Chat.setPlaceHolder(initText);
    this.mEdit4Chat.setAnchorPoint(0, 0);
    this.mEdit4Chat.setPosition(745, 7);
    this.mEdit4Chat.setDelegate(this);
    this.mEdit4Chat.setFontColor(cc.c3b(gDescCharColorList[0], gDescCharColorList[1], gDescCharColorList[2]));
    this.mEdit4Chat.setMaxLength(10);
    this.addChild(this.mEdit4Chat);
  },

  updateRoleId: function(roleId) {
    var self = this;
    var route = "game.gameHandler.selectRoleId";
    pomelo.request(route, {
      playerId: gPlayerId,
      roleId: roleId
    }, function(data) {
      if(!data.ret) {
        return;
      }
      // cc.log('selectRoleId ~ data, roleId = ', JSON.stringify(data), roleId);

      self.mRoleId = roleId;

      if(!!self.mRoleIconSprite) {
        self.removeChild(self.mRoleIconSprite);
      }
      self.mRoleIconSprite = cc.Sprite.createWithSpriteFrameName('roleIconSmall_' + self.mRoleId + '.png');
      self.mRoleIconSprite.setAnchorPoint(0, 0);
      self.mRoleIconSprite.setPosition(6, 56);
      self.addChild(self.mRoleIconSprite, self.mZ4RoleIconSprite);

      if(!!self.mRoleNameSprite) {
        self.removeChild(self.mRoleNameSprite);
      }
      self.mRoleNameSprite = cc.Sprite.createWithSpriteFrameName('roleNameSmall_' + self.mRoleId + '.png');
      self.mRoleNameSprite.setAnchorPoint(0, 0);
      self.mRoleNameSprite.setPosition(49, 34);
      self.addChild(self.mRoleNameSprite, self.mZ4RoleBgSprite);

      if(!!self.mSkillIconSprite) {
        self.removeChild(self.mSkillIconSprite);
      }
      self.mSkillIconSprite = cc.Sprite.createWithSpriteFrameName('skillIcon_' + self.mRoleId + '.png');
      self.mSkillIconSprite.setAnchorPoint(0, 0);
      self.mSkillIconSprite.setPosition(11, 49);
      self.addChild(self.mSkillIconSprite, self.mZ4RoleBgSprite);

      if(!!self.mSkillOrnamentSprite) {
        self.removeChild(self.mSkillOrnamentSprite);
      }
      // console.log('self.mRoleId = ', self.mRoleId);
      // console.log('self.mSkillOrnament[self.mRoleId] = ', self.mSkillOrnament[self.mRoleId]);
      if(self.mSkillOrnament[self.mRoleId]) {
        var img = self.mSkillOrnament[self.mRoleId];
        self.mSkillOrnamentSprite = cc.Sprite.createWithSpriteFrameName(img);
        self.mSkillOrnamentSprite.setPosition(190, 127);
        self.addChild(self.mSkillOrnamentSprite);
      }

      if(!!self.mSkillMenu) {
        self.removeChild(self.mSkillMenu);
      }
      if(self.mSkillDict[self.mRoleId]) {
        var skillBtn = cc.MenuItemSprite.create(
          cc.Sprite.createWithSpriteFrameName('roleSkill_' + self.mRoleId + '_1.png'),
          cc.Sprite.createWithSpriteFrameName('roleSkill_' + self.mRoleId + '_3.png'),
          self.skillBtnCb,
          self
        );
        skillBtn.setPosition(190, 127);
        self.mSkillMenu = cc.Menu.create(skillBtn);
        self.mSkillMenu.setPosition(0, 0);
        self.addChild(self.mSkillMenu);
      }
    });
  },

  setPopupVisible: function(isV) {
    if(!!gPopupLayer) {
      gPopupLayer.setVisible(isV);
    }
  },

  skillBtnCb:function(sender){
    var self = this;
    // audio effect
    if(self.mRoleId !== self.mCurRoleId) {
      gSharedEngine.playEffect(EFFECT_WARNING);
      return;
    }
    self.setPopupVisible(false);
    this.showSkillAnimation(false);
    gShowDismantleFlag = false;
    // var runningScene = cc.Director.getInstance().getRunningScene();
    if(0 < self.mRoleId && self.mRoleId < gMagicianRoleId) {
      if(!self.mKillOrStealLayer) {
        self.mKillOrStealLayer = new KillOrStealLayer;
        // self.mKillOrStealLayer.initData(self.mRoleId);
        // runningScene.addChild(self.mKillOrStealLayer, 1);
        this.addChild(self.mKillOrStealLayer, 1);
      } else {
        // self.mKillOrStealLayer.initData(self.mRoleId);
        // self.mKillOrStealLayer.setVisible(true);
      }
      self.mKillOrStealLayer.setVisible(false);
      var route = "game.gameHandler.getKillOrStealIdList";
      pomelo.request(route, {
        playerId: gPlayerId,
        roleId: self.mRoleId
      }, function(data) {
        console.log('getKillOrStealIdList ~ data = ', data);
        self.mKillOrStealLayer.initData(self.mRoleId, data);
        self.mKillOrStealLayer.setVisible(true);
      });
    } else if(self.mRoleId === gMagicianRoleId) {
      if(!self.mExchangeCardLayer) {
        self.mExchangeCardLayer = new ExchangeCardLayer(self.mRoleId);
        this.addChild(self.mExchangeCardLayer, 1);
      } else {
        self.mExchangeCardLayer.setVisible(true);
      }
      self.setPopupVisible(false);
      self.showExchangeX(false);
    } else if(self.mRoleId === gWarlordRoleId) {
      gSharedEngine.playEffect(EFFECT_CONFIRM);
      gShowDismantleFlag = true;
    }

  },

  sendMsgBtnCb: function(sender){
    var chatText = this.mEdit4Chat.getText();
    if(chatText.length <= 0) {
      return;
    }
    var route = "game.gameHandler.chatInRoom";
    pomelo.request(route, {
      playerId: gPlayerId,
      text: chatText
    }, function(data) {
      // console.log('sendMsgBtnCb ~ data = ', data);
    });
    this.refreshEdit4Chat();
  },

  previousBtnCb: function(sender){
    for(var i = 0; i < gMaxBlueprintNumInHand; i++) {
      if(!!this.mBlueprintSprite[i]) {
        this.removeChild(this.mBlueprintSprite[i]);
        if(i < gMaxBlueprintNumInHand/2) {
          this.addChild(this.mBlueprintSprite[i]);
        }
      }
    }
    this.setPopupVisible(false);
  },

  nextBtnCb: function(sender){
    if(this.mBlueprintSprite.length <= gMaxBlueprintNumInHand/2) {
      gSharedEngine.playEffect(EFFECT_WARNING);
      return;
    }
    for(var i = 0; i < gMaxBlueprintNumInHand; i++) {
      if(!!this.mBlueprintSprite[i]) {
        this.removeChild(this.mBlueprintSprite[i]);
        if(i >= gMaxBlueprintNumInHand/2) {
          this.addChild(this.mBlueprintSprite[i]);
        }
      }
    }
    this.setPopupVisible(false);
  },

  taxesBtnCb:function(sender){
    // audio effect
    gSharedEngine.playEffect(this.mTaxesEffect);
    if(this.mTaxesEffect === EFFECT_WARNING) {
      return;
    }
    // hide effect
    this.showTaxesAnimation(false);

    var route = "game.gameHandler.collectTaxes";
    pomelo.request(route, {
      playerId: gPlayerId
    }, function(data) {
      console.log('collectTaxes ~ data = ', data);
    });
  },

  doAction4robot: function(playerId){
    var route = "game.gameHandler.doAction4robot";
    pomelo.request(route, {
      playerId: playerId
    }, function(data) {
      // console.log('doAction4robot ~ data = ', data);
    });
  },

  showExchangeX: function(bFlag){
    for(var i in this.mExchangeXList) {
      if(this.mExchangeXList[i]) {
        this.mExchangeXList[i].setVisible(bFlag);
      }
    }
  },

  onInitAllPlayerData: function(data) {
    // console.log('onInitAllPlayerData ~ data = ', JSON.stringify(data));
    for(var playerId in data) {
      var obj = data[playerId];
      var seatNum = parseInt(obj.seatNum, 10);
      // console.log('seatNum = ', seatNum);
      // console.log('this.mSeatNumber = ', this.mSeatNumber);
      if(seatNum === this.mSeatNumber) {
        this.mCoinNum = obj.coin;
        this.mCoinLabel.setString(this.mCoinNum);
        this.mBlueprintNumLabel.setString(obj.blueprintNum);
        this.mScoreLabel.setString(obj.score);
        for(var k in obj.blueprints) {
          var bp = obj.blueprints[k];
          // console.log('onInitAllPlayerData ~ k, bp = ', k, JSON.stringify(bp));
          if(!!this.mBlueprintSprite[k]) {
            this.removeChild(this.mBlueprintSprite[k]);
          }
          // this.mBlueprintSprite[k] = new BlueprintSprite(playerId, bp.id, bp.card.typeId, bp.card.cost, true);
          var bpData = {playerId: playerId, id: bp.id, typeId: bp.card.typeId, costNum: bp.card.cost, desc: bp.card.desc, canConstruct: true};
          this.mBlueprintSprite[k] = new BlueprintSprite(bpData);
          this.mBlueprintSprite[k].setAnchorPoint(0, 0);
          var idx = k % (gMaxBlueprintNumInHand/2);
          this.mBlueprintSprite[k].setPosition(this.mBlueprintPosList[idx][0], this.mBlueprintPosList[idx][1]);
          if(k < gMaxBlueprintNumInHand/2) {
            this.addChild(this.mBlueprintSprite[k]);
          }
        }
        this.mBlueprintSprite.length = obj.blueprintNum;
        if(obj.crownFlag) {
         this.mCrown4Me.setVisible(true);
        } else {
          this.mCrown4Me.setVisible(false);
        }
      } else {
        var idx = this.mSeatNumberDict[seatNum];
        // console.log('idx = ', idx);
        if(idx >= 0 && idx < gMaxPlayerNum) {
          this.mPlayerIdXList[idx] = parseInt(playerId);
          // console.log('idx = ', idx);
          // console.log('mPlayerIdXList[idx] = ', this.mPlayerIdXList[idx]);
          this.mNameXList[idx].setString(obj.playerName);
          this.mCoinXList[idx].setString(obj.coin);
          this.mBlueprintXList[idx].setString(obj.blueprintNum);
          this.mScoreXList[idx].setString(obj.score);
          if(obj.crownFlag) {
            this.mCrownXList[idx].setVisible(true);
          } else {
            this.mCrownXList[idx].setVisible(false);
          }
          // exchange
          this.mExchangeXList[idx] = new ExchangeWithPlayerSprite(this.mPlayerIdXList[idx], MSG_EXCHANGE_WITH_PLAYER);
          this.mExchangeXList[idx].setAnchorPoint(0, 0);
          this.mExchangeXList[idx].setPosition(this.mBaseX4Player+idx*this.mOffset4Player-32, this.mBaseY4Player-31);
          this.mExchangeXList[idx].setVisible(false);
          this.addChild(this.mExchangeXList[idx], this.mZ4ExchangeWithPlayer);
        }
      }
    }
  },

  onEmployRole: function(data) {
    this.setPopupVisible(false);
    if(!!this.mEmployRoleLayer) {
      this.removeChild(this.mEmployRoleLayer);
    }
    this.mEmployRoleLayer = new EmployRoleLayer();
    this.mEmployRoleLayer.updateRoleSpriteList(data);
    this.addChild(this.mEmployRoleLayer, this.mZ4Popup);
  },

  onExchangeWithPlayerX: function(targetPlayerId) {
    var self = this;
    // console.log('onExchangeWithPlayerX is running ...');
    var route = "game.gameHandler.exchangeCardWithPlayer";
    pomelo.request(route, {
      playerId: gPlayerId,
      targetId: targetPlayerId
    }, function(data) {
      self.showExchangeX(false);
    });
  },

  roundEndBtnCb: function() {
    var self = this;
    // audio effect
    if(self.mRoleId !== self.mCurRoleId) {
      gSharedEngine.playEffect(EFFECT_WARNING);
      return;
    } else {
      gSharedEngine.playEffect(EFFECT_CONFIRM);
    }
    this.stopCountdown();
    var route = "game.gameHandler.roundEnd";
    var curRoleId = self.mCurRoleId;
    pomelo.request(route, {
      playerId: gPlayerId,
      curRoleId: curRoleId
    }, function(data) {
      // cc.log('roundEndBtnCb ret ~ data = ', data);
      if(data.ret) {
        if(!!self.mSelectSource4ArchitectLayer) {
          self.removeChild(self.mSelectSource4ArchitectLayer);
        }
        if(!!self.mSelectSource4CommonLayer) {
          self.removeChild(self.mSelectSource4CommonLayer);
        }
        self.setPopupVisible(false);
        if(!!self.mKillOrStealLayer) {
          self.mKillOrStealLayer.setVisible(false);
        }
      }
    });
  },

  roundEndCb4robot: function() {
    var route = "game.gameHandler.roundEnd";
    var curRoleId = this.mCurRoleId;
    pomelo.request(route, {
      playerId: 0,
      curRoleId: curRoleId
    }, function() {
      // cc.log('roundEndCb4robot ret.');
    });
  },

  updateActionRoleMarkPos: function() {
    if(!this.mActionRoleMarkSprite) {
      this.mActionRoleMarkSprite = cc.Sprite.create(actionRoleMarkPNG);
      this.addChild(this.mActionRoleMarkSprite);
    }
    this.mActionRoleMarkSprite.setPosition(this.mBaseX4Mark, this.mBaseY4Mark-this.mOffset4Mark*(this.mCurRoleId-1));
    // arrow animation
    if(!this.mArrowAnimation) {
      this.mArrowAnimation = new ArrowAnimation();
      this.mArrowAnimation.setAnchorPoint(0, 0);
      this.addChild(this.mArrowAnimation, this.mZ4Popup);
    }
    this.mArrowAnimation.setPosition(this.mBaseX4Arrow, this.mBaseY4Arrow-this.mOffset4Mark*(this.mCurRoleId-1));
  },

  showTaxesAnimation: function(bFlag) {
    // taxes animation
    if(!this.mTaxesAnimation) {
      this.mTaxesAnimation = new TaxesAnimation();
      this.mTaxesAnimation.setAnchorPoint(0, 0);
      this.mTaxesAnimation.setPosition(156, 1);
      this.addChild(this.mTaxesAnimation, this.mZ4Popup);
    }
    this.mTaxesAnimation.setVisible(bFlag);
    if(bFlag) {
      this.mTaxesEffect = EFFECT_CONFIRM;
    } else {
      this.mTaxesEffect = EFFECT_WARNING;
    }
  },

  showSkillAnimation: function(bFlag) {
    // skill animation
    if(!!this.mSkillAnimation) {
      this.removeChild(this.mSkillAnimation);
    }
    if(bFlag) {
      this.mSkillAnimation = new SkillAnimation();
      this.mSkillAnimation.setAnchorPoint(0, 0);
      this.mSkillAnimation.setPosition(155, 142);
      this.addChild(this.mSkillAnimation);
    }
  },

  onComeOnStage: function(data) {
    this.showTaxesAnimation(false);
    this.showSkillAnimation(false);
    this.mCurRoleId = data.roleId;
    if(!data.playerId || data.isKilledFlag) {
      this.updateActionRoleMarkPos();
      gSharedEngine.playEffect(EFFECT_ROLE_CHANGE);
      // setTimeout(this.roundEndCb4robot.bind(this), gRobotTimeout);
    } else {
      // audio effect
      gSharedEngine.playEffect(EFFECT_ROLE_SHOW);
      if(data.playerId === gPlayerId) {
        this.setPopupVisible(false);
        this.updateActionRoleMarkPos();
        // select source: coin/blueprint
        // cc.log('typeof mRoleId, mRoleId = ', typeof this.mRoleId, this.mRoleId);
        if(this.mRoleId === gArchitectRoleId) {
          if(!!this.mSelectSource4ArchitectLayer) {
            this.removeChild(this.mSelectSource4ArchitectLayer);
          }
          this.mSelectSource4ArchitectLayer = new SelectSource4ArchitectLayer(data.blueprints);
          this.addChild(this.mSelectSource4ArchitectLayer, this.mZ4Popup);
        } else {
          if(!!this.mSelectSource4CommonLayer) {
            this.removeChild(this.mSelectSource4CommonLayer);
          }
          this.mSelectSource4CommonLayer = new SelectSource4CommonLayer(data.blueprints);
          this.addChild(this.mSelectSource4CommonLayer, this.mZ4Popup);
        }
        this.mCoinLabel.setString(data.coin);
        // countdown
        this.mCountdownSprite = new CountdownSprite(this, time4action, this.roundEndBtnCb);
        this.mCountdownSprite.setAnchorPoint(0, 0);
        this.mCountdownSprite.setPosition(gCountdownBoardPos[0], gCountdownBoardPos[1]);
        // taxesCnt
        if(data.taxesCnt > 0) {
          this.showTaxesAnimation(true);
        }
        // skill animation
        // cc.log('mRoleId = ', this.mRoleId);
        if(this.mSkillDict[this.mRoleId]) {
          this.showSkillAnimation(true);
        }
      } else {
        var idx = this.mSeatNumberDict[data.seatNum];
        if(idx >= 0 && idx < gMaxPlayerNum) {
          if(!!this.mRoleXList[idx]) {
            this.removeChild(this.mRoleXList[idx]);
          }
          var image = PREFIX_AVAILABLE + data.roleId + '.png';
          this.mRoleXList[idx] = cc.Sprite.createWithSpriteFrameName(image);
          var tmpPt = new cc.Point(this.mBaseX4Player+idx*this.mOffset4Player, this.mBaseY4Player);
          this.mRoleXList[idx].setPosition(tmpPt);
          this.addChild(this.mRoleXList[idx]);

          this.showComeOnStageAnimation(tmpPt);

          this.mCoinXList[idx].setString(data.coin);

          this.updateActionRoleMarkPos();

          // this.doAction4robot(data.playerId);

          // setTimeout(this.roundEndCb4robot.bind(this), gRobotTimeout);
        }
      }
    }
  },

  stopCountdown: function() {
    if(!!this.mCountdownSprite) {
      this.mCountdownSprite.stop();
      this.mCountdownSprite = null;
    }
  },

  showComeOnStageAnimation: function(pt) {
    this.mRoleXAnimation = new ComeOnStageAnimation();
    this.mRoleXAnimation.setAnchorPoint(0, 0);
    this.mRoleXAnimation.setPosition(pt);
    this.addChild(this.mRoleXAnimation);

    var self = this;
    setTimeout(function() {
      self.removeChild(self.mRoleXAnimation);
      self.mRoleXAnimation = null;
    }, time4Animation);
  },

  onUpdatePlayerBuilding: function(data) {
    // color block
    var idx4c = data.seatNum - 1;
    for(var i in this.mBuildingColorL[idx4c]) {
      this.removeChild(this.mBuildingColorL[idx4c][i]);
    }
    for(var j in data.colors) {
      var id4color = gColorSeatNumMap[data.colors[j]];
      if(!id4color) {
        continue;
      }
      this.mBuildingColorL[idx4c][id4color] = cc.Sprite.createWithSpriteFrameName(PREFIX_COLOR + id4color + '.png');
      var o4c = this.mBuildingColorL[idx4c][id4color];
      o4c.setAnchorPoint(0, 0);
      var pos4c = new cc.Point(this.mBaseX4ColorL[idx4c]+(id4color-1)*this.mOffset4Color, this.mBaseY4ColorL[idx4c%2]);
      o4c.setPosition(pos4c);
      this.addChild(o4c);
    }

    if(data.playerId === gPlayerId) {
      this.mBlueprintNumLabel.setString(data.blueprintNum);
      this.mScoreLabel.setString(data.score);
      this.mCoinLabel.setString(data.coin);
      // blueprints for me
      for(var k = 0; k < gMaxBlueprintNumInHand; k++) {
        if(!!this.mBlueprintSprite[k]) {
          this.removeChild(this.mBlueprintSprite[k]);
        }
      }
      for(var k in data.blueprints) {
        var bp = data.blueprints[k];
        // this.mBlueprintSprite[k] = new BlueprintSprite(data.playerId, bp.id, bp.card.typeId, bp.card.cost, true);
        var bpData = {playerId: data.playerId, id: bp.id, typeId: bp.card.typeId, costNum: bp.card.cost, desc: bp.card.desc, canConstruct: true};
        this.mBlueprintSprite[k] = new BlueprintSprite(bpData);
        this.mBlueprintSprite[k].setAnchorPoint(0, 0);
        var idx = k % (gMaxBlueprintNumInHand/2);
        this.mBlueprintSprite[k].setPosition(this.mBlueprintPosList[idx][0], this.mBlueprintPosList[idx][1]);
        if(k < gMaxBlueprintNumInHand/2) {
          this.addChild(this.mBlueprintSprite[k]);
        }
      }
      this.mBlueprintSprite.length = data.blueprintNum;
      // building for me
      for(var j = 0; j < gMaxBuildingNum; j++) {
        if(!!this.mBuildingSprite[j]) {
          this.removeChild(this.mBuildingSprite[j]);
        }
      }
      for(var j in data.buildings) {
        var bp = data.buildings[j];
        var column = j % 4;
        var row = Math.floor(j / 4);
        // this.mBuildingSprite[j] = new BlueprintSprite(data.playerId, bp.id, bp.card.typeId, bp.card.cost);
        var bpData = {playerId: data.playerId, id: bp.id, typeId: bp.card.typeId, costNum: bp.card.cost, desc: bp.card.desc, isMine: true, isNewFlag: bp.isNewFlag, isDismantled: bp.isDismantled, canConstruct: false};
        this.mBuildingSprite[j] = new BlueprintSprite(bpData);
        this.mBuildingSprite[j].setAnchorPoint(0, 0);
        this.mBuildingSprite[j].setPosition(this.mBaseX4MyBuilding+column*this.mBaseX4Column, this.mBaseY4MyBuilding-row*this.mBaseX4Row);
        this.addChild(this.mBuildingSprite[j]);
      }
    } else {
      var idx = this.mSeatNumberDict[data.seatNum];
      if(idx >= 0 && idx < gMaxPlayerNum) {
        this.mBlueprintXList[idx].setString(data.blueprintNum);
        this.mScoreXList[idx].setString(data.score);
        this.mCoinXList[idx].setString(data.coin);
        // building for playerX
        for(var j = 0; j < gMaxBuildingNum; j++) {
          if(!!this.mBuildingSpriteX[idx][j]) {
            this.removeChild(this.mBuildingSpriteX[idx][j]);
          }
        }
        for(var j in data.buildings) {
          var bp = data.buildings[j];
          var column = j % 2;
          var row = Math.floor(j / 2);
          // this.mBuildingSpriteX[idx][j] = new BlueprintSprite(data.playerId, bp.id, bp.card.typeId, bp.card.cost);
          var bpData = {playerId: data.playerId, id: bp.id, typeId: bp.card.typeId, costNum: bp.card.cost, desc: bp.card.desc, isPlayerX: true, isNewFlag: bp.isNewFlag, isDismantled: bp.isDismantled, canConstruct: false};
          this.mBuildingSpriteX[idx][j] = new BlueprintSprite(bpData);
          this.mBuildingSpriteX[idx][j].setAnchorPoint(0, 0);
          this.mBuildingSpriteX[idx][j].setPosition(this.mBaseX4Building+column*this.mBaseX4Column+idx*this.mOffset4Player, this.mBaseY4Building-row*this.mBaseX4Row);
          this.addChild(this.mBuildingSpriteX[idx][j]);
        }
      }
    }
    // team score
    this.mTeamScoreDict[0].setString(data.teamScoreDict[0]);
    this.mTeamScoreDict[1].setString(data.teamScoreDict[1]);
  },

  onUpdatePlayerBlueprint: function(data) {
    if(data.playerId === gPlayerId) {
      this.mBlueprintNumLabel.setString(data.blueprintNum);
      // blueprints for me
      for(var k = 0; k < gMaxBlueprintNumInHand; k++) {
        if(!!this.mBlueprintSprite[k]) {
          this.removeChild(this.mBlueprintSprite[k]);
        }
      }
      for(var k in data.blueprints) {
        var bp = data.blueprints[k];
        var bpData = {playerId: data.playerId, id: bp.id, typeId: bp.card.typeId, costNum: bp.card.cost, desc: bp.card.desc, canConstruct: true};
        this.mBlueprintSprite[k] = new BlueprintSprite(bpData);
        this.mBlueprintSprite[k].setAnchorPoint(0, 0);
        var idx = k % (gMaxBlueprintNumInHand/2);
        this.mBlueprintSprite[k].setPosition(this.mBlueprintPosList[idx][0], this.mBlueprintPosList[idx][1]);
        if(k < gMaxBlueprintNumInHand/2) {
          this.addChild(this.mBlueprintSprite[k]);
        }
      }
      this.mBlueprintSprite.length = data.blueprintNum;
    } else {
      var idx = this.mSeatNumberDict[data.seatNum];
      if(idx >= 0 && idx < gMaxPlayerNum) {
        this.mBlueprintXList[idx].setString(data.blueprintNum);
      }
    }
  },

  onUpdatePlayerCoin: function(data) {
    if(data.playerId === gPlayerId) {
      this.mCoinLabel.setString(data.coin);
    } else {
      var idx = this.mSeatNumberDict[data.seatNum];
      if(idx >= 0 && idx < gMaxPlayerNum) {
        this.mCoinXList[idx].setString(data.coin);
      }
    }
  },

  onKillRoleNotify: function(data) {
    var idx = data.killedRoleId;
    // console.log('onKillRoleNotify ~ idx = ', idx);
    if(!!this.mStatus4Role[idx]) {
      this.removeChild(this.mStatus4Role[idx]);
    }
    this.mStatus4Role[idx] = cc.Sprite.createWithSpriteFrameName(killStatusPNG);
    this.mStatus4Role[idx].setAnchorPoint(0, 0);
    this.mStatus4Role[idx].setPosition(this.mBaseX4RoleStatus, this.mBaseY4RoleStatus-(idx-1)*this.mOffset4Mark);
    this.addChild(this.mStatus4Role[idx]);

    // kill animation
    this.mKillAnimation = new KillAnimation(idx);
    this.mKillAnimation.setAnchorPoint(0, 0);
    this.mKillAnimation.setPosition(this.mPos4Animation[0], this.mPos4Animation[1]);
    this.addChild(this.mKillAnimation, this.mZ4Animation);
    gSharedEngine.playEffect(EFFECT_KILL);

    var self = this;
    setTimeout(function() {
      self.removeChild(self.mKillAnimation);
    }, self.mTime4Animation);
  },

  onStealRoleNotify: function(data) {
    var idx = data.stolenRoleId;
    console.log('onStealRoleNotify ~ idx = ', idx);
    if(!!this.mStatus4Role[idx]) {
      this.removeChild(this.mStatus4Role[idx]);
    }
    this.mStatus4Role[idx] = cc.Sprite.createWithSpriteFrameName(stealStatusPNG);
    this.mStatus4Role[idx].setAnchorPoint(0, 0);
    this.mStatus4Role[idx].setPosition(this.mBaseX4RoleStatus, this.mBaseY4RoleStatus-(idx-1)*this.mOffset4Mark);
    this.addChild(this.mStatus4Role[idx]);

    // steal animation
    this.mStealAnimation = new StealAnimation(idx);
    this.mStealAnimation.setAnchorPoint(0, 0);
    this.mStealAnimation.setPosition(this.mPos4Animation[0], this.mPos4Animation[1]);
    this.addChild(this.mStealAnimation, this.mZ4Animation);
    gSharedEngine.playEffect(EFFECT_STEAL);

    var self = this;
    setTimeout(function() {
      self.removeChild(self.mStealAnimation);
    }, self.mTime4Animation);
  },

  showMagicAnimation: function(targetRoleId) {
    // magic animation
    this.mMagicAnimation = new MagicAnimation(targetRoleId);
    this.mMagicAnimation.setAnchorPoint(0, 0);
    this.mMagicAnimation.setPosition(this.mPos4Animation[0], this.mPos4Animation[1]);
    this.addChild(this.mMagicAnimation, this.mZ4Animation);

    var self = this;
    setTimeout(function() {
      self.removeChild(self.mMagicAnimation);
    }, self.mTime4Animation);
  },

  onRestartRound: function(data) {
    for(var i = 0; i < gMaxPlayerNum-1; i++) {
      if(!!this.mRoleXList[i]) {
        this.removeChild(this.mRoleXList[i]);
      }
      this.mRoleXList[i] = cc.Sprite.create(roleXPNG);
      this.mRoleXList[i].setPosition(this.mBaseX4Player+i*this.mOffset4Player, this.mBaseY4Player);
      this.addChild(this.mRoleXList[i]);
    }
    // hide all status for role
    for(var i = 1; i <= this.mMaxRole; i++) {
      if(!!this.mStatus4Role[i]) {
        this.removeChild(this.mStatus4Role[i]);
      }
    }
    gSharedEngine.playEffect(EFFECT_ROUND_START);
  },

  onUpdateCrownStatus: function(data) {
    for(var playerId in data) {
      var obj = data[playerId];
      var seatNum = parseInt(obj.seatNum, 10);
      if(seatNum === this.mSeatNumber) {
        this.mCrown4Me.setVisible(obj.crownFlag);
      } else {
        var idx = this.mSeatNumberDict[seatNum];
        if(idx >= 0 && idx < gMaxPlayerNum) {
          if(obj.crownFlag) {
            this.mCrownXList[idx].setVisible(true);
          } else {
            this.mCrownXList[idx].setVisible(false);
          }
        }
      }
    }
  },

  onUpdateTeamScore: function(data) {
    this.mTeamScoreDict[0].setString(data.teamScoreDict[0]);
    this.mTeamScoreDict[1].setString(data.teamScoreDict[1]);
  },

  onExchangeWithPlayerNotify: function() {
    this.showMagicAnimation();
  },

  onConstructBuildingNotify: function() {
    gSharedEngine.playEffect(EFFECT_CONSTRUCT);
  },

  onHideEmployRoleLayer: function() {
    if(!!this.mEmployRoleLayer) {
      this.mEmployRoleLayer.stopCountdown();
      this.mEmployRoleLayer.setVisible(false);
    }
  },

  onUpdateBank: function(data) {
    this.mBank.setString(data.balance);
  },

  onShowPurpleFlag: function(data) {
    var bd = null;
    if(data.playerId === gPlayerId) {
      // building for me
      for(var i in this.mBuildingSprite) {
        bd = this.mBuildingSprite[i];
        if(!!bd && bd.mId === data.bdId) {
          bd.showPurpleFlagAnimation();
          return;
        }
      }
    } else {
      var idx = this.mSeatNumberDict[data.seatNum];
      if(idx >= 0 && idx < gMaxPlayerNum) {
        for(var j in this.mBuildingSpriteX[idx]) {
          bd = this.mBuildingSpriteX[idx][j];
          if(!!bd && bd.mId === data.bdId) {
            bd.showPurpleFlagAnimation();
            return;
          }
        }
      }
    }
  },

  onUpdatePlayerScore: function(data) {
    if(data.playerId === gPlayerId) {
      this.mScoreLabel.setString(data.score);
    } else {
      var idx = this.mSeatNumberDict[data.seatNum];
      if(idx >= 0 && idx < gMaxPlayerNum) {
        this.mScoreXList[idx].setString(data.score);
      }
    }
  },

  onNotifyFail2Dismantle: function() {
    gSharedEngine.playEffect(EFFECT_WARNING);
  },

  onNotifyFail2Construct: function() {
    gSharedEngine.playEffect(EFFECT_WARNING);
  },

  onChat: function(msg) {
    this.mChatMsgList.push(msg);
    if(this.mChatMsgList.length > this.mMaxChatMsg) {
      this.mChatMsgList.shift();
    }
    for(var i in this.mChatMsgList) {
      this.mChatShowAreaList[i].setString(this.mChatMsgList[i]);
    }
  },

  onGameOver: function(data) {
    this.removeChild(this.mWinnerFlag4TeamLayer);
    this.mWinnerFlag4TeamLayer.initData(data);
    this.addChild(this.mWinnerFlag4TeamLayer, this.mZ4WinnerFlag);
    gSharedEngine.playEffect(EFFECT_GAME_OVER);
  }

});

