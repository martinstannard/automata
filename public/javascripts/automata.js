(function() {
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  $(function() {
    var CA, Canvas, Colour, Renderer, colours, modded, r, randint, rules, start, stop, timer;
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
    Colour = function() {
      this.r = randint(255);
      this.g = randint(255);
      this.b = randint(255);
      return this;
    };
    Colour.prototype.to_rgb = function() {
      return "rgb(" + (this.r) + "," + (this.g) + "," + (this.b) + ")";
    };
    Colour.prototype.to_hex = function() {
      var decColor;
      decColor = this.r + 256 * this.g + 65536 * this.b;
      return "#" + decColor.toString(16);
    };
    CA = function(_a, _b, _c) {
      this.width = _c;
      this.states = _b;
      this.canvas = _a;
      this.pop1 = [];
      this.pop2 = [];
      this.rules = [];
      this.colours = [];
      this.state = "random";
      this.reset();
      return this;
    };
    CA.prototype.reset = function() {
      this.palette();
      this.new_rules();
      return this.seed();
    };
    CA.prototype.new_rules = function() {
      var i;
      this.rules = [];
      for (i = 0; (0 <= this.states * 3 ? i < this.states * 3 : i > this.states * 3); (0 <= this.states * 3 ? i += 1 : i -= 1)) {
        this.rules.push(randint(this.states));
      }
      return this.seed();
    };
    CA.prototype.seed = function() {
      var _a;
      if ((_a = this.state) === "random") {
        return this.random();
      } else if (_a === "symmetrical") {
        return this.symmetrical();
      }
    };
    CA.prototype.random = function() {
      var _a, _b, i;
      this.state = "random";
      _a = []; _b = this.width;
      for (i = 0; (0 <= _b ? i < _b : i > _b); (0 <= _b ? i += 1 : i -= 1)) {
        _a.push(this.pop1[i] = randint(this.states));
      }
      return _a;
    };
    CA.prototype.symmetrical = function() {
      var _a, c, i, p;
      this.state = "symmetrical";
      _a = this.width;
      for (i = 0; (0 <= _a ? i < _a : i > _a); (0 <= _a ? i += 1 : i -= 1)) {
        this.pop1[i] = 0;
      }
      p = this.width / 2;
      this.pop1[p] = randint(this.states);
      c = randint(this.states);
      this.pop1[p - 1] = c;
      return (this.pop1[p + 1] = c);
    };
    CA.prototype.palette = function() {
      var _a, _b, i;
      this.colours = [];
      _a = []; _b = this.states;
      for (i = 0; (0 <= _b ? i < _b : i > _b); (0 <= _b ? i += 1 : i -= 1)) {
        _a.push(this.colours.push(new Colour()));
      }
      return _a;
    };
    CA.prototype.draw = function(line, block) {
      var _a, _b, i;
      _a = []; _b = this.width;
      for (i = 0; (0 <= _b ? i < _b : i > _b); (0 <= _b ? i += 1 : i -= 1)) {
        _a.push((function() {
          this.canvas.colour(this.colours[this.pop1[i]].to_rgb());
          return this.canvas.dot(i * block, line, block, block);
        }).call(this));
      }
      return _a;
    };
    CA.prototype.populate = function() {
      var _a, i, rule_number;
      _a = this.width;
      for (i = 0; (0 <= _a ? i < _a : i > _a); (0 <= _a ? i += 1 : i -= 1)) {
        rule_number = this.pop1[modded(i - 1, this.width)] + this.pop1[i] + this.pop1[modded(i + 1, this.width)];
        this.pop2[i] = this.rules[rule_number];
      }
      return (this.pop1 = this.pop2.slice(0));
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
      this.ca.populate();
      this.gen += 1;
      return this.roll();
    };
    Renderer.prototype.roll = function() {
      return this.gen * this.block_size > this.height ? (this.gen = 0) : null;
    };
    randint = function(ceil) {
      return Math.floor(Math.random() * ceil);
    };
    modded = function(n, mod) {
      return (n + mod) % mod;
    };
    $('body').bind('keypress', __bind(function(event) {
      var timer;
      console.log(event.which);
      if (event.which === 114) {
        r.new_rules();
      }
      if (event.which === 103) {
        timer = start();
      }
      return event.which === 115 ? stop() : null;
    }, this));
    $('#reset').bind('click', __bind(function(event) {
      r.ca.reset();
      rules();
      return colours();
    }, this));
    $('#new_rules').bind('click', __bind(function(event) {
      r.ca.new_rules();
      return rules();
    }, this));
    $('#palette').bind('click', __bind(function(event) {
      r.ca.palette();
      return colours();
    }, this));
    $('#random').bind('click', __bind(function(event) {
      return r.ca.random();
    }, this));
    $('#symmetrical').bind('click', __bind(function(event) {
      return r.ca.symmetrical();
    }, this));
    $('#states').bind('change', __bind(function(event) {
      r.ca.states = $('#states option:selected')[0].text;
      r.ca.reset();
      rules();
      return colours();
    }, this));
    colours = function() {
      var _a, _b, _c, _d, c, colours, i;
      colours = r.ca.colours;
      $('#colours').empty();
      i = 1;
      _a = []; _c = colours;
      for (_b = 0, _d = _c.length; _b < _d; _b++) {
        c = _c[_b];
        _a.push((function() {
          $('#colours').append("<span class=\"colour\" id=\"colour_" + (i) + "\"></span>");
          $("#colour_" + (i)).css({
            backgroundColor: c.to_hex()
          });
          return i += 1;
        })());
      }
      return _a;
    };
    rules = function() {
      var _a, _b, _c, _d, i, rule, rules;
      rules = r.ca.rules;
      $('#rules').empty();
      i = 1;
      _a = []; _c = rules;
      for (_b = 0, _d = _c.length; _b < _d; _b++) {
        rule = _c[_b];
        _a.push((function() {
          $('#rules').append("<span class=\"colour\" id=\"rule_" + (i) + "\">" + (rule) + "</span>");
          return i += 1;
        })());
      }
      return _a;
    };
    start = function() {
      return setInterval(function() {
        return r.render();
      }, 5);
    };
    stop = function() {
      return clearInterval(timer);
    };
    r = new Renderer(640, 480, 2, 4);
    timer = null;
    rules();
    colours();
    return start();
  });
})();
