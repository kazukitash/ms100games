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
  constructor: (w, h) ->
    super(w, h)
    @vx = 0
    @vy = 0

  # edit yourself.
  endCondition: ->
    false

  # edit yourself.
  shake: ->
    if @endCondition()
      @dispatchEvent new Event("over")
    else
      # do something

  ontouchmove: ->
    if @opacity < 0.2
      @opacity = 0
      @dispatchEvent new Event "over"
    else
      @opacity -= 0.01
      @vx = 2 * Math.random() - 1
      @vy = 2 * Math.random() - 1

  onenterframe: ->
    @x += @vx
    @y += @vy

class Yogore extends Shaking
  constructor: (w, h) ->
    super(75, 75)
    @image = core.assets["yogore.png"]

class Unchi extends Shaking
  constructor: (w, h) ->
    super(117, 93)
    @image = core.assets["unchi.png"]

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
    _this = @
    @length = 0

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @timer = new CountUpTimer()
    @timer.start()

    # @count = Math.floor(5 * Math.random()) + 2
    @count = 1
    @length = 2 * @count

    @yogores = []
    @unchies = []

    count = @count
    while count
      yogore = new Yogore()
      yogore.moveTo(HQ_GAME_WIDTH / 2, HQ_GAME_HEIGHT / 2)
      yogore.moveBy(Math.random() * 300 - 150, Math.random() * 200 - 100)
      yogore.addEventListener "over", ->
        _this.removeChild @
        _this.length--
        _this.yogores.pop()
      @addChild yogore
      @yogores.push yogore

      unchi = new Unchi()
      unchi.moveTo(HQ_GAME_WIDTH / 2, HQ_GAME_HEIGHT / 2)
      unchi.moveBy(Math.random() * 300 - 150, Math.random() * 200 - 100)
      unchi.addEventListener "over", ->
        _this.removeChild @
        _this.length--
        _this.unchies.pop()
      @addChild unchi
      @unchies.push unchi
      --count

  # edit yourself.
  endCondition: ->
    @yogores.length == 0 and @unchies.length == 0

  onenterframe: ->
    if @endCondition()
      core.gameOverScene = new GameOverScene(@timer.currentSec())
      core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toFixed(2))
    @label.font  = "80px Serif"
    @label.color = "black"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2
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
  assets.push("unchi.png")
  assets.push("yogore.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
