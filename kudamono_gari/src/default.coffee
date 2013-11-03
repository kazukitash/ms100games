enchant();

core = {}

Images = {
  fruit: {
    width: 100
    height: 100
  }
}

class Fruit extends Sprite
  Options: [
    {x: -Images.fruit.width, y: 130, vx: 18, vy: 0, endX: -Images.fruit.width, endY: 200}
    {x: 300, y: -Images.fruit.height, vx: 8, vy: 5, endX: -Images.fruit.width, endY: 100}
    {x: HQ_GAME_WIDTH - 300 - Images.fruit.width, y: -Images.fruit.height, vx: -8, vy: 5, endX: HQ_GAME_WIDTH, endY: 100}
    {x: HQ_GAME_WIDTH, y: 130, vx: -18, vy: 0, endX: HQ_GAME_WIDTH, endY: 200}
  ]

  Images: [
    {path: "fruit1.png", decayed: true}
    {path: "fruit2.png", decayed: true}
    {path: "fruit3.png", decayed: false}
    {path: "fruit4.png", decayed: false}
  ]

  constructor: (image) ->
    super(Images.fruit.width, Images.fruit.height)
    image = @Images[Math.floor(Math.random() * 4)]
    @decayed = image.decayed
    @image = core.assets[image.path]
    @options = @Options[Math.floor(Math.random() * 4)]
    @moveTo @options.x, @options.y
    @vy = @options.vy
    @vx = @options.vx
    @level = Math.floor(core.gameScene.age / 180) / 10 + 1
    if @level > 3
      @level = 3
    @vx *= @level
    @vy *= @level
    @startX = 0
    @startY = 0

  onenterframe: ->
    @vy += @level
    @moveBy @vx, @vy

  ontouchstart: ->
    @tl.moveTo(@options.endX, @options.endY, 10).then =>
      ev = new Event "Remove"
      @dispatchEvent ev


class Cage extends Sprite
  constructor: ->
    super(560, 170)
    @moveTo 365, 550

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
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @cage = new Cage()
    @addChild @cage

    @fruits = []

    @score = 0
    @scoreLabel = new Label @score.toString()
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo 0, 20
    @scoreLabel.font = "64px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild @scoreLabel

  onenterframe: ->
    if core.frame % 90 == 0
      @drop()

    fruitsLength = @fruits.length
    while fruitsLength
      fruit = @fruits[--fruitsLength]
      if @cage.intersect fruit
        if fruit.decayed
          core.gameOverScene = new GameOverScene @score
          core.replaceScene core.gameOverScene
        else
          @score++
          @scoreLabel.text = @score.toString()
          @fruits.splice fruitsLength, 1
          @removeChild fruit

  drop: ->
    fruit = new Fruit()
    @addChild fruit
    @fruits.push fruit
    fruit.addEventListener "Remove", =>
      @removeChild fruit


class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score
    @scoreLabel = new Label(@score.toString() + "個")
    @scoreLabel.width = 600
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo (HQ_GAME_WIDTH-@scoreLabel.width)/2, 300
    @scoreLabel.font = "128px Sans-serif"
    @scoreLabel.color = "rgb(244, 244, 244)"
    @addChild @scoreLabel

  ontouchstart: ->
    core.titleScene = new TitleScene()
    core.replaceScene(core.titleScene)

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("fruit1.png")
  assets.push("fruit2.png")
  assets.push("fruit3.png")
  assets.push("fruit4.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
