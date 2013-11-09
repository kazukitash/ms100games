enchant();

core = {}

class Janken extends Sprite
  constructor: ->
    super(575, 108)
    @image = core.assets["janken.png"]

class CP extends Sprite
  constructor: ->
    super(189, 189)
    @image = core.assets["cp.png"]
    @frame = [0,0,0,1,1,1,2,2,2]
    @moveTo 546, 100

class Pon extends Sprite
  constructor: ->
    super(303, 120)
    @image = core.assets["pon.png"]

    @isStarted = false
    @isTouched = false

  ontouchstart: ->
    if @isStarted and !@isTouched
      ev = new Event "select"
      @dispatchEvent ev
      @isTouched = true

class Gu extends Sprite
  constructor: ->
    super(189, 189)
    @image = core.assets["gu.png"]
    @moveTo 142, 363

    @isStarted = false

  ontouchstart: ->
    if @isStarted and !@isTouched
      ev = new Event "select"
      @dispatchEvent ev
      @isTouched = true

class Choki extends Sprite
  constructor: ->
    super(189, 189)
    @image = core.assets["choki.png"]
    @moveTo 546, 456

    @isStarted = false

  ontouchstart: ->
    if @isStarted and !@isTouched
      ev = new Event "select"
      @dispatchEvent ev
      @isTouched = true

class Pa extends Sprite
  constructor: ->
    super(189, 189)
    @image = core.assets["pa.png"]
    @moveTo 950, 343

  ontouchstart: ->
    if @isStarted
      ev = new Event "select"
      @dispatchEvent ev

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

    @janken = new Janken()
    @addChild @janken

    @cp = new CP()
    @addChild @cp

    @isWin = false
    @isAiko = false

    @cpGu = new Gu()

    @cpChoki = new Choki()

    @cpPa = new Pa()

    @cpList = [@cpGu, @cpChoki, @cpPa]

    @cpState = 0

    @gu = new Gu()
    @addChild @gu
    @gu.addEventListener "select", =>
      @removeChild @cp
      @pon = new Pon()
      @addChild @pon
      @cpState = Math.floor(Math.random() * 3)
      @cpList[@cpState].moveTo 546, 100
      @addChild @cpList[@cpState]
      if @cpState is 0
        @isAiko = true
      else if @cpState is 1
        @isWin = true
      @removeChild @choki
      @removeChild @pa
      @result()

    @choki = new Choki()
    @addChild @choki
    @choki.addEventListener "select", =>
      @removeChild @cp
      @pon = new Pon()
      @addChild @pon
      @cpState = Math.floor(Math.random() * 3)
      @cpList[@cpState].moveTo 546, 100
      @addChild @cpList[@cpState]
      if @cpState is 1
        @isAiko = true
      else if @cpState is 2
        @isWin = true
      @removeChild @gu
      @removeChild @pa
      @result()

    @pa = new Pa()
    @addChild @pa
    @pa.addEventListener "select", =>
      @removeChild @cp
      @pon = new Pon()
      @addChild @pon
      @cpState = Math.floor(Math.random() * 3)
      @cpList[@cpState].moveTo 546, 100
      @addChild @cpList[@cpState]
      if @cpState is 2
        @isAiko = true
      else if @cpState is 0
        @isWin = true
      @removeChild @choki
      @removeChild @gu
      @result()

  onenterframe: ->
    if @age > 45
      @removeChild @janken
      @gu.isStarted = true
      @choki.isStarted = true
      @pa.isStarted = true

  result: ->
    if @isAiko
      @tl.delay(30).then ->
        core.gameScene = new GameScene()
        core.replaceScene core.gameScene
    else if @isWin
      @tl.delay(30).then ->
        core.gameOverScene = new GameOverScene(0)
        core.replaceScene core.gameOverScene
    else
      @tl.delay(30).then ->
        core.gameOverScene = new GameOverScene(1)
        core.replaceScene core.gameOverScene

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
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
  assets.push("gu.png")
  assets.push("choki.png")
  assets.push("pa.png")
  assets.push("pon.png")
  assets.push("janken.png")
  assets.push("cp.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
