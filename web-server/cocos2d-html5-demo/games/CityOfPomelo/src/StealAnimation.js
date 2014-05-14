var roleBigPrefix = 'roleIconBig_';
var beStolenPrefix = 'beStolenBig_';
var maxBeStolenFrameNum = 14;

var StealAnimation = cc.Sprite.extend({
  ctor: function(roleId) {
    this._super();
    this.init(roleId);
  },

  init: function(roleId) {
    if(this._super()){
      var image = roleBigPrefix + roleId + '.png';
      this.initWithSpriteFrameName(image);

      // steal sprite
      var stealSprite = cc.Sprite.createWithSpriteFrameName(beStolenPrefix + "1.png");
      stealSprite.setAnchorPoint(0, 0);
      stealSprite.setPosition(-56, -132);
      this.addChild(stealSprite);

      var animFrames = [];
      for (var i = 1; i <= maxBeStolenFrameNum; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(beStolenPrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.15);
      // true: first frame, false: last frame
      // rawAnim.setRestoreOriginalFrame(true);
      var animation = cc.Animate.create(rawAnim);
      // stealSprite.runAction(cc.RepeatForever.create(animation));
      stealSprite.runAction(animation);
    }
  }
});
