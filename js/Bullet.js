
// ------------------------------------------------------------------------
// キャラクター
//  TODO: width, height 等を options としてもらうほうがいい
phina.define('Bullet', {
  superClass: 'DisplayElement',

  init: function(x,y,v) {
    this.superInit({
      width: 32,
      height: 32,
    });

    this.sprite = Sprite('bullet').addChildTo(this);
    this.sprite.setSize(40,40);

    this.Colision = RectangleShape().addChildTo(this);
    this.Colision.width = this.width;
    this.Colision.height = this.height;
    this.Colision.alpha = 0;

    this.x = x;
    this.y = y + 10;
    this.vx = v.x;
    this.vy = v.y;

    this.x += this.vx;
    this.y += this.vy;


    var hiteffect = HitEffect('hit','hitSS').addChildTo(GameMain.effectGroup);
    hiteffect.x = this.x;
    hiteffect.y = this.y;
    hiteffect.setSize(40, 40);



    //this.tweener.
  },

  update: function(app) {
    this.x += this.vx;
    this.y += this.vy;

    if(this.x < 0 || this.x > SCREEN_WIDTH){
      this.remove()
    }
    if(this.y < 0 || this.y > SCREEN_HEIGHT){
      this.remove()
    }

  },


});


phina.define('HitEffect', {
  superClass: 'Sprite',
  
      init: function(img,ss) {
          this.superInit(img);
  
          this.anim = FrameAnimation(ss).attachTo(this);
          this.anim.gotoAndPlay('run');
          this.anim.fit = false;
  
          this.hitFLG = false;
  
      },
  
      update: function(app) {

  
          if (this.anim.finished) { 
              this.remove();
          }
  
      },
});