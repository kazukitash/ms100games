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

class Noboridai extends Sprite
  constructor: ->
    super(724, 590)
    @image = core.assets["noboridai.png"]

class Player extends Sprite
  constructor: ->
    super(203, 176)
    @image = core.assets["player.png"]
    @r = 0
    @v = 0
    @moveTo(@r + 200, HQ_GAME_HEIGHT - @r - 200)

  succ: ->
    @frame++
    if @v <= 200
      @v += 5

  onenterframe: ->
    nextR = @r + @v

    if 0 < nextR
      @r = nextR
      @v -= 1.2
      @moveTo(@r + 200, HQ_GAME_HEIGHT - @r - 200)

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

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @player = new Player()
    @addChild(@player)

    @noboridai = new Noboridai()
    @noboridai.moveTo(300, 100)
    @addChild(@noboridai)

    @timer = new CountUpTimer()
    @timer.color = "blue"
    @timer.moveTo(100, 100)
    @timer.start()
    @addChild(@timer)

  ontouchstart: ->
    @player.succ()

  onenterframe: ->
    if @player.r > 480
      core.gameOverScene = new GameOverScene(@timer.currentSec())
      core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @startAt = core.frame

    @label       = new Label(score.toFixed(2).toString())
    @label.witdh = 600
    @label.textAlign = "center"
    @label.font  = "80px Serif"
    @label.color = "black"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2
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
  assets.push("noboridai.png")
  assets.push("player.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
