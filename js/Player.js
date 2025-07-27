
// ------------------------------------------------------------------------
// キャラクター
//  TODO: width, height 等を options としてもらうほうがいい
phina.define('Character', {
  superClass: 'DisplayElement',

  init: function(image) {
    this.superInit();


    this.sprite = Sprite('player').addChildTo(this);
    this.sprite.setSize(90,90);


    this.sprite.tweener

    this.width = 30;
    this.height = 30;

    this._setVelocity(Vector2.ZERO);

    this.shotInterval = 5;
    this.shotTimer = 0;

    //this.tweener.

    this.sprite.tweener
        .clear()
        .to({y:5}, 40,"easeOutSine")
        .to({y:0}, 40,"easeOutSine")
        .setLoop(true);



    this.timer = 0;



    this.Colision = RectangleShape().addChildTo(this);
    this.Colision.width = this.width;
    this.Colision.height = this.height;
    this.Colision.alpha = 0;


  },

  update: function(app) {
    this.position.add(Vector2.mul(this.velocity, app.deltaTime / 1000))
    this.area && this.position.cageIn(this.area);

    this.timer++;
    if(this.timer % 3 == 0){
      var s = Smoke('hit','hitSS').addChildTo(GameMain.effectGroup);
      s.x = this.x - 50;
      s.y = this.y;

    }


    GameMain.enemyGroup.children.each(function(child) {
      if (this.hitTestElement(child)) {
          if(child.tag == "enemy"){
            this.hit();
          }
          if(child.tag == "gi"){
            GameMain.scoreUp();   
                     
          }
          child.remove();

      }
    }, this);



  },

  hit:function(){

    SoundManager.play("hit");

    var s = DieEffect('hitR','hitSS').addChildTo(GameMain.effectGroup);
    s.x = this.x;
    s.y = this.y;
    this.remove();

  },


  change: function (image) {
    this.setImage(image, CHARA_WIDTH, CHARA_HEIGHT);
  },

  onadded: function() {
    var parent = this.parent;

    this.area = Rect(0, 0, parent.width, FLOOR_Y).padding(this.height / 2);
  },

  attachInput: function(move, trigger) {
    var self = this;

    move.on('change', function(e) {self._setVelocity(e.input.value);});

    // この辺がちょっとどうかな
    this.on('removed', function() {
      this.move && this.move.off('change', this)
      this.trigger && this.trigger.off('on', this)
    });

    return this;
  },

  _setVelocity: function (v) {
    this.velocity = Vector2.mul(v, MAX_SPEED);

    // アニメ指定
    var anime = 'still';
    var rate = 1;

    if(v.x != 0 || v.y != 0) {

      rate = v.length();
    }
  },

  _shot:function(v){
    var shotspeed =30;
    var velocity = Vector2.mul(v, shotspeed);
    if(v.x != 0 || v.y != 0) {

      if(v.x > 0){
        this.scaleX = 1;
      }else{
        this.scaleX = -1;
      }


      if(this.shotTimer <= 0){
        var bullet = Bullet(this.x,this.y,velocity).addChildTo(GameMain.bulletGroup);
        this.shotTimer = this.shotInterval;
      }
      this.shotTimer--;

    }

  },


});


phina.define('DieEffect', {
  superClass: 'Sprite',
  
      init: function(img,ss) {
          this.superInit(img);
  




          this.anim = FrameAnimation(ss).attachTo(this);
          this.anim.gotoAndPlay('run');
          this.anim.fit = false;
          this.setSize(310,310)
  

      },
  
      update: function(app) {

          if (this.anim.finished) { 
              GameMain.gameOver();
              this.remove();
          }
  
      },
  
  
  });


phina.define('Smoke', {
  superClass: 'Sprite',
  
      init: function(img,ss) {
          this.superInit(img);
  
          this.anim = FrameAnimation(ss).attachTo(this);
          this.anim.gotoAndPlay('run');
          this.anim.fit = false;
          this.setSize(110,110)
  
          this.hitFLG = false;
          this.vy = Math.floor( Math.random() * - 60 ) + 30;


      },
  
      update: function(app) {
          this.x -= 51;
          this.y += this.vy;
  
          if (this.anim.finished) { 
              this.remove();
          }
  
      },
  
  
  });