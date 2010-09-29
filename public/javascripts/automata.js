(function() {
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  $(function() {
    var CA, Canvas, Renderer, ca, draw_ca, init;
    Canvas = function(id) {
      this.context = $("#" + id)[0].getContext('2d');
      return this;
    };
    Canvas.prototype.dot = function(x, y, w, h) {
      return this.context.fillRect(x, y, w, h);
    };
    Canvas.prototype.colour = function(colour) {
      return (this.context.fillStyle = colour);
    };
    CA = function(_a, _b, _c) {
      this.width = _c;
      this.states = _b;
      this.canvas = _a;
      this.pop1 = [];
      this.pop2 = [];
      this.reset();
      return this;
    };
    CA.prototype.reset = function() {
      var _a, _b, i;
      this.rules = [];
      this.colours = [];
      _a = this.width;
      for (i = 0; (0 <= _a ? i < _a : i > _a); (0 <= _a ? i += 1 : i -= 1)) {
        this.pop1[i] = this.randint(this.states);
      }
      _b = [];
      for (i = 0; (0 <= this.states * 3 ? i < this.states * 3 : i > this.states * 3); (0 <= this.states * 3 ? i += 1 : i -= 1)) {
        _b.push((function() {
          this.rules.push(this.randint(this.states));
          return this.colours.push(this.random_colour());
        }).call(this));
      }
      return _b;
    };
    CA.prototype.random_colour = function() {
      return "rgb(" + (this.randint(255)) + "," + (this.randint(255)) + "," + (this.randint(255)) + ")";
    };
    CA.prototype.draw = function(line, block) {
      var _a, _b, i;
      _a = []; _b = this.width;
      for (i = 0; (0 <= _b ? i < _b : i > _b); (0 <= _b ? i += 1 : i -= 1)) {
        _a.push((function() {
          this.canvas.colour(this.colours[this.pop1[i]]);
          return this.canvas.dot(i * block, line, block, block);
        }).call(this));
      }
      return _a;
    };
    CA.prototype.populate = function() {
      var _a, i, rule_number;
      _a = this.width;
      for (i = 0; (0 <= _a ? i < _a : i > _a); (0 <= _a ? i += 1 : i -= 1)) {
        rule_number = this.pop1[this.modded(i - 1, this.width)] + this.pop1[i] + this.pop1[this.modded(i + 1, this.width)];
        this.pop2[i] = this.rules[rule_number];
      }
      return (this.pop1 = this.pop2.slice(0));
    };
    CA.prototype.randint = function(ceil) {
      return Math.floor(Math.random() * ceil);
    };
    CA.prototype.modded = function(n, mod) {
      return (n + mod) % mod;
    };
    Renderer = function(_a, _b, _c, _d) {
      this.states = _d;
      this.block_size = _c;
      this.height = _b;
      this.width = _a;
      this.canvas = new Canvas('automata');
      this.canvas.dot(1, 1, this.width, this.height);
      this.ca = new CA(this.canvas, this.states, this.width / this.block_size);
      this.gen = 0;
      return this;
    };
    Renderer.prototype.render = function() {
      this.ca.draw(this.block_size * this.gen, this.block_size);
      return this.ca.populate();
    };
    init = function() {
      var ca, can;
      can = new Canvas('automata');
      can.dot(1, 1, 640, 480);
      return (ca = new CA(can, 4, 320));
    };
    draw_ca = function(ca) {
      var _a, block, i;
      ca.reset();
      block = 2;
      _a = [];
      for (i = 0; i < 240; i++) {
        _a.push((function() {
          ca.draw(block * i, block);
          return ca.populate();
        })());
      }
      return _a;
    };
    $('body').bind('keypress', __bind(function(event) {
      return console.log(event.which);
    }, this));
    $('#automata').bind('mousedown', __bind(function(event) {
      return draw_ca(ca);
    }, this));
    return (ca = init());
  });
})();
