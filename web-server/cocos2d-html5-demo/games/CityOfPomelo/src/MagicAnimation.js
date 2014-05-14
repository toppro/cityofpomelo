var roleBigPrefix = 'roleIconBig_';
var magicPrefix = 'magicBig_';
var maxFrameNum4magic = 20;

var MagicAnimation = cc.Sprite.extend({
  ctor: function(targetRoleId) {
    this._super();
    this.init(targetRoleId);
  },

  init: function(targetRoleId) {
    if(this._super()){
      console.log('targetRoleId = ', targetRoleId);
      console.log('typeof targetRoleId = ', typeof targetRoleId);
      var image = inputNameOrnamentPNG;
      if(targetRoleId && targetRoleId >= gMinRoleId && targetRoleId <= gMaxRoleId) {
        image = roleBigPrefix + targetRoleId + '.png';
        this.initWithSpriteFrameName(image);
      } else {
        this.initWithFile(image);
      }
      // console.log('image = ', image);

      // magic sprite
      var magicSprite = cc.Sprite.createWithSpriteFrameName(magicPrefix + "1.png");
      magicSprite.setAnchorPoint(0, 0);
      magicSprite.setPosition(52, -54);
      this.addChild(magicSprite);

      var animFrames = [];
      for (var i = 1; i <= maxFrameNum4magic; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(magicPrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.125);
      // true: first frame, false: last frame
      // rawAnim.setRestoreOriginalFrame(true);
      var animation = cc.Animate.create(rawAnim);
      magicSprite.runAction(cc.RepeatForever.create(animation));
      // magicSprite.runAction(animation);
      // audio effect
      gSharedEngine.playEffect(EFFECT_STEAL);
    }
  }
});
