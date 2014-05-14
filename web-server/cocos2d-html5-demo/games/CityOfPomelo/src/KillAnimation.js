var roleBigPrefix = 'roleIconBig_';
var killFramePrefix = 'killBig_';
var beKilledPrefix = 'beKilledBig_';
var maxKillFrameNum = 14;
var maxBeKilledFrameNum = 9;

var KillAnimation = cc.Sprite.extend({
  ctor: function(roleId) {
    this._super();
    this.init(roleId);
  },

  init: function(roleId) {
    if(this._super()){
      var image = roleBigPrefix + roleId + '.png';
      this.initWithSpriteFrameName(image);

      // be killed sprite
      var beKilledSprite = cc.Sprite.createWithSpriteFrameName(beKilledPrefix + "1.png");
      beKilledSprite.setAnchorPoint(0, 0);
      beKilledSprite.setPosition(-30, -100);
      this.addChild(beKilledSprite);

      var animFrames = [];
      for (var i = 1; i <= maxBeKilledFrameNum; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(beKilledPrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.15);
      // true: first frame, false: last frame
      // rawAnim.setRestoreOriginalFrame(true);
      var animation = cc.Animate.create(rawAnim);
      // beKilledSprite.runAction(cc.RepeatForever.create(animation));
      beKilledSprite.runAction(animation);

      // kill sprite
      var killSprite = cc.Sprite.createWithSpriteFrameName(killFramePrefix + "1.png");
      killSprite.setAnchorPoint(0, 0);
      killSprite.setPosition(-5, -55);
      this.addChild(killSprite);

      animFrames = [];
      for (var i = 1; i <= maxKillFrameNum; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(killFramePrefix + i + ".png");
        animFrames.push(frame);
      }

      rawAnim = cc.Animation.create(animFrames, 0.15);
      // true: first frame, false: last frame
      // rawAnim.setRestoreOriginalFrame(true);
      animation = cc.Animate.create(rawAnim);
      // killSprite.runAction(cc.RepeatForever.create(animation));
      killSprite.runAction(animation);
    }
  }
});
