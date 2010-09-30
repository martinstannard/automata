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
      @rules = []
      @colours = []
      @state = "random"
      @reset()

    reset: ->
      @palette()
      @new_rules()
      @seed()

    new_rules: ->
      @rules = []
      for i in [0...@states * 5]
        @rules.push @.randint(@states)
      @seed()


    seed: ->
      switch @state
        when "random" then @random()
        when "symmetrical" then @symmetrical()

    random: ->
      @state = "random"
      for i in [0...@width]
        @pop1[i] = @randint(@states)

    symmetrical: ->
      @state = "symmetrical"
      for i in [0...@width]
        @pop1[i] = 0
      p = @width/2
      @pop1[p] = @randint(@states)
      c = @randint(@states)
      @pop1[p-1] = c
      @pop1[p+1] = c

    palette: ->
      @colours = []
      for i in [0...@states * 5]
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

  r = new Renderer 640, 480, 2, 4

  timer = null

  $('body').bind 'keypress', (event) =>
    console.log event.which
    if event.which == 114
      r.new_rules()
    if event.which == 103
      timer = start()
    if event.which == 115
      stop()

  $('#reset').bind 'click', (event) =>
    r.ca.reset()

  $('#rules').bind 'click', (event) =>
    r.ca.new_rules()

  $('#palette').bind 'click', (event) =>
    r.ca.palette()

  $('#random').bind 'click', (event) =>
    r.ca.random()

  $('#symmetrical').bind 'click', (event) =>
    r.ca.symmetrical()

  $('#states').bind 'change', (event) =>
    r.ca.states = $('#states option:selected')[0].text
    r.ca.reset()

  start = ->
    setInterval(
    ->
      r.render()
    , 5)

  stop = ->
    clearInterval timer
  
  start()

