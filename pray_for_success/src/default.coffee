enchant();

core = {}

Money = [
  ["10.png", 10],
  ["100.png", 100],
  ["500.png", 500]
]

class Flying extends Sprite
  constructor: (money) ->
    super(173, 173)
    @image = core.assets[money[0]]
    @vx = 0
    @vy = 0
    @length = 0
    @isTouched = false
    @isTouched = false
    @moveCenterTo(HQ_GAME_WIDTH / 2, HQ_GAME_HEIGHT - 100)
    @score = money[1]

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
    super(210, 80)
    @moveTo(535, 100)

class Sign extends Sprite
  constructor: ->
    super(125, 71)
    @image = core.assets["left.png"]
    @moveTo(1100, 150)

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

    @label       = new Label(@v.toString())
    @label.font  = "48px Serif"
    @label.color = "black"
    @label.x     = 1100
    @label.y     = 60
    @addChild(@label)

    @count = 10
    @countLabel = new Label @count.toString()
    @countLabel.width = 220
    @countLabel.textAlign = "center"
    @countLabel.moveTo(0, 58)
    @countLabel.font = "48px Serif"
    @countLabel.color = "rgb(24, 24, 24)"
    @addChild(@countLabel)

    @lengthLabel = new Label @length.toString()
    @lengthLabel.width = 220
    @lengthLabel.textAlign = "center"
    @lengthLabel.moveTo(0, 195)
    @lengthLabel.font = "48px Serif"
    @lengthLabel.color = "rgb(24, 24, 24)"
    @addChild(@lengthLabel)

    @sign = new Sign()
    @addChild(@sign)

  addTrash: ->
    @flying = new Flying(Money[Math.floor(Math.random() * 3)])
    @flying
    @addChild(@flying)
    @flying.addEventListener "out", =>
      core.gameOverScene = new GameOverScene(0)
      core.replaceScene(core.gameOverScene)

  onenterframe: ->
    if @count is 0
      if @length > 2000
        core.gameOverScene = new GameOverScene(1)
        core.replaceScene(core.gameOverScene)
      else
        core.gameOverScene = new GameOverScene(0)
        core.replaceScene(core.gameOverScene)

    @v = Math.sin(core.frame / 100) * 3
    @label.text = @v.toFixed(2)

    if 0 < @v
      @sign.image = core.assets["right.png"]
    else
      @sign.image = core.assets["left.png"]

    if @flying.hasFlied()
      @flying.x += @v

    if 0 < @flying.vy and @flying.intersect(@hoge)
      @length += @flying.score
      @lengthLabel.text = @length.toString()
      @removeChild(@flying)
      delete @flying
      @count--
      @countLabel.text =  @count.toString()
      @addTrash()

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    if score is 0
      @bg.image = core.assets["game_over1.png"]
    else
      @bg.image = core.assets["game_over2.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over1.png")
  assets.push("game_over2.png")
  assets.push("100.png")
  assets.push("10.png")
  assets.push("500.png")
  assets.push("right.png")
  assets.push("left.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
