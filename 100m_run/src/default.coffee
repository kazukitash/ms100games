enchant();

core = {}

class MySprite extends Sprite
  constructor: ->
    super(300, 300)

class Bun extends Sprite
  constructor: ->
    super(151, 127)
    @startAt = core.frame

  isTimePassed: ->
    @startAt + core.fps * 1 < core.frame

  onenterframe: ->
    if @isTimePassed()
      @image = core.assets["bun.png"]
    else if @startAt + core.fps * 2 < core.frame
      @image = undefined;

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
    super(150, 191)
    @image = core.assets["runner.png"]
    @moveTo(100, 500)

  nextStep: ->
    if @frame
      @frame = 0
    else
      @frame = 1

  onenterframe: ->
    if HQ_GAME_WIDTH < @x
      e = new Event "out"
      @dispatchEvent e

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
    @v = 0

    @bg = new Sprite(5000, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild @bg

    @bun = new Bun()
    @addChild @bun

    @timer = new CountUpTimer()
    @timer.start()

    @player = new Player()
    @addChild @player

    @player.addEventListener "out", =>
      core.gameOverScene = new GameOverScene(@timer.currentSec())
      console.log @timer.currentSec()
      core.replaceScene core.gameOverScene

  scrolBack: ->
    if @canBackScrol()
      @bg.x -= @v
    else
      @player.x += @v

  canBackScrol: ->
    bgRightEnd = @bg.width + @bg.x
    HQ_GAME_WIDTH <= bgRightEnd

  ontouchstart: ->
    if @bun.isTimePassed()
      @v += 0.5
      @player.nextStep()

  onenterframe: ->
    @scrolBack()

class GameOverScene extends Scene
  constructor: (sec) ->
    super()
    @startAt = core.frame

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild @bg

    @label = new Label(sec.toFixed(2))
    @label.moveTo (HQ_GAME_WIDTH - @label.width) / 2 + 80, (HQ_GAME_HEIGHT - @label.height) / 2 - 120
    @label.font = "80px Serif"
    @label.color = "yellow"
    @addChild @label

  ontouchstart: ->
    if @startAt < core.frame + core.fps
      core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("runner.png")
  assets.push("bun.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
