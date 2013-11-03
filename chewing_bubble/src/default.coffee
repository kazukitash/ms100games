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

class Player extends Sprite
  constructor: ->
    super(746, 746)
    @image = core.assets["gum.png"]
    @moveTo((HQ_GAME_WIDTH - @width) / 2, (HQ_GAME_HEIGHT - @height) / 2 + 80)
    @scaleX = 0
    @scaleY = 1

  succ: ->
    @scaleX += 0.05
    @scaleY += 0.05

  onenterframe: ->
    nextScale = @scaleX - 0.008

    if 0 < nextScale
      @scaleX = nextScale
      @scaleY = nextScale

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
    @length = 0
    @bangAt = Infinity

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @player = new Player()
    @addChild(@player)

    @timer = new CountUpTimer()
    @timer.font  = "80px Serif"
    @timer.color = "blue"
    @timer.moveTo(48, 38)
    @timer.start()
    @addChild(@timer)

  ontouchstart: ->
    if @bangAt > core.frame
      @player.succ()

  onenterframe: ->
    if 1.1 < @player.scaleX
      @bangAt = core.frame
      pan = new Sprite(725, 459)
      pan.image = core.assets["pan.png"]
      @addChild(pan)

    if @bangAt + core.fps < core.frame
      core.gameOverScene = new GameOverScene(@timer.currentSec())
      core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @startAt = core.frame

    @label       = new Label(score.toFixed(2))
    @label.witdh = 600
    @label.textAlign = "center"
    @label.font  = "80px Serif"
    @label.color = "black"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2 - 30
    @addChild(@label)

  ontouchstart: ->
    if @startAt + core.fps < core.frame
      core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("gum.png")
  assets.push("pan.png")
  assets.push("")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
