var purpleFlagPrefix = 'purpleFlag_';
var minFrame4PurpleFlag = 1;
var maxFrame4PurpleFlag = 52;

var PurpleFlagAnimation = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      var initImage = purpleFlagPrefix + minFrame4PurpleFlag + '.png';
      // this.initWithSpriteFrameName(initImage);

      var purpleFlagSprite = cc.Sprite.createWithSpriteFrameName(initImage);
      purpleFlagSprite.setAnchorPoint(0, 0);
      purpleFlagSprite.setPosition(0, 0);
      this.addChild(purpleFlagSprite);

      var animFrames = [];
      for (var i = minFrame4PurpleFlag; i <= maxFrame4PurpleFlag; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(purpleFlagPrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.05);
      var animation = cc.Animate.create(rawAnim);
      purpleFlagSprite.runAction(cc.RepeatForever.create(animation));
      // purpleFlagSprite.runAction(animation);
    }
  }
});
