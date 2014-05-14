var comeOnStagePrefix = 'comeOnStage_';
var maxFrameNum4Stage = 19;


var ComeOnStageAnimation = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      // come on stage sprite
      var comeOnStageSprite = cc.Sprite.createWithSpriteFrameName(comeOnStagePrefix + "1.png");
      comeOnStageSprite.setPosition(0, 0);
      this.addChild(comeOnStageSprite);

      var animFrames = [];
      for (var i = 1; i <= maxFrameNum4Stage; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(comeOnStagePrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.1);
      var animation = cc.Animate.create(rawAnim);
      comeOnStageSprite.runAction(cc.RepeatForever.create(animation));
      // comeOnStageSprite.runAction(animation);
    }
  }
});
