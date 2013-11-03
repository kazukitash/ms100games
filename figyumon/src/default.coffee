enchant();

core = {}

Options = [
  {style: "#ffff5a"},
  {style: "#ffafff"},
  {style: "#4bc8ff"},
  {style: "#a4ff5e"},
  {style: "#ff0000"},
  {style: "#ffaa3c"},
  {style: "#007575"}
]

class Capsule extends Sprite
  constructor: ->
    super 160, 169
    @image = core.assets["capsule.png"]
    @moveTo 825 - @width / 2, 580 - @height / 2

class RestartBtn extends Sprite
  constructor: ->
    super 236, 83
    @image = core.assets["restart.png"]
    @moveTo 305 - @width / 2, 670 - @height / 2

  ontouchstart: ->
    core.titleScene = new TitleScene()
    core.replaceScene core.titleScene

class Handle extends Sprite
  constructor: ->
    super 206, 212
    @image = core.assets["handle.png"]
    @moveTo 1010, 475

    @isUpperLeft = false
    @isUpperRight = false
    @isLowerLeft = false
    @isLowerRight = false
    @counter = 1
    @isSet = true

    @addEventListener "UpperLeft", =>
      @isUpperLeft = true
    @addEventListener "UpperRight", =>
      @isUpperRight = true
    @addEventListener "LowerLeft", =>
      @isLowerLeft = true
    @addEventListener "LowerRight", =>
      @isLowerRight = true
    @addEventListener "Set", =>
      @isSet = true

  onenterframe: ->
    if @isSet
      if @isUpperLeft and @isUpperRight
        @tl.rotateBy -45, 5
        @counter++
        @isUpperRight = false
        @isLowerRight = false
      else if @isLowerLeft and @isUpperLeft
        @tl.rotateBy -45, 5
        @counter++
        @isUpperLeft = false
        @isUpperRight = false
      else if @isLowerRight and @isLowerLeft
        @tl.rotateBy -45, 5
        @counter++
        @isLowerLeft = false
        @isUpperLeft = false
      else if @isUpperRight and @isLowerRight
        @tl.rotateBy -45, 5
        @counter++
        @isLowerRight = false
        @isLowerLeft = false
      if @counter % 8 == 0
        @counter++
        @isSet = false
        ev = new Event "Gatya"
        @dispatchEvent ev

class TriangleSurface extends Surface
  constructor: (options) ->
    side = options.side
    radius = options.radius
    style = options.style

    super radius, radius
    @context.beginPath()
    @context.moveTo side / 2, 0
    @context.lineTo side, radius
    @context.lineTo 0, radius
    @context.closePath()
    @context.fillStyle = style
    @context.fill()

class SquareSurface extends Surface
  constructor: (options) ->
    side = options.side
    style = options.style

    super side, side
    @context.fillStyle = style
    @context.fillRect 0, 0, side, side


class CircleSurface extends Surface
  constructor: (options) ->
    radius = options.radius
    style = options.style

    super radius * 2, radius * 2
    @context.arc radius, radius, radius, 0, 2 * Math.PI, false
    @context.fillStyle = style
    @context.fill()

class Triangle extends Sprite
  constructor: ->
    options = Options[Math.floor(Math.random() * 7)]
    options.side = Math.floor(Math.random() * 50 + 30)
    options.radius = Math.floor(3 * options.side * Math.tan(Math.PI / 6))
    super options.radius, options.radius
    @image = new TriangleSurface options
    @moveTo 310 - @width / 4, 500 - @height / 2

    @distance = 3 * options.side * Math.tan(Math.PI / 6) / 4

  onenterframe: ->
    if @age % 60
      @animation()

  animation: ->
    option = Math.random() * 2 - 1
    if option > 0
      speed = 1
    else
      speed = -1
    @tl
      .moveBy(speed, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, -3, 30)
    @tl
      .moveBy(speed, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, 3, 30)
    @tl
      .moveBy(-speed, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, -3, 30)
    @tl
      .moveBy(-speed, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, 3, 30)

