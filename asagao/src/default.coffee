enchant();

core = {}

FlowerOpt = [
  {x: 61, y: -20, image: "flower1.png"},
  {x: 538, y: 6-42, image: "flower2.png"},
  {x: 968, y: 39-42, image: "flower3.png"},
  {x: 109, y: 373-42, image: "flower4.png"},
  {x: 578, y: 272-42, image: "flower5.png"},
  {x: 895, y: 387-42, image: "flower6.png"}
]

class Flower extends Sprite
  constructor: (options) ->
    super(220, 250)
    @image = core.assets[options.image]
    @moveTo options.x, options.y
    @frame = 0
    @power = 0
    @isBloomed = false

  onenterframe: ->
    unless @power is 0
      @power--

    if @power > 300
      @isBloomed = true
      @frame = 2
    else if @power > 100
      @isBloomed = false
      @frame = 1
    else
      @frame = 0

  ontouchmove: ->
    if @power <= 600
      @power += 7


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

    _this = this;
    @v = - 0.5;

    @bloom = 0

    @bg = new Sprite(HQ_GAME_WIDTH, 2 * HQ_GAME_HEIGHT)
    @bg.image = core.assets["bg.png"]
    @addChild(@bg)
    @moveTo(0, 0)
    @bg.addEventListener "enterframe", ->
      @y += _this.v
      if @y <= - HQ_GAME_HEIGHT
        if _this.bloom >= 6
          core.gameOverScene = new GameOverScene(0)
          core.replaceScene(core.gameOverScene)
        else
          core.gameOverScene = new GameOverScene(1)
          core.replaceScene(core.gameOverScene)

    @front = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @front.image = core.assets["game.png"]
    @addChild(@front)

    @flowers = []

    for i in [0..5]
      flower = new Flower(FlowerOpt[i])
      @addChild flower
      @flowers.push flower

  onenterframe: ->
    console.log @bloom
    @bloom = 0
    for i in [0..5]
      if @flowers[i].isBloomed
        @bloom++

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    if score is 0
      @scoreLabel = new Label("成功")
      @scoreLabel.width = 900
      @scoreLabel.textAlign = "center"
      @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 530)
      @scoreLabel.font = "128px Sans-serif"
      @scoreLabel.color = "red"
      @addChild(@scoreLabel)
    else
      @scoreLabel = new Label("残念")
      @scoreLabel.width = 900
      @scoreLabel.textAlign = "center"
      @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 530)
      @scoreLabel.font = "128px Sans-serif"
      @scoreLabel.color = "blue"
      @addChild(@scoreLabel)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("bg.png")
  assets.push("flower1.png")
  assets.push("flower2.png")
  assets.push("flower3.png")
  assets.push("flower4.png")
  assets.push("flower5.png")
  assets.push("flower6.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
