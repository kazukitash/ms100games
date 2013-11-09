enchant();

core = {}

class Player extends Sprite
  constructor: ->
    super(89, 114)
    @image = core.assets["player.png"]
    @moveTo 20, 530
    @vx = 3
    @vy = 0
    @isCharging = true
    @isJumped = false
    @isJumping = false

  charge: ->
    if @isCharging
      @x += 3 * Math.sin(2.0 * core.frame)
      @vx++

  onenterframe: ->
    if @age == 120
      @isCharging = false
    if @age > 150
      @moveBy @vx, @vy

    if @isJumping
      @vy += 2.3
      if @y >= 530
        @vy = 0
        @isJumping = false

    if @x > HQ_GAME_WIDTH
      core.gameOverScene = new GameOverScene(1)
      core.replaceScene core.gameOverScene

class Dai extends Sprite
  constructor: ->
    super(97,200)
    @moveTo 1022, 472

class TobiBan extends Sprite
  constructor: ->
    super(140,20)
    @moveTo 750, 600

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

    @titleLabel = new Label("LEVEL1");
    @titleLabel.width = 600;
    @titleLabel.textAlign = "center";
    @titleLabel.moveTo(750, 30);
    @titleLabel.font = "96px Sans-serif";
    @titleLabel.color = "rgb(244, 244, 244)";
    @addChild(@titleLabel);

  ontouchstart: ->
    core.gameScene = new GameScene()
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: ->
    super()
    @length = 0

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @player = new Player()
    @addChild @player

    @dai = new Dai()
    @addChild @dai

    @tobiBan = new TobiBan()
    @addChild @tobiBan

  onenterframe: ->
    if @dai.intersect @player
      core.gameOverScene = new GameOverScene(0)
      core.replaceScene core.gameOverScene

    if @tobiBan.intersect @player
      if @player.isJumping
        @player.vy = -40
      else
        core.gameOverScene = new GameOverScene(0)
        core.replaceScene core.gameOverScene

  ontouchstart: ->
    if @player.isCharging
      @player.charge()
    if !@player.isCharging and !@player.isJumped
      @player.isJumped = true
      @player.vy = -20
      @player.isJumping = true

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    if score == 0
      @bg.image = core.assets["game_over1.png"]
    else if score == 1
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
  assets.push("player.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
