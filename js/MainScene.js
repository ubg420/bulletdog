//義に触れるとポイントアップ。義以外、義ならざるものに当たると爆発して死ぬ

phina.define('MainScene', {
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



    // 仮想アナログスティック
    var stick_pos = STICK_OPTION.radius + STICK_MARGIN;
    var joyStick = VirtualAnalogJoystick(STICK_OPTION)
      .addChildTo(layerHUD)
      .setPosition(stick_pos + 180, layerHUD.height - stick_pos);

    // マウスホイール
    var wheel = Wheel(WHEEL_THRESHOLD).addChildTo(this);

    // ゲームコントローラ
    var controller = this.gameController = GameController()
      .addChildTo(this)
      .addInput({
        move:     [ Analog2DInput(ArrowKey()),
                    Analog2DInput(ArrowKey(ArrowKey.WASD)),
                    Analog2DInput(ArrowKey(ArrowKey.NUMPAD)),
                    Analog2DInput(joyStick),
                  ],
      });


    var scene = this;

    // キャラクター
    this.chara = Character(CHARACTERS[0])
      .addChildTo(layerChar)
      .setPosition(this.gridX.center(-4), this.gridY.center(-3))
      .attachInput(controller.move, controller.trigger);


      var enemy = Enemy().addChildTo(this.enemyGroup);


    //マウスホイールの動き 武器選択につかえるかも
    //controller.prev.on('on', function() {selector.prev();});
    //controller.next.on('on', function() {selector.next();});


      this.timer = 0;
      this.score = 0;



  

  },


  update: function(app) {
    this.score++;
    this.timer++;




    
    if(this.timer % this.nextEnemy == 0){
      var enemy = Enemy().addChildTo(this.enemyGroup);
    }

    if(this.timer % 100 == 0){
      var gi = Gi().addChildTo(this.enemyGroup);
    }

    if(this.timer % 120 == 0){
      if(this.nextEnemy >= 5){
        this.levelUp()
      }
    }


  },

  levelUp:function(){

    this.nextEnemy-=1;

  },

  gameOver:function(){

    var dialog = GameOverDialog({
      score: this.score,
    });
    this.app.pushScene(dialog);

    dialog.onexit = function() {
      this.exit('main');
    }.bind(this);


  },


  scoreUp:function(){

    var point = 500
    this.score+= point;
    SoundManager.play("up");
    var scoreLabel = PointLabel("+"+point).addChildTo(GameMain.effectGroup);
    scoreLabel.setPosition(this.chara.x,this.chara.y);
  },
  

});


phina.define('Floor', {
  superClass: 'PlainElement',

  init: function() {
    this.superInit();

    this.canvas.width = SCREEN_WIDTH+64;
    this.canvas.height = FLOOR_HEIGHT;
    this.originX = 0;
    this.originY = 1;
    this.padding = 0;

    this.render();

    this.x = 0;
  },
  render: function() {
    var c = this.canvas;
    var ground = AssetManager.get('image', 'ground');
    var count = SCREEN_WIDTH/TILE_WIDTH+1;
    (count).times(function(i) {
      c.context.drawImage(ground.domElement, i*TILE_WIDTH, 0, TILE_WIDTH, FLOOR_HEIGHT);
    });
  },
  update: function() {
    this.x-=SPEED;

    if (this.x < -TILE_WIDTH) {
      this.x = 0;
    }
  }
});


phina.define('Enemy', {
  superClass: 'DisplayElement',

  init: function() {
    this.superInit();

    var number = Math.floor( Math.random() *  44 ) + 1;

    this.tag = "enemy";

    this.width =40;
    this.height =40;


    this.sprite = Sprite('enemy_' + number).addChildTo(this);
    this.sprite.setSize(100,100);

    this.x = SCREEN_WIDTH + 100;
    this.y = Math.floor( Math.random() * FLOOR_Y );

    this.vx = -GameMain.enemySpeed;

    




  },

  update: function(app) {

    this.x += this.vx;
    this.sprite.rotation += 1;

    if(this.x < -100){
      this.remove();
    }

  },

});


phina.define('Gi', {
  superClass: 'DisplayElement',

  init: function() {
    this.superInit();

    var number = Math.floor( Math.random() *  44 ) + 1;

    this.tag = "gi";

    this.width =100;
    this.height =100;


    this.sprite = Sprite('gi').addChildTo(this);
    this.sprite.setSize(150,150);

    this.x = SCREEN_WIDTH + 100;
    this.y = Math.floor( Math.random() * FLOOR_Y );

    this.vx = -10;

  },

  update: function(app) {

    this.x += this.vx;

    if(this.x < -100){
      this.remove();
    }


  },

});



