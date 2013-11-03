enchant();

core = {}

class Ball extends Sprite
  constructor: ->
    super(45, 44)
    @image = core.assets["ball.png"]
    @vx = 1
    @vy = 3
    @lastTouched = ""

  v: ->
    Math.sqrt( Math.pow(@vx, 2) + Math.pow(@vy, 2) )

  centerX: ->
    @x - @width / 2

  centerY: ->
    @y - @height / 2

  collisionWithEnemyRacket: (racket) ->
    if @lastTouched != "enemy"
      @vy = - @vy + racket.vy()
      @vx = - @vx + racket.vx()
      @lastTouched = "enemy"

  collisionWithPlayerRacket: (racket) ->
    if @lastTouched != "player"
      @vy = - @vy + racket.vy()
      @vx = - @vx + racket.vx()
      @lastTouched = "player"

  onenterframe: ->
    dx = @x + @vx
    dy = @y + @vy

    xIsInCore = 0 < dx and dx < HQ_GAME_WIDTH
    yIsInCore = 0 < dy and dy < HQ_GAME_HEIGHT

    if xIsInCore and yIsInCore
      @moveTo(dx, dy)
    else
      @dispatchEvent new Event "out"

class Racket extends Sprite
  moveCenterTo: (x, y) ->
    @previousX = @x
    @previousY = @y
    @x = x - @width / 2
    @y = y - @height / 2

  vx: ->
    @x - @previousX

  vy: ->
    @y - @previousY

class CpuRacket extends Racket
  constructor: ->
    super(128, 96)
    @image = core.assets["cpuracket.png"]
    @moveTo(400, 50)

class MyRacket extends Racket
  constructor: ->
    super(181, 137)
    @image = core.assets["myracket.png"]
    @moveTo(800, 400)

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
    @count = 0

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @cpuracket = new CpuRacket()
    @addChild(@cpuracket)

    @ball = new Ball()
    @ball.moveTo(300, 400)
    @addChild(@ball)

    @myracket = new MyRacket()
    @addChild(@myracket)

    @ball.addEventListener "out", =>
      core.gameOverScene = new GameOverScene(@count)
      core.replaceScene(core.gameOverScene)

  moveRackets: (options) ->
    x = options.x
    y = options.y

    @myracket.moveCenterTo(x, y)
    @cpuracket.moveCenterTo(x, y - 400)

  ontouchmove: (e) ->
    @moveRackets(e)

  ontouchstart: (e) ->
    @moveRackets(e)

  onenterframe: ->
    if @ball.intersect(@myracket) and @ball.lastTouched != "player"
      @ball.collisionWithPlayerRacket(@myracket)
      @count++

    if @ball.intersect(@cpuracket) and @ball.lastTouched != "enemy"
      @ball.collisionWithEnemyRacket(@cpuracket)
      @count++

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toString())
    @label.font  = "80px Serif"
    @label.color = "white"
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
  assets.push("ball.png")
  assets.push("myracket.png")
  assets.push("cpuracket.png")
  assets.push("shadow.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