class Square extends Sprite
  constructor: ->
    options = Options[Math.floor(Math.random() * 7)]
    options.side = Math.floor(Math.random() * 40 + 40)
    super options.side, options.side
    @image = new SquareSurface options
    @moveTo 310 - @width / 2, 500 - @height / 2

    @distance = options.side / 2

  onenterframe: ->
    if @age % 60
      @animation()

  animation: ->
    option = Math.random() * 2 - 1
    if option > 0
      speed = 1
    else
      speed = -1
    @tl
      .moveBy(speed, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, -3, 30)
    @tl
      .moveBy(speed, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, 3, 30)
    @tl
      .moveBy(-speed, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, -3, 30)
    @tl
      .moveBy(-speed, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, 3, 30)

class Circle extends Sprite
  constructor: ->
    options = Options[Math.floor(Math.random() * 7)]
    options.radius = Math.floor(Math.random() * 40 + 30)
    super options.radius * 2, options.radius * 2
    @image = new CircleSurface options
    @moveTo 310 - @width / 2, 500 - @height / 2

    @distance = options.radius

  onenterframe: ->
    if @age % 60
      @animation()

  animation: ->
    option = Math.random() * 2 - 1
    if option > 0
      speed = 1
    else
      speed = -1
    @tl
      .moveBy(speed, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, -3, 30)
    @tl
      .moveBy(speed, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, 3, 30)
    @tl
      .moveBy(-speed, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, -3, 30)
    @tl
      .moveBy(-speed, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, 3, 30)

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild @bg

  ontouchstart: ->
    core.howToScene = new HowToScene()
    core.pushScene(core.howToScene)

class HowToScene extends Scene
  constructor: ->
    super()

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["how.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.popScene()
    core.gameScene = new GameScene()
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: ->
    super
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild @bg

    @restartBtn = new RestartBtn()
    @addChild @restartBtn

    @handle = new Handle()
    @addChild @handle
    @handle.addEventListener "Gatya", =>
      capsule = new Capsule()
      @addChild capsule
      capsule.scale 0.1, 0.1
      capsule.tl
        .scaleTo(0.8, 0.8, 30)
        .and()
        .moveTo(470, 200, 30)
        .and()
        .rotateBy(-360, 30)
      capsule.tl
        .delay(15)
        .scaleTo(1, 1, 15)
        .and()
        .fadeOut 15
      len = @figureList.length
      currentFigure = @figureList[--len]
      maxRadius = currentFigure.distance
      radian = Math.random() * 360
      y = -maxRadius * Math.random() * Math.sin(radian) - maxRadius * 0.5
      if radian < 90 or radian > 270
        x = maxRadius * Math.random() * Math.cos(radian)
      else
        x = -maxRadius * Math.random() * Math.cos(radian)
      switch Math.floor(Math.random() * 3)
        when 0
          figure = new Triangle()
          @figureList.push figure
          @addChild figure
          figure.moveTo currentFigure.x + x, currentFigure.y + y
        when 1
          figure = new Square()
          @figureList.push figure
          @addChild figure
          figure.moveTo currentFigure.x + x, currentFigure.y + y
        when 2
          figure = new Circle()
          @figureList.push figure
          @addChild figure
          figure.moveTo currentFigure.x + x, currentFigure.y + y
      ev = new Event "Set"
      @handle.tl
        .delay(30)
        .then =>
          @handle.dispatchEvent ev

    @pointer = x: 0, y: 0
    @figureList = []

    switch Math.floor(Math.random() * 3)
      when 0
        figure = new Triangle()
        @figureList.push figure
        @addChild figure
      when 1
        figure = new Square()
        @figureList.push figure
        @addChild figure
      when 2
        figure = new Circle()
        @figureList.push figure
        @addChild figure

  ontouchstart: (e) ->
    @pointer.x = e.x
    @pointer.y = e.y

  ontouchmove: (e) ->
    if e.x - @pointer.x < 0 and e.y - @pointer.y < 0
      ev = new Event "UpperLeft"
      @handle.dispatchEvent ev
    else if e.x - @pointer.x > 0 and e.y - @pointer.y < 0
      ev = new Event "UpperRight"
      @handle.dispatchEvent ev
    else if e.x - @pointer.x < 0 and e.y - @pointer.y > 0
      ev = new Event "LowerLeft"
      @handle.dispatchEvent ev
    else if e.x - @pointer.x > 0 and e.y - @pointer.y > 0
      ev = new Event "LowerRight"
      @handle.dispatchEvent ev
    @pointer.x = e.x
    @pointer.y = e.y

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push "title.png"
  assets.push "game.png"
  assets.push "restart.png"
  assets.push "handle.png"
  assets.push "capsule.png"
  assets.push "how.png"
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
