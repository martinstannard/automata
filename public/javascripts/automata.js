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
      this.reset();
      return this;
    };
    CA.prototype.reset = function() {
      var _a, _b, i;
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
    draw_ca = function() {
      var can;
      can = new Canvas('automata');
      can.dot(1, 1, 640, 480);
      return $('#automata').bind('mousedown', __bind(function(event) {
        var _a, _b, block, ca, i;
        ca = new CA(4, 320);
        block = 2;
        _a = [];
        for (_b = 0; _b < 240; _b++) {
          (function() {
            var i = _b;
            return _a.push(setTimeout(function() {
              ca.draw(can, block * i, block);
              return ca.populate();
            }, 250));
          })();
        }
        return _a;
      }, this));
    };
    return draw_ca();
  });
})();
