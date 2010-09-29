$ ->
  class Canvas

    constructor: (id) ->
      @context = $("#" + id)[0].getContext '2d'

    dot: (x, y, w, h) ->
      @context.fillRect x, y, w, h

    colour: (colour) ->
      @context.fillStyle = colour

  class CA

    constructor: (@states, @width) ->
      @rules = []
      @colours = []
      @pop1 = []
      @pop2 = []
      @.make_colours()
      @.make_rules()
      @.initial_state()

    initial_state: ->
      for i in [0...@width]
        @pop1[i] = Math.floor(Math.random()*@states)

    make_rules: ->
      for i in [0...@states * 3]
        @rules.push Math.floor(Math.random()*@states)

    make_colours: ->
      for i in [0...@states * 3]
        @colours.push @.random_colour()

    random_colour: ->
      r = Math.floor(Math.random()*255)
      g = Math.floor(Math.random()*255)
      b = Math.floor(Math.random()*255)
      "rgb(#{r},#{g},#{b})"

    draw: (canvas, line, block) ->
      for i in [0...@width]
        canvas.colour @colours[@pop1[i]]
        canvas.dot i * block, line, block, block

    populate: ->
      for i in [0...@width]
        below = ((i - 1) + @width) % @width
        above = ((i + 1) + @width) % @width
        rule_number = @pop1[below] + @pop1[i] + @pop1[above]
        rule_number ?= 0
        @pop2[i] = @rules[rule_number]
      @pop1 = @pop2.slice(0)

  draw_ca = ->
    can = new Canvas 'automata'
    can.dot 1, 1, 640, 480
    $('#automata').bind 'mousedown', (event) =>
      ca = new CA 6, 320
      block = 2
      for i in [0...240]
        ca.draw(can, block * i, block)
        ca.populate()

  draw_ca()
