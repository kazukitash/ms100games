enchant();

core = {}

WindowPos = [
  { x:154, y:61 },
  { x:234, y:61 },
  { x:314, y:61 },
  { x:394, y:61 },
  { x:154, y:249 },
  { x:234, y:249 },
  { x:314, y:249 },
  { x:394, y:249 },
  { x:154, y:431 },
  { x:234, y:431 },
  { x:314, y:431 },
  { x:394, y:431 },
  { x:847, y:61 },
  { x:927, y:61 },
  { x:1007, y:61 },
  { x:1087, y:61 },
  { x:847, y:249 },
  { x:927, y:249 },
  { x:1007, y:249 },
  { x:1087, y:249 },
  { x:847, y:431 },
  { x:927, y:431 },
  { x:1007, y:431 },
  { x:1087, y:431 }
]

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
      core.gameOverScene = new GameOverScene(@scene.score)
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

class BrokenWindow extends Sprite
  constructor: ->
    super 74, 116
    @image = core.assets["break.png"]
    @frame = 0
    @broken = false
    windowPos = WindowPos[Math.floor(Math.random() * 24)]
    @moveTo HQ_GAME_WIDTH + windowPos.x, windowPos.y

  onenterframe: ->
    @moveBy -@scene.vx, 0

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
    @windows = []

    @score = 0
    @scoreLabel = new Label(@score.toString() + "枚")
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo(0, 20)
    @scoreLabel.font = "64px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild(@scoreLabel)

    @moveTo 0, 0
    _this = this
    @bg.addEventListener "enterframe", ->
      @x -= _this.vx
      if @x <= -HQ_GAME_WIDTH
        brokenWindow = new BrokenWindow()
        _this.windows.push brokenWindow
        _this.addChild brokenWindow

        @x = 0

    @player = new Player()
    @addChild @player

  onenterframe: ->
    windowLength = @windows.length
    while windowLength
      wdw = @windows[--windowLength]
      if wdw.intersect(@player) and !wdw.broken
        wdw.frame = 1
        wdw.broken = true
        @score++
        @scoreLabel.text = @score.toString() + "枚"
      if wdw.x < -wdw.width
        @removeChild wdw
        @windows.splice(windowLength, 1);

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
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score
    @scoreLabel = new Label(@score.toString() + "枚")
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
  assets.push("score.png")
  assets.push("break.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
