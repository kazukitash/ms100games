# This is the template of Cola Type.

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
  # edit yourself.
  endCondition: ->
    @opacity < 0.01

  # edit yourself.
  shake: ->
    if @endCondition()
      @dispatchEvent new Event("over")
    else
      # do something
      @opacity -= 0.01

class LeftEye extends Shaking
  constructor: ->
    super(352, 200)
    @image = core.assets["left-glass2.png"]
    @frame = Math.floor(Math.random() * 4)
    @moveTo(200, 400)

class LeftGlass extends Shaking
  constructor: ->
    super(329, 200)
    @image = core.assets["left-glass1.png"]
    @frame = 1
    @moveTo(220, 400)

class LeftTaintedGlass extends Shaking
  constructor: ->
    super(329, 200)
    @image = core.assets["left-glass1.png"]
    @frame = 0
    @moveTo(220, 400)

class RightEye extends Shaking
  constructor: ->
    super(352, 200)
    @image = core.assets["right-glass2.png"]
    @moveTo(770, 400)
    @frame = Math.floor(Math.random() * 4)

class RightGlass extends Shaking
  constructor: ->
    super(324, 200)
    @image = core.assets["left-glass1.png"]
    @frame = 1
    @moveTo(770, 400)

class RightTaintedGlass extends Shaking
  constructor: ->
    super(324, 200)
    @image = core.assets["right-glass1.png"]
    @frame = 0
    @moveTo(770, 400)

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
    @timer.start()

    @leftEye = new LeftEye()
    @addChild(@leftEye)

    @leftGlass = new LeftGlass()
    @addChild(@leftGlass)

    @leftTaintedGlass = new LeftTaintedGlass()
    @addChild(@leftTaintedGlass)

    @rightEye = new RightEye()
    @addChild(@rightEye)

    @rightGlass = new RightGlass()
    @addChild(@rightGlass)

    @rightTaintedGlass = new RightTaintedGlass()
    @addChild(@rightTaintedGlass)

  succPath: (e) ->
    if @endCondition()
      # core.gameOverScene = new GameOverScene()
      core.replaceScene(core.titleScene)
    else
      if HQ_GAME_WIDTH / 2 < e.x
        if @rightTaintedGlass.endCondition()
          @rightGlass.shake()
        else
          @rightTaintedGlass.shake()
      else
        if @leftTaintedGlass.endCondition()
          @leftGlass.shake()
        else
          @leftTaintedGlass.shake()

  # edit yourself.
  endCondition: ->
    @rightGlass.opacity < 0.01 && @leftGlass.opacity < 0.01

  ontouchstart: (e) ->
    @succPath(e)

  ontouchmove: (e) ->
    @succPath(e)

class GameOverScene extends Scene
  constructor: (score = 0) ->
    super()
    # @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    # @bg.image = core.assets["game_over.png"]
    # @addChild(@bg)

    @label       = new Label(score.toString())
    @label.font  = "80px Serif"
    @label.color = "white"
    @label.x     = (HQ_GAME_WIDTH - @width) / 2
    @label.y     = (HQ_GAME_HEIGHT - @height) / 2
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  # assets.push("game_over.png")
  assets.push("left-glass1.png")
  assets.push("left-glass2.png")
  assets.push("right-glass1.png")
  assets.push("right-glass2.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
