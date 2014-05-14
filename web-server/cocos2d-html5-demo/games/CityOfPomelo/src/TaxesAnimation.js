var taxesFramePrefix = 'taxesFrame_';

var minFrame4Taxes = 1;
var maxFrame4Taxes = 10;

var TaxesAnimation = cc.Sprite.extend({
  ctor: function() {
    this._super();
    this.init();
  },

  init: function() {
    if(this._super()){
      var initImage = taxesFramePrefix + minFrame4Taxes + '.png';

      var taxesSprite = cc.Sprite.createWithSpriteFrameName(initImage);
      taxesSprite.setAnchorPoint(0, 0);
      taxesSprite.setPosition(0, 0);
      this.addChild(taxesSprite);

      var animFrames = [];
      for (var i = minFrame4Taxes; i <= maxFrame4Taxes; i++) {
        var frame = gSpriteFrameCache.getSpriteFrame(taxesFramePrefix + i + ".png");
        animFrames.push(frame);
      }

      var rawAnim = cc.Animation.create(animFrames, 0.16);
      var animation = cc.Animate.create(rawAnim);
      taxesSprite.runAction(cc.RepeatForever.create(animation));
      // taxesSprite.runAction(animation);
    }
  }
});
