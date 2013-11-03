enchant();

core = {}

class Fan extends Sprite
  constructor: ->
    super(601, 601)
    @image = core.assets["target.png"]
    @rot = 10 * Math.floor(Math.random() * 3 + 1)
    @moveTo 155, 165

  onenterframe: ->
    @rotate @rot

class Hand extends Sprite
  constructor: ->
    super 562, 481
    @image = core.assets["hand.png"]
    @moveTo 720, 190

class Cover extends Sprite
  constructor: ->
    super(682, 604)
    @image = core.assets["cover.png"]
    @moveTo 115, 120

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)
    @score = 0

  ontouchstart: ->
    core.howToScene = new HowToScene(@score)
    core.pushScene(core.howToScene)

class HowToScene extends Scene
  constructor: (score) ->
    super()

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["how.png"]
    @addChild(@bg)

    @score = score

  ontouchstart: ->
    core.popScene()
    core.gameScene = new GameScene(@score)
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @fan = new Fan()
    @addChild @fan

    @cover = new Cover()
    @addChild @cover

    @hand = new Hand()
    @addChild @hand

    @score = score
    @scoreLabel = new Label @score.toString() + "台"
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo 980, 30
    @scoreLabel.font = "64px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild @scoreLabel


  stopFan: ->
    @fan.rot = 0
    rot = Math.floor((@fan.rotation + 30) / 60)
    @hand.tl.moveTo(450, 65, 10).delay(10).then =>
      if rot % 2 == 0
        @score++
        core.gameScene = new GameScene(@score)
        core.replaceScene core.gameScene
      else
        core.gameOverScene = new GameOverScene(@score)
        core.replaceScene core.gameOverScene


  ontouchstart: (e) ->
    @stopFan()


class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score
    @scoreLabel = new Label(@score.toString() + "台")
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo 980, 30
    @scoreLabel.font = "64px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild @scoreLabel

  ontouchstart: ->
    core.titleScene = new TitleScene()
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("target.png")
  assets.push("hand.png")
  assets.push("cover.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
