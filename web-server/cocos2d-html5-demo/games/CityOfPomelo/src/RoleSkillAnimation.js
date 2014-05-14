var skillFramePrefix = 'skillFrame_';

var minFrame4Skill = 1;
var maxFrame4Skill = 2;

var SkillAnimation = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      var initImage = skillFramePrefix + minFrame4Skill + '.png';

      var skillSprite = cc.Sprite.createWithSpriteFrameName(initImage);
      skillSprite.setAnchorPoint(0, 0);
      skillSprite.setPosition(0, 0);
      this.addChild(skillSprite);

      var animFrames = [];
      for (var i = minFrame4Skill; i <= maxFrame4Skill; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(skillFramePrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 1);
      var animation = cc.Animate.create(rawAnim);
      skillSprite.runAction(cc.RepeatForever.create(animation));
      // skillSprite.runAction(animation);
    }
  }
});
