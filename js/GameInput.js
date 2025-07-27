
// ------------------------------------------------------------------------
// ゲームコントローラ入力

phina.define('GameInput', {
  superClass: 'Element',

  init: function() {
    this.superInit();
  },

  update: function(app) {
    this._update && this._update(app);

    var value = this.value;

    if (this._prev != null && !this._equal(this._prev, value)) {
      if (!this._isOn(value))      this.flare('off', {input: this});
      if (!this._isOn(this._prev)) this.flare('on', {input: this});

      this.flare('change', {input: this});
    }

    this._prev = value;
  },

  updateView: function(value) {this._input.updateView && this._input.updateView(value);},

  _getValue: function() {return false;},
  _equal: function(a, b) {return a === b;},
  _isOn: function(v) {return v;},

  _accessor: {
    value: {
      get: function() {return this._getValue();},
    },
  },
});


// ON/OFFボタン
phina.define('ButtonInput', {
  superClass: 'GameInput',

  init: function(input) {
    this.superInit();
    this._input = input;
    this._value = false;
  },

  _update: function(app) {this._input.updateValue && (this._value = this._input.updateValue(app));},
  _getValue: function() {return this._value;},
});

//
phina.define('Analog2DInput', {
  superClass: 'GameInput',

  init: function(input) {
    this.superInit();
    this._value = Vector2(0, 0);
    this._input = input;
  },

  _update: function(app) {this._value = this._input.updateValue(app);},
  _getValue: function() {return this._value.clone();},
  _equal: function(a, b) {return a.equals(b);},
  _isOn: function(v) {return v.x != 0 || v.y != 0;},
});
