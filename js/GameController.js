
// ------------------------------------------------------------------------
// ゲームコントローラ
//
phina.define('GameInputContainer', {
  superClass: 'GameInput',

  init: function() {
    this.superInit();
  },

  _update: function(app) {
    var value = this.value;

    if (value != null) {
      this.children.each (
        function(i) {
          i.updateView && i.updateView(value);
        }
      );
    }
  },

  _accessor: {
    value: {
      get: function() {
        var value;
        this.children.some(function(i) {
          value = i.value;
          return i._isOn(value);
        });
        return value;
      },
    },
  },
});


phina.define('GameController', {
  superClass: 'Element',

  init: function() {
    this.superInit();
  },

  addInput: function(name, input) {
    if (typeof name === 'object') {
      var self = this;

      name.forIn(function(key, value) {
        if(Array.isArray(value))  value.each(function(v) {self.addInput(key, v);});
        else                      self.addInput(key, value);
      });

    } else {
      if (!this[name]) this[name] = GameInputContainer().addChildTo(this);

      input.syncView = true;
      this[name].addChild(input);
    }

    return this;
  },
});


// ------------------------------------------------------------------------
// ゲームコントローラ部品
//  TODO: CircleButton 追加

// マウスホイール
phina.define('Wheel', {
  superClass: 'Element',

  init: function(threshold) {
    this.superInit();

    this.value = this._rest = 0;
    this.up = this.down = false;
    this.threshold = threshold || 100;
    this._listen = false;

    var self = this;
    this.upInput = {updateValue: function() {return self.up;}};
    this.downInput = {updateValue: function() {return self.down;}};
  },

  update: function(app) {
    if (!this._listen) {
      var self = this;
      app.domElement.addEventListener('wheel', function(e) {
        self.value += e.deltaY;
        self._rest += e.deltaY;
      });
      this._listen = true;
    } else {
      this._update();
    }
  },

  _update: function() {
    if (this.up || this.down) {
      this.up = this.down = false;
    } else if (this._rest <= - this.threshold) {
      this.up = true;
      this._rest += this.threshold;
    } else if (this._rest >= this.threshold) {
      this.down = true;
      this._rest -= this.threshold;
    }
  },  
});

// 図形ボタン
var ShapeButton = function(shape, options, offBlur, onBlur) {
  var button = shape(options)
    .setInteractive(true)
    .on('pointstart', function() {this._value = true;})
    .on('pointend', function() {this._value = false;});

  button._value = false;

  button.updateValue = function() {return this._value};
  button.updateView = function(value) {this.shadowBlur = value ? onBlur : offBlur;};

  return button;
};

// キーボタン
var KeyButton = function(key) {
  return {updateValue: function(app) {return app.keyboard.getKey(key);}}
};

// 仮想アナログスジョイスティック
phina.define('VirtualAnalogJoystick', {
  superClass: 'CircleShape',

  // TODO: options の default を用意するべき
  init: function(options) {
    this.superInit(options);
    this.alpha = options.alpha;

    this._value = Vector2(0, 0);
    this._range = options.radius - options.stick.radius;

    this.setInteractive(true)
      .on('pointmove', function (p) {
        var pos = Vector2.sub(p.pointer.position, p.pointer.startPosition);
        this._setMove(pos);
      })
      .on('pointend', function (p) {
        this._setMove(Vector2.ZERO);
      });

    this.stick = CircleShape(options.stick).addChildTo(this)
  },

  updateValue: function() {return this._value;},

  updateView: function(value) {this.stick.position = Vector2.mul(value, this._range);},

  _setMove: function(pos) {
    var move = pos.clone();

    if (move.length() > this._range) move.normalize().mul(this._range);

    this._value = Vector2.div(move, this._range);
  },
});

//
phina.define('ArrowKey', {
  init: function(keys) {
    this._key = {}.$safe(keys, ArrowKey.ARROWS);
  },

  updateValue: function(app) {
    var kb = app.keyboard;
    var vector = Vector2(0, 0);

    if (kb.getKey(this._key.up)) vector.y += -1;
    if (kb.getKey(this._key.down)) vector.y += 1;
    if (kb.getKey(this._key.left)) vector.x += -1;
    if (kb.getKey(this._key.right)) vector.x += 1;

    return vector.normalize();
  },

  _static: {
    ARROWS: {up: 'up', down: 'down', left: 'left', right: 'right' },
    WASD: {up: 'W', down: 'S', left: 'A', right: 'D'},
    NUMPAD: {up: 'numpad8', down: 'numpad2', left: 'numpad4', right: 'numpad6'},
  },
});