phina.define('GameOverDialog', {
  superClass: 'DisplayScene',

  init: function(options) {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    SoundManager.stopMusic();


    var utyo_icon = DisplayElement().addChildTo(this);
    utyo_icon.width = 230;
    utyo_icon.height = 80;
    utyo_icon.setPosition(this.gridX.center(4.8),this.gridY.center(7.2));
    utyo_icon.sprite = Sprite('utyo').addChildTo(utyo_icon);
    utyo_icon.sprite.width = 80;
    utyo_icon.sprite.height = 80;
    utyo_icon.sprite.x = -95;
    utyo_icon.name = Label('@utyo').addChildTo(utyo_icon);
    utyo_icon.name.fill = '#FFFFFF'; // 色を変更
    utyo_icon.name.fontSize = 34; // フォントサイズを変更
    utyo_icon.name.x = 34; // フォントサイズを変更
    utyo_icon.name.fontFamily = 'def'; // フォントサイズを変更



    
    // タッチ判定を有効に
    utyo_icon.setInteractive(true);
    // タッチ終了時に発火
    utyo_icon.onclick = function() {
        window.open("http://twitter.com/utyo");
    };

    utyo_icon.scaleY = 0; // フォントサイズを変更

    utyo_icon.tweener.clear()
    .to({scaleY:1}, 0,"easeOutQuart");







    this.backgroundColor = 'rgba(0, 0, 0, 0.2)';

    this.fromJSON({
      children: {
        frame: {
          className: 'RectangleShape',
          x: this.gridX.center(),
          y: this.gridY.center(-1.5),
          cornerRadius: 6,
          fill: 'hsl(50, 100%, 90%)',
          stroke: 'brown',
          width: 320,
          height: 220,
        },
        scoreText: {
          className: 'Label',
          fontSize: 32,
          x: this.gridX.center(),
          y: this.gridY.center(-2.5),
          fontFamily:'def',
          fill: '#CFA551',
          text: 'SCORE',
        },
        scoreLabel: {
          className: 'Label',
          fontSize: 62,
          x: this.gridX.center(),
          y: this.gridY.center(-1),
          fontSize: 48,
          fill: 'white',
          stroke: 'black',
          fontFamily:'def',
          strokeWidth: 8,
          text: '4321',
        },
        btnOK: {
          className: 'Button',
          x: this.gridX.center(-2.1),
          y: this.gridY.center(1.5),
          width: this.gridX.span(3.5),
          height: this.gridY.span(1.5),
          fill: 'orange',
          stroke: 'brown',
          text: 'RETRY',
          fontFamily:'def',
          fontSize: 26,
        },
        btnShare: {
          className: 'Button',
          x: this.gridX.center(2.1),
          y: this.gridY.center(1.5),
          width: this.gridX.span(3.5),
          height: this.gridY.span(1.5),
          fill: 'orange',
          stroke: 'brown',
          text: 'SHARE',
          fontFamily:'def',
          fontSize: 26,
        },
        btnTop: {
          className: 'Button',
          x: this.gridX.center(),
          y: this.gridY.center(4.3),
          width: this.gridX.span(3.5),
          height: this.gridY.span(1.5),
          fill: 'orange',
          stroke: 'brown',
          text: 'TOP',
          fontFamily:'def',
          fontSize: 26,
        },
      }
    });



    this.btnTop.onclick = function() {
      window.open("https://cachacacha.com");
    };

    this.btnOK.onpush = function() {
      this.exit();
    }.bind(this);
    this.btnShare.onclick = function() {
      var url = Twitter.createURL({
        text: 'SCORE: {score}'.format(options),
        hashtags: '義の為されぬ世を儚み一発の弾丸になった犬,かちゃコム',
        url: location.href,
      });
      window.open(url, 'share window', 'width=480, height=320');
    }.bind(this);

    this.score = 0;
    this.tweener
      .to({score: options.score})
      ;
  },




  update: function() {
    this.scoreLabel.text = this.score|0;
  },
});



phina.define('PointLabel', {
  superClass: 'Label',

  init: function(text) {
    this.superInit();


    this.fill = "yellow"; // 色を変更

    this.text = text;
    this.strokeWidth = 13;
    this.stroke = "red";
    this.fontSize = 73; // フォントサイズを変更
    this.fontFamily = 'def';

    this.scaleX = 0;
    this.scaleY = 0;

    this.tweener.clear()
    .by({y:-30,scaleX:1,scaleY:1},500,'easeOutBack')
    .by({y:-110,scaleX:-1,scaleY:-1},300 ,'easeInCubic')
    .call(function() {
      this.remove();
    }, this);

  },

  update: function() {


  },
  

  
});