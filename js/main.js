/*
 * Virtual GameController
 
 TODO: トグルスイッチ → 仮想パッドON/OFF
 TODO: grid でなんとなく配置している部品をち再配置
 
 */

'use strict';

phina.globalize();

var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 960;

// ------------------------------------------------------------------------
// 設定

var MAX_ANIME_FPS = 10;
var MAX_SPEED = 820;  // dot/s
var CHARA_WIDTH = 64;
var CHARA_HEIGHT = 65;

var GameMain;

var STICK_MARGIN = 30;
var STICK_OPTION = {
  radius: 110,
  fill: '#cccccc',
  alpha: 1,

  stick: {
    radius: 60,
    fill: 'white',
    alpha: 1,
    strokeWidth:10,


  },
};




var WHEEL_THRESHOLD = 100;

var BUTTON_POSITION = {x: 860, y: 540};
var BUTTON_SHADOW_OFF = 20;
var BUTTON_SHADOW_ON = 8;
var BUTTON_ALPHA = 0.6;
var BUTTON_OPTION = {
  padding: BUTTON_SHADOW_OFF,
  radius: 48,
  fill: '#f93',
  stroke: '#962',
  strokeWidth: 2,
  shadow: 'rgba(0, 0, 0, 0.8)',
  shadowBlur: BUTTON_SHADOW_OFF,
};


var FLOOR_HEIGHT    = 315;
var FLOOR_Y         = SCREEN_HEIGHT-FLOOR_HEIGHT;
var SPEED           = 15;
var SCORE_BOX_HEIGHT= 250;
var TILE_WIDTH = 32;

var CHARACTERS = [
  'buropiyo',
  'meropiyo',
  'mikapiyo',
  'nasupiyo',
  'takepiyo',
  'tomapiyo',
];

// ------------------------------------------------------------------------
// アセット

var ASSETS = {
  image: {

    player: './image/player.png',
    bullet: './image/bullet.png',
    ground: './image/ground.png',
    back: './image/back.png',
    hit: './image/hit_1.png',
    hitR: './image/hit_1r.png',

    utyo: './image/utyo.png',

    gi: './image/gi.png',
    title: './image/title.png',


    enemy_1: './image/1.png',
    enemy_2: './image/2.png',
    enemy_3: './image/3.png',
    enemy_4: './image/4.png',
    enemy_5: './image/5.png',
    enemy_6: './image/6.png',
    enemy_7: './image/7.png',
    enemy_8: './image/8.png',
    enemy_9: './image/9.png',
    enemy_10: './image/10.png',
    enemy_11: './image/11.png',
    enemy_12: './image/12.png',
    enemy_13: './image/13.png',
    enemy_14: './image/14.png',
    enemy_15: './image/15.png',
    enemy_16: './image/16.png',
    enemy_17: './image/17.png',
    enemy_18: './image/18.png',
    enemy_19: './image/19.png',
    enemy_20: './image/20.png',
    enemy_21: './image/21.png',
    enemy_22: './image/22.png',
    enemy_23: './image/23.png',
    enemy_24: './image/24.png',
    enemy_25: './image/25.png',
    enemy_26: './image/26.png',
    enemy_27: './image/27.png',
    enemy_28: './image/28.png',
    enemy_29: './image/29.png',
    enemy_30: './image/30.png',
    enemy_31: './image/31.png',
    enemy_32: './image/32.png',
    enemy_33: './image/33.png',
    enemy_34: './image/34.png',
    enemy_35: './image/35.png',
    enemy_36: './image/36.png',
    enemy_37: './image/37.png',
    enemy_38: './image/38.png',
    enemy_39: './image/39.png',
    enemy_40: './image/40.png',
    enemy_41: './image/41.png',
    enemy_42: './image/42.png',
    enemy_43: './image/43.png',
    enemy_44: './image/44.png',



  },

  spritesheet: {
    chara: {
      frame: {
        width: CHARA_WIDTH,
        height: CHARA_HEIGHT,
        cols: 6,
        rows: 3,
      },
      animations: {
        still: {
          frames: [0],
          next: 'still',
          frequency: MAX_ANIME_FPS,
        },
        up: {
          frames: [9, 10, 11, 10],
          next: 'up',
          frequency: MAX_ANIME_FPS,
        },
        down: {
          frames: [6, 7, 8, 7],
          next: 'down',
          frequency: MAX_ANIME_FPS,
        },
        left: {
          frames: [15, 16, 17, 16],
          next: 'left',
          frequency: MAX_ANIME_FPS,
        },
        right: {
          frames: [12, 13, 14, 13],
          next: 'right',
          frequency: MAX_ANIME_FPS,
        },
      },
    },
    'playerSS': './player.ss',
    'hitSS': './hit.ss',

  },

  sound:{
    'hit': './sound/kick-high1.mp3',
    'bgm': './sound/BGM070-091030-galaxyattack-mp3.mp3',
    'up': './sound/powerup.wav',
    'coin': './sound/coin.wav',


  },

  font:{
      'def': './font/FAMania.woff',
    },
    
};

