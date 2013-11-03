enchant();

core = {}

class CountDownTimer extends Label
  constructor: (sec) ->
    super()

    @frame   = sec * core.fps
    @startAt = Infinity
    @stopAt  = Infinity

  start: ->
    @startAt = core.frame

  stop: ->
    @stopAt = core.frame

  isStarted: ->
    @startAt < core.frame

  isStopped: ->
    @stopAt < core.frame

  remainingFrame: ->
    @frame - core.frame + @startAt

  remainingSec: ->
    @remainingFrame() / core.fps

  bonus: (bonus) ->
    @frame += bonus * core.fps

  onenterframe: ->
    if !@isStopped()
      @text = @remainingSec().toFixed(2)

class Player extends Sprite
  constructor: ->
    super(276, 147)
    @image = core.assets["player.png"]
    @frame = [0,0,0,1,1,1]
    @moveTo 100, 250

  onenterframe: ->
    if (@age - 1) % 120 == 0
      @behavior()

  behavior: ->
    @tl
      .moveBy(2, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, -3, 30)
    @tl
      .moveBy(2, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, 3, 30)
    @tl
      .moveBy(-2, 0, 30, enchant.Easing.CUBIC_EASEIN)
      .and()
      .moveBy(0, 3, 30)
    @tl
      .moveBy(-2, 0, 30, enchant.Easing.CUBIC_EASEOUT)
      .and()
      .moveBy(0, -3, 30)

class Wall extends Sprite
  constructor: (vx) ->
    super(345, 720)
    @image = core.assets["wall.png"]
    @frame = 0
    @moveTo HQ_GAME_WIDTH, 0

    @isdestroyed = false

    @vx = vx

  ontouchstart: ->
    @frame = 1
    @isdestroyed = true

  onenterframe: ->
    @moveBy @vx, 0

class ShockWave extends Sprite
  constructor: (e) ->
    super(300, 300)
    @image = core.assets["attack.png"]
    @moveTo e.x - @width / 2, e.y - @height / 2

    @tl.scaleTo(0.9, 0.9, 10).scaleTo(1.1, 1.1, 10)
    @tl.scaleTo(1.0, 1.0, 10).and().fadeOut(10).then =>
      ev = new Event "end"
      @dispatchEvent ev

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

    @round = 1
    @how = false

  ontouchstart: ->
    if !@how
      @how = true
      core.howToScene = new HowToScene()
      core.pushScene(core.howToScene)
      @bg.image = core.assets["start.png"]
      @tl.delay(30).then =>
        core.gameScene = new GameScene(@round)
        core.replaceScene(core.gameScene)

class HowToScene extends Scene
  constructor: ->
    super()

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["how.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.popScene()


class GameScene extends Scene
  constructor: (round) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH * 2, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)
    @round = round
    vx = (@round * 0.1 + 1) * 14
    @vx = -vx

    @player = new Player()
    @addChild @player

    @walls = []

    @delay = 90
    if round * 3 < 80
      @offset = 90 - round * 3
    else
      @offset = 10

    @timer = new CountDownTimer(30)
    @timer.start()

    @moveTo 0, 0
    @bg.addEventListener "enterframe", ->
      @x -= vx
      if @x <= -HQ_GAME_WIDTH
        @x = 0

    @score = round
    @scoreLabel = new Label(@score.toString() + "階")
    @scoreLabel.width = 600
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo((HQ_GAME_WIDTH-@scoreLabel.width)/2, 300)
    @scoreLabel.font = "128px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild(@scoreLabel)

    @tl.delay(30).then =>
      @removeChild @scoreLabel

  onenterframe: ->
    if @timer.remainingFrame() == 0
      core.gameScene = new GameScene(@round + 1)
      core.replaceScene core.gameScene
    if @age == @delay
      if @offset > 10
        @offset--
      @delay += Math.floor(Math.random() * @offset) + 30
      wall = new Wall(@vx)
      @addChild wall
      @walls.push wall

    wallsLength = @walls.length
    while wallsLength
      wall = @walls[--wallsLength]
      if !wall.isdestroyed
        if wall.intersect @player
          core.gameOverScene = new GameOverScene(@round)
          core.replaceScene core.gameOverScene

  ontouchstart: (e) ->
    shockWave = new ShockWave(e)
    @addChild shockWave
    shockWave.addEventListener "end", =>
      @removeChild shockWave

class GameOverScene extends Scene
  constructor: (round) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = round
    @scoreLabel = new Label(@score.toString() + "階")
    @scoreLabel.width = 600
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo((HQ_GAME_WIDTH-@scoreLabel.width)/2, 300)
    @scoreLabel.font = "128px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild(@scoreLabel)

  ontouchstart: ->
    core.titleScene = new TitleScene()
    core.replaceScene(core.titleScene)

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("start.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("player.png")
  assets.push("attack.png")
  assets.push("wall.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
