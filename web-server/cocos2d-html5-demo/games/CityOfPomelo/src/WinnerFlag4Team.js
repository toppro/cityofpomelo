var pomelo = window.pomelo;

var gZOrder4Bg = 0
  , gZOrder4Element = 1;

var gBgDict = {0: winnerFlag4TeamAPNG, 1: winnerFlag4TeamBPNG, 2: winnerFlag4DrawPNG};
var gSeatNumDict = {0: [1, 3, 5], 1: [2, 4, 6], 2: []};
var gWinnerText = 'Winner'
  , gDrawText = 'Draw';

var WinnerFlag4TeamLayer = cc.Layer.extend({
  mRegisterDelegate: true,

  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    var bRet = false;
    if (this._super()) {
      this.mFlagBgSprite = cc.Sprite.create(gBgDict[0]);
      this.mFlagBgSprite.setAnchorPoint(0, 0);
      this.mFlagBgSprite.setPosition(0, 0);
      this.addChild(this.mFlagBgSprite, gZOrder4Bg);

      this.mWinnerText = cc.LabelTTF.create(gWinnerText, 'Arial', 12);
      this.mWinnerText.setAnchorPoint(0, 0);
      this.mWinnerText.setPosition(39, 200);
      this.mWinnerText.setColor(new cc.Color3B(255, 0, 0));
      this.addChild(this.mWinnerText, gZOrder4Element);

      var c = gDescCharColorList;
      this.mName4SeatA = cc.LabelTTF.create('', 'Arial', 12);
      this.mName4SeatA.setAnchorPoint(0, 0);
      this.mName4SeatA.setPosition(69, 160);
      this.mName4SeatA.setColor(new cc.Color3B(c[0], c[1], c[2]));
      this.addChild(this.mName4SeatA, gZOrder4Element);

      this.mName4SeatB = cc.LabelTTF.create('', 'Arial', 12);
      this.mName4SeatB.setAnchorPoint(0, 0);
      this.mName4SeatB.setPosition(69, 110);
      this.mName4SeatB.setColor(new cc.Color3B(c[0], c[1], c[2]));
      this.addChild(this.mName4SeatB, gZOrder4Element);

      this.mName4SeatC = cc.LabelTTF.create('', 'Arial', 12);
      this.mName4SeatC.setAnchorPoint(0, 0);
      this.mName4SeatC.setPosition(69, 60);
      this.mName4SeatC.setColor(new cc.Color3B(c[0], c[1], c[2]));
      this.addChild(this.mName4SeatC, gZOrder4Element);

      var confirmBtn = cc.MenuItemSprite.create(
        cc.Sprite.createWithSpriteFrameName("confirmSmall_1.png"),
        cc.Sprite.createWithSpriteFrameName("confirmSmall_3.png"),
        this.confirmBtnCb,
        this
      );
      confirmBtn.setAnchorPoint(0, 0);
      confirmBtn.setPosition(52, 12);
      var confirmMenu = cc.Menu.create(confirmBtn);
      confirmMenu.setPosition(0,0);
      this.addChild(confirmMenu, gZOrder4Element);

      bRet = true;
    }
    return bRet;
  },

  initData: function(data) {
    var teamId = data.teamId;
    var L = data.winnerNameL;

    this.removeChild(this.mFlagBgSprite);
    this.mFlagBgSprite = cc.Sprite.create(gBgDict[teamId]);
    this.mFlagBgSprite.setAnchorPoint(0, 0);
    this.mFlagBgSprite.setPosition(0, 0);
    this.addChild(this.mFlagBgSprite, gZOrder4Bg);

    this.removeChild(this.mSeatNumA);
    this.removeChild(this.mSeatNumB);
    this.removeChild(this.mSeatNumC);

    if(gSeatNumDict[teamId].length > 0) {
      this.mWinnerText.setString(gWinnerText);

      this.mSeatNumA = cc.Sprite.createWithSpriteFrameName('seatNumberCBig_' + gSeatNumDict[teamId][0] + '.png');
      this.mSeatNumA.setAnchorPoint(0, 1);
      this.mSeatNumA.setPosition(42, 178);
      this.addChild(this.mSeatNumA, gZOrder4Element);

      this.mName4SeatA.setString(L[0]);

      this.mSeatNumB = cc.Sprite.createWithSpriteFrameName('seatNumberCBig_' + gSeatNumDict[teamId][1] + '.png');
      this.mSeatNumB.setAnchorPoint(0, 1);
      this.mSeatNumB.setPosition(42, 128);
      this.addChild(this.mSeatNumB, gZOrder4Element);

      this.mName4SeatB.setString(L[1]);

      if(!!L[2]) {
        this.mSeatNumC = cc.Sprite.createWithSpriteFrameName('seatNumberCBig_' + gSeatNumDict[teamId][2] + '.png');
        this.mSeatNumC.setAnchorPoint(0, 1);
        this.mSeatNumC.setPosition(42, 78);
        this.addChild(this.mSeatNumC, gZOrder4Element);

        this.mName4SeatC.setString(L[2]);
      } else {
        this.mName4SeatC.setString('');
      }
    } else {
      this.mWinnerText.setString(gDrawText);
      this.mName4SeatA.setString('');
      this.mName4SeatB.setString('');
      this.mName4SeatC.setString('');
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

  confirmBtnCb:function(sender){
    this.setVisible(false);
  },

  onTouchBegan: function(touch, event) {
    console.log('WinnerFlag4Team ~ onTouchBegan is running ...');
    return true;
  },

  onTouchEnded:function (touch, event) {
    console.log('WinnerFlag4Team ~ onTouchEnded is running ...');
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