// ------------------------------------------------------------------------
// phina 拡張

// keep の不具合対応 & 速度指定版
FrameAnimation.prototype.gotoAndPlay2 = function(name, keep, rate) {
  this.gotoAndPlay(name, keep);
  this.currentAnimationName = name;
  this.rate = rate;

  return this;
};

FrameAnimation.prototype.update = function(app) {
  if (this.paused) return ;
  if (!this.currentAnimation) return ;

  if (this.finished) {
    this.finished = false;
    this.currentFrameIndex = 0;
    return ;
  }

  // ++this.frame;
  // if (this.frame%this.currentAnimation.frequency === 0) {
  //   ++this.currentFrameIndex;
  //   this._updateFrame();
  // }

  var fps = this.currentAnimation.frequency * (this.rate || 1);

  this.frame += app.deltaTime;
  if (this.frame * fps >= 1000) {
    this.frame -= 1000 / fps;
    this.currentFrameIndex ++;
    this._updateFrame();
  }
  
};

// 座標を矩形内に収める
Vector2.prototype.cageIn = function(rect) {
  if (this.x < rect.left) this.x = rect.left;
  else if (this.x > rect.right) this.x = rect.right;

  if (this.y < rect.top) this.y = rect.top;
  else if (this.y > rect.bottom) this.y = rect.bottom;

  return this;
};

// hitTestCircle の不具合対応
Object2D.prototype.hitTestCircle = function(x, y) {
  // 円判定
  var p = this.globalToLocal(phina.geom.Vector2(x, y))
    .add(Vector2.sub(this.origin, {x: 0.5, y: 0.5}).mul(this.radius * 2));

  if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
      return true;
  }

  return false;
};





// ------------------------------------------------------------------------
// ゲーム

var Layer = function (scene) {
  return DisplayElement()
    .addChildTo(scene)
    .setSize(scene.width, scene.height)
    .setOrigin(0, 0);
};



phina.main(function() {
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    startLabel: 'Loading',
    assets: ASSETS,
  });

  // app.enableStats();
  app.replaceScene(SceneSequence());
  app.run();
});


  // SceneSequenceクラス
  phina.define("SceneSequence", {
    superClass: "phina.game.ManagerScene",
  
    // 初期化
    init: function() {
      this.superInit({
        scenes: [
  
          {
            label: "Loading", // ラベル。参照用
            className: "LoadingScene", // シーンAのクラス名
            nextLabel:'Title'
          },
          {
            label: "Title", // ラベル。参照用
            className: "TitleScene", // シーンAのクラス名
          },
          {
            label: "main",
            className: "MainScene",
          },

        ]
      });
    }
  });
  
  phina.define("LoadingScene", {
    superClass: "phina.game.LoadingScene",
  
    init: function(params) {
      this.superInit({
        assets: ASSETS,
        exitType: "auto",
  
      });
  
  
    }
  
  });
