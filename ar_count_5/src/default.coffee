enchant();

core = {}

class CountDownTimer extends Label
  constructor: (sec) ->
    super()
    @frame = sec * core.fps
    @startAt = Infinity

  start: ->
    @startAt = core.frame

  isStarted: ->
    @startAt < core.frame

  remainingFrame: ->
    @frame - core.frame + @startAt

  remainingSec: ->
    @remainingFrame() / core.fps

  onenterframe: ->
    @text = @remainingSec().toFixed(2)

    if @remainingFrame() == 0
      e = new Event "over"
      @dispatchEvent(e)


class Runner extends Sprite
  constructor: ->
    super(300, 300)

class Bar extends Sprite
  constructor: ->
    super(545, 88)
    @image = core.assets["bar.png"]
    @moveTo(22, 602)

  succ: ->
    next = @width - 545 / 13
    if 0 <= next
      @width = next
    else
      @dispatchEvent new Event "over"

class Water extends Sprite
  constructor: ->
    super(279, 351)
    @image = core.assets["water.png"]
    @startAt = Infinity
    @opacity = 0
    @moveTo(900,50)

  start: ->
    @startAt = core.frame
    @opacity = 1

  onenterframe: ->
    if @startAt < core.frame and 0.01 < @opacity
      @scaleX = Math.sin(core.frame / 6)
      @opacity -= 0.1
    else if @startAt + 1 * core.fps < core.frame
      @opacity = 0
      @startAt = Infinity

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
    @touchLog = []

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @bar = new Bar()
    @addChild(@bar)

    @water = new Water()
    @addChild(@water)

    @timer = new CountDownTimer(15);
    @timer.start()
    @timer.font = "40px Serif"
    @timer.color = "red"
    @timer.moveTo(100, 100)
    @addChild(@timer)

    @timer.addEventListener "over", =>
      core.GameOverScene = new GameOverScene(@timer.remainingFrame())
      core.replaceScene(core.GameOverScene)


  lastTouchedAt: ->
    @touchLog[@touchLog.length - 1]

  ontouchstart: (e) ->
    if 1100 - e.x < e.y
      if @touchLog.length == 0 or @lastTouchedAt() + 1 * core.fps < core.frame
        @touchLog.push core.frame
        @bar.succ()
        @water.start()

    core.gameScene = new GameScene()

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @startAt = core.frame

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    if score > 10
      @bg.image = core.assets["game_over2.png"]
    else
      @bg.image = core.assets["game_over1.png"]

    @addChild(@bg)

    @label       = new Label(score.toString())
    @label.font  = "80px Serif"
    @label.color = "white"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2
    @addChild(@label)

  ontouchstart: ->
    if @startAt + 1 * core.fps < core.frame
      core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over1.png")
  assets.push("game_over2.png")
  assets.push("water.png")
  assets.push("bar.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
