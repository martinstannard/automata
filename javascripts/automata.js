(function() {
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  $(function() {
    var CA, Canvas, draw_ca;
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
    CA = function(_a, _b) {
      this.width = _b;
      this.states = _a;
      this.rules = [];
      this.colours = [];
      this.pop1 = [];
      this.pop2 = [];
      this.make_colours();
      this.make_rules();
      this.initial_state();
      return this;
    };
    CA.prototype.initial_state = function() {
      var _a, _b, i;
      _a = []; _b = this.width;
      for (i = 0; (0 <= _b ? i < _b : i > _b); (0 <= _b ? i += 1 : i -= 1)) {
        _a.push(this.pop1[i] = Math.floor(Math.random() * this.states));
      }
      return _a;
    };
    CA.prototype.make_rules = function() {
      var _a, i;
      _a = [];
      for (i = 0; (0 <= this.states * 3 ? i < this.states * 3 : i > this.states * 3); (0 <= this.states * 3 ? i += 1 : i -= 1)) {
        _a.push(this.rules.push(Math.floor(Math.random() * this.states)));
      }
      return _a;
    };
    CA.prototype.make_colours = function() {
      var _a, i;
      _a = [];
      for (i = 0; (0 <= this.states * 3 ? i < this.states * 3 : i > this.states * 3); (0 <= this.states * 3 ? i += 1 : i -= 1)) {
        _a.push(this.colours.push(this.random_colour()));
      }
      return _a;
    };
    CA.prototype.random_colour = function() {
      var b, g, r;
      r = Math.floor(Math.random() * 255);
      g = Math.floor(Math.random() * 255);
      b = Math.floor(Math.random() * 255);
      return "rgb(" + (r) + "," + (g) + "," + (b) + ")";
    };
    CA.prototype.draw = function(canvas, line, block) {
      var _a, _b, i;
      _a = []; _b = this.width;
      for (i = 0; (0 <= _b ? i < _b : i > _b); (0 <= _b ? i += 1 : i -= 1)) {
        _a.push((function() {
          canvas.colour(this.colours[this.pop1[i]]);
          return canvas.dot(i * block, line, block, block);
        }).call(this));
      }
      return _a;
    };
    CA.prototype.populate = function() {
      var _a, above, below, i, rule_number;
      _a = this.width;
      for (i = 0; (0 <= _a ? i < _a : i > _a); (0 <= _a ? i += 1 : i -= 1)) {
        below = ((i - 1) + this.width) % this.width;
        above = ((i + 1) + this.width) % this.width;
        rule_number = this.pop1[below] + this.pop1[i] + this.pop1[above];
        rule_number = (typeof rule_number !== "undefined" && rule_number !== null) ? rule_number : 0;
        this.pop2[i] = this.rules[rule_number];
      }
      return (this.pop1 = this.pop2.slice(0));
    };
    draw_ca = function() {
      var can;
      can = new Canvas('automata');
      can.dot(1, 1, 640, 480);
      return $('#automata').bind('mousedown', __bind(function(event) {
        var _a, block, ca, i;
        ca = new CA(6, 320);
        block = 2;
        _a = [];
        for (i = 0; i < 240; i++) {
          _a.push((function() {
            ca.draw(can, block * i, block);
            return ca.populate();
          })());
        }
        return _a;
      }, this));
    };
    return draw_ca();
  });
})();
