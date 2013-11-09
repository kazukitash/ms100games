enchant();

core = {}

class Flying extends Sprite
  constructor: ->
    super(117, 125)
    @image = core.assets["trash.png"]
    @vx = 0
    @vy = 0
    @length = 0
    @isTouched = false
    @isTouched = false
    @moveCenterTo(HQ_GAME_WIDTH / 2, HQ_GAME_HEIGHT - 100)

  moveCenterTo: (x, y) ->
    @x = x - @width / 2
    @y = y - @height / 2

  hasFlied: ->
    @isTouched

  ontouchstart: (e) ->
    @touchstartX = e.x
    @touchstartY = e.y

  ontouchend: (e) ->
    if ! @hasFlied()
      @isTouched = true
      @touchendX = e.x
      @touchendY = e.y

      dx = @touchendX - @touchstartX
      dy = @touchendY - @touchstartY

      @vx = dx / 10
      @vy = dy / 10

  onenterframe: ->
    dx = @x + @vx
    dy = @y + @vy

    if @isTouched
      @vy += 1
      if @vy < 0
        @length -= @vy
      else if @vy > 0
        @length += @vy
      @scaleX = 1 - @length * 0.0005
      @scaleY = 1 - @length * 0.0005

    if 0 < dx and dx < HQ_GAME_WIDTH and dy < HQ_GAME_HEIGHT
      @x += @vx
      @y += @vy
    else if !@isTrashed
      @dispatchEvent new Event("out")

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.gameScene = new GameScene()
    core.replaceScene(core.gameScene)

class Hoge extends Sprite
  constructor: ->
    super(150, 150)
    @moveTo(550, 100)

class Sign extends Sprite
  constructor: ->
    super(125, 71)
    @image = core.assets["left.png"]
    @moveTo(1050, 100)

class GameScene extends Scene
  constructor: ->
    super()
    @length = 0
    @v = 0

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @hoge = new Hoge()
    @addChild(@hoge)

    @addTrash()

    @isLabel = false

    @label       = new Label(@v.toString())
    @label.font  = "60px Serif"
    @label.color = "black"
    @label.x     = 1050
    @label.y     = 10
    @addChild(@label)

    @sign = new Sign()
    @addChild(@sign)

  addTrash: ->
    @flying = new Flying()
    @flying
    @addChild(@flying)
    @flying.addEventListener "out", =>
      core.gameOverScene = new GameOverScene(@length)
      core.replaceScene(core.gameOverScene)

  onenterframe: ->
    @v = Math.sin(core.frame / 100) * 3
    @label.text = @v.toFixed(2)

    if 0 < @v
      @sign.image = core.assets["right.png"]
    else
      @sign.image = core.assets["left.png"]

    if @flying.hasFlied()
      @flying.x += @v

    if 0 < @flying.vy and @flying.intersect(@hoge)
      @flying.opacity = 0
      @flying.isTrashed = true
      if !@isLabel
        @scoreLabel = new Label("シューーーート!!!")
        @scoreLabel.width = 900
        @scoreLabel.textAlign = "center"
        @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 300)
        @scoreLabel.font = "100px Sans-serif"
        @scoreLabel.color = "red"
        @isLabel = true
      @addChild(@scoreLabel)
      @tl.delay(60).then =>
        @removeChild(@scoreLabel)
        delete @scoreLabel
        @isLabel = false
        @length++
        @removeChild(@flying)
        delete @flying
        @addTrash()


class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toString())
    @label.font  = "60px Serif"
    @label.color = "black"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2 + 150
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2 + 30
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("trash.png")
  assets.push("right.png")
  assets.push("left.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
