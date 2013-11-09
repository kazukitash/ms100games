enchant();

core = {}

class couple extends Sprite
  constructor: (option) ->
    super(360, 450)
    @image = core.assets["couple.png"]
    @frame = option

    @hp = 0
    if option is 0 or option is 1
      @hp = 1

    @isDamaged = false


  ontouchstart: ->
    if !@isDamaged
      @frame += 16
      @isDamaged = true
      @hp--

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

    @score = 0

  ontouchstart: ->
    core.gameScene = new GameScene(@score)
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: (score) ->
    super()

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @score = score

    @scoreLabel = new Label(@score)
    @scoreLabel.width = 150
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo(15, 70)
    @scoreLabel.font = "48px Sans-serif"
    @scoreLabel.color = "black"
    @addChild(@scoreLabel)

    @targetFrame = Math.floor(Math.random() * 2)
    @frameSet = [@targetFrame]
    @frameSet.push Math.floor(Math.random() * 14 + 2) for i in [0..1]

    @couple1 = new couple(@frameSet[Math.floor(Math.random() * 3)])
    @couple1.moveTo 260, 180
    @addChild @couple1

    @couple2 = new couple(@frameSet[Math.floor(Math.random() * 3)])
    @couple2.moveTo 670, 180
    @addChild @couple2

  onenterframe: ->
    if @age == 60
      if @couple1.hp is 0 and @couple2.hp is 0
        @scoreLabel = new Label("正解")
        @scoreLabel.width = 900
        @scoreLabel.textAlign = "center"
        @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 300)
        @scoreLabel.font = "128px Sans-serif"
        @scoreLabel.color = "red"
        @addChild(@scoreLabel)
        @tl.delay(60).then ->
          @score++
          core.gameScene = new GameScene(@score)
          core.replaceScene(core.gameScene)
      else
        @scoreLabel = new Label("残念")
        @scoreLabel.width = 900
        @scoreLabel.textAlign = "center"
        @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 300)
        @scoreLabel.font = "128px Sans-serif"
        @scoreLabel.color = "blue"
        @addChild(@scoreLabel)
        @tl.delay(60).then ->
          core.gameOverScene = new GameOverScene(@score)
          core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @scoreLabel = new Label(score.toString())
    @scoreLabel.width = 900
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 300)
    @scoreLabel.font = "128px Sans-serif"
    @scoreLabel.color = "red"
    @addChild(@scoreLabel)

  ontouchstart: ->
    core.titleScene = new TitleScene()
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("couple.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
