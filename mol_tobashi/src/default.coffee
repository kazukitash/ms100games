enchant();

core = {}

class Player extends Sprite
  constructor: ->
    super(90, 144)
    @image = core.assets["player.png"]
    @swingAt = Infinity

  startSwing: ->
    @swingAt = core.frame

  onenterframe: ->
    if @swingAt + 2 * core.fps < core.frame
      @frame = 2
    else if @swingAt + 1 * core.fps < core.frame
      @frame = 1
    else
      @frame = 0

class Ball extends Sprite
  constructor: ->
    super(66, 73)
    @image = core.assets["mol.png"]
    @vx = 0
    @vy = 0

  onenterframe: ->
    dx = @x + @vx
    dy = @y + @vy
    @vy += 1

    if 601 < dy
      @vy = 0
      @vx = 0
    else
      @x = dx
      @y = dy

class Power extends Sprite
  constructor: ->
    super(326, 52)
    @image = core.assets["power.png"]
    @isMoving = false

  start: ->
    @isMoving = true

  stop: ->
    @isMoving = false

  percentage: ->
    @width / 326

  onenterframe: ->
    if @isMoving
      @width = (Math.sin(core.frame / 10) + 1) * 326 / 2

class Angle extends Sprite
  constructor: ->
    super(20, 107)
    @image = core.assets["angle.png"]
    @isMoving = false
    @originX = 10
    @originY = 107

  start: ->
    @isMoving = true

  stop: ->
    @isMoving = false

  percentage: ->
    Math.sin(core.frame / 10)

  onenterframe: ->
    if @isMoving
      @rotation = Math.sin(core.frame / 10) * 40 + 40
      console.log @rotation

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
    @touchCount = []

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @player = new Player()
    @player.moveTo(100, 500)
    @addChild(@player)

    @power = new Power()
    @power.moveTo(600, 600)
    @power.start()
    @addChild(@power)

    @angle = new Angle()
    @angle.moveTo(200, 500)
    @angle.start()
    @addChild(@angle)

    @ball = new Ball()
    @ball.moveTo(150, 600)
    @addChild(@ball)

  ontouchstart: ->
    @touchCount.push(core.frame)

    if @touchCount.length == 1
      @power.stop()
    else if @touchCount.length == 2
      @angle.stop()
      @player.startSwing()

  onenterframe: ->
    if @touchCount.length > 1
      if @touchCount[1] + 2 * core.fps == core.frame
        power = @power.percentage() * 20 + 4
        angle = Math.PI / 2 - @angle.percentage() * Math.PI / 2
        @ball.vx = power * Math.sin(angle)
        @ball.vy =  - 1 - power * Math.sin(angle)

      if @ball.vx == 0 and @ball.vy == 0 and @touchCount[1] + 4 * core.fps < core.frame
        core.gameOverScene = new GameOverScene(@ball.x)
        core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label((score / 10).toFixed())
    @label.font  = "80px Serif"
    @label.color = "black"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2 + 130
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
  assets.push("player.png")
  assets.push("mol.png")
  assets.push("power.png")
  assets.push("angle.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
