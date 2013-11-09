enchant();

core = {}

class Curtain extends Sprite
  constructor: ->
    super(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @backgroundColor = "red"
    @opacity = 0.3

class Offence extends Sprite
  constructor: (action) ->
    super 361, 70
    @moveTo 200, 600
    @image = core.assets["btn1.png"]
    @isAct = false
    if action is 1
      @isAct = true

  ontouchstart: ->
    ev = new Event "offence"
    @dispatchEvent ev

class Defence extends Sprite
  constructor: (action) ->
    super 361, 70
    @moveTo 1280-200-361, 600
    @image = core.assets["btn2.png"]
    @isAct = false
    if action is 0
      @isAct = true

  ontouchstart: ->
    ev = new Event "defence"
    @dispatchEvent ev

class Bokko extends Sprite
  constructor: ->
    super(98, 74)
    @moveTo 950, 250
    @image = core.assets["bokko.png"]

class Iine extends Sprite
  constructor: ->
    super(98, 96)
    @moveTo 950, 250
    @image = core.assets["iine.png"]

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

    @round = 0

  ontouchstart: ->
    core.gameScene = new GameScene(@round)
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: (round) ->
    super()
    @length = 0

    @round = round + 1

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @delay = Math.floor(Math.sqrt(1/Math.sqrt(@round^2+3))*core.fps)
    @limit = Math.floor((8*(1-Math.sqrt(1/Math.sqrt((@round/4)^2+3)))*Math.random()+2)*core.fps)

    @lose = false
    @win = false

    @bokko = new Bokko()
    @iine = new Iine()
    @actions = [@bokko, @iine]
    @action = Math.floor(Math.random() * 2)

    @offence = new Offence(@action)
    @addChild @offence
    @offence.addEventListener "offence", =>
      if @isStart and @action is 1
        @win = true
        @bg.image = core.assets["game2.png"]
        @tl.delay(45).then =>
          core.gameScene = new GameScene(@round)
          core.replaceScene core.gameScene
      else
        @lose = true
        curtain = new Curtain()
        @addChild curtain
        @tl.delay(45).then =>
          core.gameOverScene = new GameOverScene(@round)
          core.replaceScene core.gameOverScene
    @defence = new Defence(@action)
    @addChild @defence
    @defence.addEventListener "defence", =>
      if @isStart and @action is 0
        @win = true
        @bg.image = core.assets["game1.png"]
        @tl.delay(45).then =>
          core.gameScene = new GameScene(@round)
          core.replaceScene core.gameScene
      else
        @lose = true
        curtain = new Curtain()
        @addChild curtain
        @tl.delay(45).then =>
          core.gameOverScene = new GameOverScene(@round)
          core.replaceScene core.gameOverScene

    @roundLabel = new Label @round.toString()
    @roundLabel.width = 300
    @roundLabel.textAlign = "center"
    @roundLabel.moveTo(0, 55)
    @roundLabel.font = "96px Sans-serif"
    @roundLabel.color = "rgb(45, 63, 119)"
    @addChild @roundLabel

  onenterframe: ->
    if @age is @limit and !@lose
      @isStart = true
      @addChild @actions[@action]
    if @age is @limit + @delay and !@lose and !@win
      curtain = new Curtain()
      @addChild curtain
      @tl.delay(45).then =>
        core.gameOverScene = new GameOverScene(@round)
        core.replaceScene core.gameOverScene

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toString())
    @label.width = 300
    @label.textAlign = "center"
    @label.moveTo((HQ_GAME_WIDTH - @label.width) / 2 + 25, 325)
    @label.font = "64px Sans-serif"
    @label.color = "rgb(45, 63, 119)"
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game1.png")
  assets.push("game2.png")
  assets.push("game_over.png")
  assets.push("iine.png")
  assets.push("bokko.png")
  assets.push("btn1.png")
  assets.push("btn2.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
