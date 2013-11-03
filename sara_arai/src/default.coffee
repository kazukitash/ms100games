# This is Template of The Cola Type.

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

class Shaking extends Sprite
  constructor: (x, y) ->
    super(x, y)

  # edit yourself.
  endCondition: ->
    false

  # edit yourself.
  shake: ->
    if @endCondition()
      @dispatchEvent new Event("over")
    else
      # do something

  ontouchmove: (e) ->
    next = @opacity - 0.01

    if next > 0.2
      @opacity = next
    else
      @opacity = 0

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

    @newDish()

    @timer = new CountDownTimer(30)
    @timer.font = "40px Serif"
    @timer.color = "white"
    @timer.moveTo(50, 100)
    @timer.start()
    @addChild(@timer)

    @label = new Label(@length.toString())
    @label.font = "40px Serif"
    @label.moveTo(1150, 70)
    @addChild(@label)

    @timer.addEventListener "over", =>
      core.gameOverScene = new GameOverScene(@length)
      core.replaceScene(core.gameOverScene)

  succPath: (e) ->
    if @endCondition()
      ++ @length
      @newDish()
      @label.text = @length.toString()

  newDish: ->
    @dish = new Sprite(578, 558)
    @dish.image = core.assets["sara.png"]
    @dish.moveTo(400, 100)
    @addChild @dish

    d = 100
    x = 2 * d * Math.random() - d + 50
    y = 2 * d * Math.random() - d + 50
    @taint1 = new Shaking(229, 175)
    @taint1.image = core.assets["yogore1.png"]
    @taint1.moveTo(HQ_GAME_WIDTH / 2, HQ_GAME_HEIGHT / 2)
    @taint1.moveBy(x, y)
    @addChild(@taint1)

    @taint2 = new Shaking(229, 175)
    @taint2.image = core.assets["yogore2.png"]
    @taint2.moveTo(HQ_GAME_WIDTH / 2, HQ_GAME_HEIGHT / 2)
    @taint2.moveBy(- x, -y)
    @addChild(@taint2)

  # edit yourself.
  endCondition: ->
    @taint1.opacity < 0.01 and @taint2.opacity < 0.01

  ontouchstart: (e) ->
    @succPath(e)

  ontouchmove: (e) ->
    @succPath(e)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toString())
    @label.font  = "80px Serif"
    @label.color = "black"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2 + 150
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("sara.png")
  assets.push("sponge.png")
  assets.push("yogore1.png")
  assets.push("yogore2.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
