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

class Runner extends Sprite
  constructor: ->
    super(300, 300)

class Pen extends Sprite
  constructor: ->
    super(47, 654)
    @image = core.assets["pen.png"]
    @x = (HQ_GAME_WIDTH - @width) / 2
    @y = - 450

class Shin extends Sprite
  constructor: ->
    super(4, 402)
    @image = core.assets["shin.png"]
    @vx = 0
    @vy = 0
    @isFalling = false

  succ: ->
    if 100 < @y
      @vy += 10
    else
      @y += 6

  onenterframe: ->
    @x += @vx
    @y += @vy

    if HQ_GAME_HEIGHT < @y
      @dispatchEvent new Event "out"

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.gameScene = new GameScene()
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @timer = new CountUpTimer()
    @timer.color = "white"
    @timer.font = "40px Serif"
    @timer.moveTo(80, 80)
    @timer.start()
    @addChild(@timer)

    @shin = new Shin()
    @shin.x = (HQ_GAME_WIDTH - @shin.width) / 2
    @shin.y = - 300
    @addChild(@shin)

    @pen = new Pen()
    @addChild(@pen)

    @shin.addEventListener "out", =>
      core.gameOverScene = new GameOverScene(@timer.currentSec())
      core.replaceScene(core.gameOverScene)

  ontouchstart: ->
    @shin.succ()

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toFixed(2))
    @label.font  = "80px Serif"
    @label.color = "black"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2 + 50
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2 - 100
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("pen.png")
  assets.push("shin.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
