var arrowPrefix = 'arrowMiddle_';
var initNum4arrow = 5;
var initFrame4arrow = arrowPrefix + initNum4arrow + '.png';
var maxFrameNum4arrow = 6;

var ArrowAnimation = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      this.initWithSpriteFrameName(initFrame4arrow);

      // arrow sprite
      var arrowSprite = cc.Sprite.createWithSpriteFrameName(initFrame4arrow);
      arrowSprite.setAnchorPoint(0, 0);
      arrowSprite.setPosition(0, 0);
      this.addChild(arrowSprite);

      var animFrames = [];
      for (var i = initNum4arrow; i <= maxFrameNum4arrow; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(arrowPrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 1.00);
      var animation = cc.Animate.create(rawAnim);
      arrowSprite.runAction(cc.RepeatForever.create(animation));
    }
  }
});
