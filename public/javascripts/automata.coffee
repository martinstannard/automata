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
      @.reset()

    reset: ->
      for i in [0...@width]
        @pop1[i] = @.randint(@states)
      for i in [0...@states * 3]
        @rules.push @.randint(@states)
        @colours.push @.random_colour()

    random_colour: ->
      "rgb(#{@.randint(255)},#{@.randint(255)},#{@.randint(255)})"

    draw: (canvas, line, block) ->
      for i in [0...@width]
        canvas.colour @colours[@pop1[i]]
        canvas.dot i * block, line, block, block

    populate: ->
      for i in [0...@width]
        rule_number = @pop1[@.modded(i - 1, @width)] + @pop1[i] + @pop1[@.modded(i + 1, @width)]
        @pop2[i] = @rules[rule_number]
      @pop1 = @pop2.slice(0)

    randint: (ceil) ->
      Math.floor(Math.random()*ceil)

    modded: (n, mod) ->
      (n + mod) % mod



  draw_ca = ->
    can = new Canvas 'automata'
    can.dot 1, 1, 640, 480
    $('#automata').bind 'mousedown', (event) =>
      ca = new CA 4, 320
      block = 2
      for i in [0...240]
        setTimeout(
        ->
          ca.draw(can, block * i, block)
          ca.populate()
        , 250)

  draw_ca()
