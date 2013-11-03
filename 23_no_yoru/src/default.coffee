enchant();

core = {}

class CountUpTimer extends Label
  constructor: ->
    super()

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
    core.frame - @startAt


  remainingSec: ->
    @remainingFrame() / core.fps


  penalty: (penalty) ->
    @startAt -= penalty * core.fps


  onenterframe: ->
    if !@isStopped()
      @text = @remainingSec().toFixed(2)

class Player extends Sprite
  constructor: ->
    super 114, 120
    @image = core.assets["player.png"]
    @moveTo 355, 555

    @vy = -12

    @isOnTheGround = true
    @isJumping = false
    @isLanding = false
    @isBack = false

    @addEventListener "Jump", =>
      @jump()
    @addEventListener "Land", =>
      @land()

  onenterframe: ->
    if @x + @width / 2 < 0 or @x + @width / 2 > HQ_GAME_WIDTH or @y + @height / 2 < 0
      core.gameOverScene = new GameOverScene(@scene.timer.remainingSec())
      core.replaceScene core.gameOverScene
    if @isOnTheGround
      @moveBy 5, 0
    else
      if @isBack
        if @isJumping
          @moveBy -4, @vy
          @rotation = -30
        if @isLanding
          if core.frame % 2 == 0 && @vy < 12
            @vy++
          @moveBy -4, @vy
          if @y > 555
            @isLanding = false
            @isOnTheGround = true
            @vy = -12
            @rotation = 0
      else
        if @isJumping
          @moveBy 7, @vy
          @rotation = -30
        if @isLanding
          if core.frame % 2 == 0 && @vy < 12
            @vy++
          @moveBy 7, @vy
          if @y > 555
            @isLanding = false
            @isOnTheGround = true
            @vy = -12
            @rotation = 0

  jump: ->
    @isJumping = true
    @isOnTheGround = false

  land: ->
    @isJumping = false
    @isLanding = true

class Professor extends Sprite
  constructor: ->
    super 55, 116
    @image = core.assets["professor.png"]
    @moveTo 15, 555
    @frame = [0,0,0,0,1,1,1,1]
    @delay = 30

  onenterframe: ->
    if @age - @delay == 0
      @offset = Math.floor(Math.random() * 50 + 20)
      @delay += @offset
      @tl.moveTo(Math.random() * HQ_GAME_WIDTH, 555, @offset)

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.howToScene = new HowToScene()
    core.pushScene(core.howToScene)

class HowToScene extends Scene
  constructor: ->
    super()

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["how.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.popScene()
    core.gameScene = new GameScene()
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: ->
    super()

    @bg = new Sprite(HQ_GAME_WIDTH * 2, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)
    @vx = 14

    @score = 0

    @moveTo 0, 0
    _this = this
    @bg.addEventListener "enterframe", ->
      @x -= _this.vx
      if @x <= -HQ_GAME_WIDTH
        @x = 0

    @player = new Player()
    @addChild @player

    @professor = new Professor()
    @addChild @professor

    @timer = new CountUpTimer()
    @timer.width = 300
    @timer.textAlign = "center"
    @timer.moveTo 0, 20
    @timer.font = "64px Sans-serif"
    @timer.color = "rgb(34, 42, 46)"

    @timer.start()
    @addChild @timer

  onenterframe: ->
    if @professor.intersect @player
      core.gameOverScene = new GameOverScene(@timer.remainingSec())
      core.replaceScene core.gameOverScene
    if core.frame % 120 == 0
      @vx++

  ontouchstart: (e) ->
    if @player.isOnTheGround
      if e.x < @player.x + @player.width / 2
        @player.isBack = true
      else
        @player.isBack = false
      ev = new Event "Jump"
      @player.dispatchEvent ev

  ontouchend: ->
    ev = new Event "Land"
    @player.dispatchEvent ev

class GameOverScene extends Scene
  constructor: (time) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = time
    @scoreLabel = new Label(@score.toFixed(2).toString() + "秒")
    @scoreLabel.width = 600
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo((HQ_GAME_WIDTH-@scoreLabel.width)/2, 300)
    @scoreLabel.font = "128px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild(@scoreLabel)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("player.png")
  assets.push("professor.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
