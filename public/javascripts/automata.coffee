$ ->
  class Canvas

    constructor: (id) ->
      @context = $("#" + id)[0].getContext '2d'

    dot: (x, y, w, h) ->
      @context.fillRect x, y, w, h

    colour: (colour) ->
      @context.fillStyle = colour

  class CA

    constructor: (@canvas, @states, @width) ->
      @pop1 = []
      @pop2 = []
      @.reset()

    reset: ->
      @rules = []
      @colours = []
      for i in [0...@width]
        @pop1[i] = @.randint(@states)
      for i in [0...@states * 3]
        @rules.push @.randint(@states)
        @colours.push @.random_colour()

    random_colour: ->
      "rgb(#{@.randint(255)},#{@.randint(255)},#{@.randint(255)})"

    draw: (line, block) ->
      for i in [0...@width]
        @canvas.colour @colours[@pop1[i]]
        @canvas.dot i * block, line, block, block

    populate: ->
      for i in [0...@width]
        rule_number = @pop1[@.modded(i - 1, @width)] + @pop1[i] + @pop1[@.modded(i + 1, @width)]
        @pop2[i] = @rules[rule_number]
      @pop1 = @pop2.slice(0)

    randint: (ceil) ->
      Math.floor(Math.random()*ceil)

    modded: (n, mod) ->
      (n + mod) % mod

  class Renderer
    constructor: (@width, @height, @block_size, @states) ->
      @canvas = new Canvas 'automata'
      @canvas.dot 1, 1, @width, @height
      @ca = new CA @canvas, @states, @width / @block_size
      @gen = 0

    render: ->
      @ca.draw(@block_size * @gen, @block_size)
      @ca.populate()
      @gen += 1
      @roll()

    roll: ->
      if @gen * @block_size > @height
        @gen = 0

    new_rules: ->
      @ca.reset()


  
  r = new Renderer 640, 480, 2, 4

  $('body').bind 'keypress', (event) =>
    if event.which == 114
      r.new_rules()

  setInterval(
  ->
    r.render()
  , 5)
  

