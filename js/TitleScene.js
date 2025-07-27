//義に触れるとポイントアップ。義以外、義ならざるものに当たると爆発して死ぬ

phina.define('TitleScene', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit(options);

    GameMain = this;
    // 各レイヤー追加
    var layerBG = this.layerBackGround = Layer (this);
    var layerChar = this.layerCharacter = Layer (this);

    
    var floor = Floor().addChildTo(this);
    floor.y = SCREEN_HEIGHT;

    SoundManager.playMusic("bgm");


    this.enemySpeed = 14;
    this.nextEnemy = 15;


    this.bulletGroup = DisplayElement().addChildTo(this);
    this.effectGroup = DisplayElement().addChildTo(this);
    this.enemyGroup = DisplayElement().addChildTo(this);


    var layerHUD = this.layerHUD = Layer (this);

    var back = Sprite('back').addChildTo(layerBG);
    back.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
    back.setPosition(this.gridX.center(),this.gridY.center());


    var logo = Sprite('title').addChildTo(this);
    logo.setPosition(this.gridX.center(),this.gridY.center(-4));
    logo.scaleX = 1.2;
    logo.scaleY = 1.2;

//    this.sprite.setSize(90,90);

    this.sprite = Sprite('player').addChildTo(this);
    this.sprite.setSize(110,110);
    this.sprite.setPosition(this.gridX.center(),this.gridY.center());




    //this.tweener.

    this.sprite.tweener
        .clear()
        .by({y:5}, 40,"easeOutSine")
        .by({y:-5}, 40,"easeOutSine")
        .setLoop(true);



        this.startlabel = Label('START').addChildTo(this);
        this.startlabel.setPosition(this.gridX.center(0),this.gridY.center(6));
        this.startlabel.fill = 'white'; // 色を変更
        this.startlabel.strokeWidth = 8;
        this.startlabel.fontSize = 64; // フォントサイズを変更
        this.startlabel.fontFamily = "def"; // フォントサイズを変更
    
        this.startlabel.tweener
          .clear()
          .to({alpha:1,scaleX:1,scaleY:1}, 700,"easeOutSine")
          .wait(400)
          .to({alpha:0,scaleX:0.8,scaleY:0.8}, 700,"easeInSine")
          .setLoop(true);


      
      this.onclick = function() {
        if (!this.isStart) {
          var context = phina.asset.Sound.getAudioContext();
          context.resume();
          SoundManager.play("coin");
  
          this.exit('main');
  
  
        }
      }
  

  },





});

