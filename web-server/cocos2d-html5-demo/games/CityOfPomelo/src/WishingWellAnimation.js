var wishingWellPrefix = 'wishingWell_';

var minFrame4WishingWell = 1;
var maxFrame4WishingWell = 13;

var WishingWellAnimation = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      var initImage = wishingWellPrefix + minFrame4WishingWell + '.png';

      var wishingWellSprite = cc.Sprite.createWithSpriteFrameName(initImage);
      wishingWellSprite.setAnchorPoint(0, 0);
      wishingWellSprite.setPosition(0, 0);
      this.addChild(wishingWellSprite);

      var animFrames = [];
      for (var i = minFrame4WishingWell; i <= maxFrame4WishingWell; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(wishingWellPrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.05);
      var animation = cc.Animate.create(rawAnim);
      wishingWellSprite.runAction(cc.RepeatForever.create(animation));
      // wishingWellSprite.runAction(animation);
    }
  }
});
