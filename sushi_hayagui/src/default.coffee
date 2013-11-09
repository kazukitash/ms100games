enchant();

core = {}

class CountDownTimer extends Label
  constructor: (sec) ->
    super()
    @frame = sec * core.fps
    @startAt = Infinity

  start: ->
    @startAt = core.frame

  isStarted: ->
    @startAt < core.frame

  remainingFrame: ->
    @frame - core.frame + @startAt

  remainingSec: ->
    @remainingFrame() / core.fps

  onenterframe: ->
    @text = @remainingSec().toFixed(2)

    if @remainingFrame() == 0
      e = new Event "over"
      @dispatchEvent(e)

class Sushi extends Sprite
  constructor: (option) ->
    super(440,254)
    @image = core.assets[option[0]]
    @hp = option[2]
    @currentHp = @hp
    @moveTo -580, 320
    @v = 25

  onenterframe: ->
    @moveBy(@v,0)

  ontouchstart: ->
    if @currentHp == 0
      ev = new Event("ate")
      @dispatchEvent ev
    @currentHp--
    @opacity -= 1 / (@hp + 1)

class Sara extends Sprite
  constructor: (option) ->
    super(636,214)
    @image = core.assets[option[1]]
    @moveTo -700, 430
    @v = 25

  onenterframe: ->
    @moveBy(@v,0)

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
    @length = 0

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @timer = new CountDownTimer(30);
    @timer.start()
    @timer.width = 100
    @timer.textAlign = "center"
    @timer.font = "48px Serif"
    @timer.color = "rgb(25,25,25)"
    @timer.moveTo(60, 100)
    @addChild(@timer)

    @timer.addEventListener "over", =>
      core.GameOverScene = new GameOverScene(@timer.remainingFrame())
      core.replaceScene(core.GameOverScene)

    @score = 0
    @scoreLabel = new Label @score.toString()
    @scoreLabel.width = 200
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo 1080, 35
    @scoreLabel.font = "48px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild @scoreLabel

  onenterframe: ->
    if core.frame % 30 == 0
      sara = new Sara(SushiList[Math.floor(Math.random() * 3)])
      @addChild sara
      sushi = new Sushi(SushiList[Math.floor(Math.random() * 3)])
      @addChild sushi
      sushi.addEventListener "ate", =>
        @score++
        @scoreLabel.text = @score.toString()
        @removeChild sushi

  SushiList = [
    ["maguro.png", "maguro-sara.png", 4, 10, 4]
    ["ebi.png", "ebi-sara.png", 2, 7, 2]
    ["tamago.png", "tamago-sara.png", 7, 20, 6]
  ]


class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toString())
    @label.width = 600
    @label.textAlign = "center"
    @label.moveTo((HQ_GAME_WIDTH-@label.width)/2, 300)
    @label.font = "128px Sans-serif"
    @label.color = "rgb(35,35,35)"
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("maguro.png")
  assets.push("maguro-sara.png")
  assets.push("tamago.png")
  assets.push("tamago-sara.png")
  assets.push("ebi.png")
  assets.push("ebi-sara.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
