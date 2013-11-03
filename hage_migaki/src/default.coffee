# This is Template of The Cola Type.

enchant();

core = {}

class CountUpTimer extends Label
  constructor: ->
    super "0.00"
    @startAt = Infinity

  start: ->
    @startAt = core.frame

  currentFrame: ->
    core.frame - @startAt

  currentSec: ->
    @currentFrame() / core.fps

  onenterframe: ->
    @text = @currentSec().toFixed(2)

class Shaking extends Sprite
  constructor: ->
    super(300, 300)
    @image = core.assets[""]

  # edit yourself.
  endCondition: ->
    false

  # edit yourself.
  shake: ->
    if @endCondition()
      @dispatchEvent new Event("over")
    else
      # do something

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title-game.png"]
    @addChild(@bg)

    @title = new Sprite(693, 578)
    @title.image = core.assets["title.png"]
    @title.moveTo(300, HQ_GAME_HEIGHT - @title.height)
    @title.v = 0
    @addChild(@title)

  ontouchstart: ->
    @title.v = 10

  onenterframe: ->
    @title.y += @title.v

    if HQ_GAME_HEIGHT < @title.y
      core.gameScene = new GameScene()
      core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: ->
    super()
    @length = 0

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title-game.png"]
    @addChild(@bg)

    @timer = new CountUpTimer()
    @timer.start()

    @messageLike = new Sprite(266, 169)
    @messageLike.image = core.assets["text1.png"]
    @messageLike.moveTo(100, 100)
    @messageLike.opacity = 0
    @addChild(@messageLike)

    @messageOops = new Sprite(230, 147)
    @messageOops.image = core.assets["text5.png"]
    @messageOops.moveTo(400, 100)
    @messageOops.opacity = 0
    @addChild(@messageOops)

    @messageHumm = new Sprite(230, 147)
    @messageHumm.image = core.assets["text3.png"]
    @messageHumm.moveTo(700, 100)
    @messageHumm.opacity = 0
    @addChild(@messageHumm)

    @messageGood = new Sprite(231, 146)
    @messageGood.image = core.assets["text4.png"]
    @messageGood.moveTo(800, 400)
    @messageGood.opacity = 0
    @addChild(@messageGood)

    @shine1 = new Sprite(312, 311)
    @shine1.moveTo(600, 200)
    @shine1.image = core.assets["shin1.png"]
    @addChild(@shine1)

    @shine2 = new Sprite(176, 376)
    @shine2.moveTo(300, 300)
    @shine2.image = core.assets["shin2.png"]
    @addChild(@shine2)

    @zoukin = new Sprite(159, 109)
    @zoukin.image = core.assets["zokin.png"]
    @zoukin.moveCenterTo = (x, y) ->
      @x = x - @width / 2
      @y = y - @height / 2

    @addChild(@zoukin)

  succPath: (e) ->
    @zoukin.moveCenterTo(e.x, e.y)

    if @endCondition()
      core.gameOverScene = new GameOverScene()
      core.replaceScene(core.gameOverScene)
    else
      ++ @length

      @shine1.opacity = (Math.sin(@length / 6) + 1) / 2
      @shine2.opacity = (Math.cos(@length / 5) + 1) / 2

      if @length < 100
        @messageLike.opacity += 0.01
      else if @length < 200
        @messageGood.opacity += 0.01
      else if @length < 300
        @messageHumm.opacity += 0.01
      else if @length < 400
        @messageOops.opacity += 0.01

  # edit yourself.
  endCondition: ->
    400 < @length + 1

  ontouchstart: (e) ->
    @succPath(e)

  ontouchmove: (e) ->
    @succPath(e)

class GameOverScene extends Scene
  constructor: () ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.titleScene = new TitleScene()
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("title-game.png")
  assets.push("game_over.png")
  assets.push("zokin.png")
  assets.push("shin1.png")
  assets.push("shin2.png")
  assets.push("shin3.png")
  assets.push("text1.png")
  assets.push("text2.png")
  assets.push("text3.png")
  assets.push("text4.png")
  assets.push("text5.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
