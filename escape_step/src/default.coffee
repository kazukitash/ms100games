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

class MySprite extends Sprite
  constructor: ->
    super(300, 300)

class Player extends Sprite
  constructor: ->
    super(95, 153)
    @image = core.assets["hito.png"]
    @baseY = 500
    @vx = 0
    @moveTo(1, @baseY)

  goRight: ->
    @vx = 10
    @scaleX = 1

  goLeft: ->
    @vx = - 10
    @scaleX = - 1

  onenterframe: ->
    @x += @vx if 0 < @x + @vx && @x + @width + @vx < HQ_GAME_WIDTH

    @y = 10 * Math.sin(core.frame) + @baseY

class Foot extends Sprite
  constructor: ->
    super(302, 722)
    @image = core.assets["foot.png"]
    @y = - @height

  eta: ->
    30

  stomp: (x) ->
    @x = x
    @stompAt = core.frame

  isStomping: ->
    @stompAt < core.frame

  onenterframe: ->
    if @stompAt < core.frame
      frame = core.frame - @stompAt
      v     = 20
      end   = @height / v

      if frame < end
        @y += v
      else if frame < end * 2
        @y -= v
      else
        @stompAt = Infinity

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

    @player = new Player()
    @player.x = 200
    @player.goRight()
    @addChild(@player)

    @foot = new Foot()
    @addChild(@foot)

    @timer = new CountUpTimer();
    @timer.start()

  ontouchstart: (e) ->
    if e.x < @player.x + @player.width / 2
      @player.goLeft()
    else
      @player.goRight()

  onenterframe: ->
    unless @foot.isStomping()
      random = (Math.random() * 2 - 1) * 200
      @foot.stomp(random + @player.x)

    if @foot.intersect(@player)
      core.gameOverScene = new GameOverScene(@timer.currentSec())
      core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toFixed(2))
    @label.width = 600
    @label.textAlign = "center"
    @label.moveTo((HQ_GAME_WIDTH-@label.width)/2 + 30, 370)
    @label.font = "100px Sans-serif"
    @label.color = "rgb(230,230,230)"
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene(core.titleScene)

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("time.png")
  assets.push("foot.png")
  assets.push("hito.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
