enchant();

core = {}

class Ball extends Sprite
  constructor: ->
    super(49, 38)
    @image = core.assets["pack.png"]
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
    @vy = - @vy + racket.vy()
    @vx = - @vx + racket.vx()

  collisionWithPlayerRacket: (racket) ->
    @vy = - @vy + racket.vy()
    @vx = - @vx + racket.vx()

  _collisionWithLeftSide: ->
    @y - 70 < (@x - 390) * (700 - 70) / (100-  390)

  _collisionWithRightSide: ->
    @y - 70 < (@x - 900) * (700 - 70) / (1200 - 900)

  onenterframe: ->
    dx = @x + @vx
    dy = @y + @vy

    xIsInCore = 0 < dx and dx < HQ_GAME_WIDTH
    yIsInCore = 0 < dy and dy < HQ_GAME_HEIGHT

    if xIsInCore and yIsInCore
      @moveTo(dx, dy)
    else
      @dispatchEvent new Event "out"

    if @_collisionWithLeftSide() and @vx < 0
      @vx = Math.abs(@vx)
    else if @_collisionWithRightSide() and @vx > 0
      @vx = - Math.abs(@vx)

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
    super(79, 64)
    @image = core.assets["cpuhockey.png"]
    @moveTo(400, 50)

class MyRacket extends Racket
  constructor: ->
    super(114, 92)
    @image = core.assets["myhockey.png"]
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
      if @ball.y > HQ_GAME_HEIGHT / 2
        winner = "enemy"
      else
        winner = "player"

      core.gameOverScene = new GameOverScene(winner)
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
  constructor: (winner) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @addChild(@bg)

    if winner == "enemy"
      @bg.image = core.assets["game_over2.png"]
    else
      @bg.image = core.assets["game_over1.png"]

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over1.png")
  assets.push("game_over2.png")
  assets.push("cpuhockey.png")
  assets.push("myhockey.png")
  assets.push("pack.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
