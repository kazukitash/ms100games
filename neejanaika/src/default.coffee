enchant()

core = {}

coasterOptions = [
  {image: "coaster2.png", iniSpd: 15, iniPosX: 182}
  {image: "coaster1.png", iniSpd: 25, iniPosX: 530}
  {image: "coaster3.png", iniSpd: 35, iniPosX: 878}
]

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

coordinates = ->
  @cx = ->
    @x + @width / 2
  @cy = ->
    @y + @height / 2

class Warning extends Sprite
  constructor: ->
    super(108, 94)
    @image = core.assets["warning.png"]
    coordinates()

class Player extends Sprite
  constructor: ->
    super(107, 128)
    @image = core.assets["chara.png"]
    @moveTo (HQ_GAME_WIDTH - this.width) / 2, 420

    @line = 1
    @isOnTheCoaster = true
    @speed = 0
    @jumpAt = Infinity
    coordinates()

  onenterframe: ->
    @moveBy 0, @speed
    if @y > HQ_GAME_HEIGHT or @y < 0
      core.gameOverScene = new GameOverScene(@scene.score);
      core.replaceScene(core.gameOverScene);

class Coaster extends Sprite
  constructor: (options) ->
    super(217, 860)
    @image = core.assets[options.image]
    @iniPosY = -860
    @iniPosX = options.iniPosX
    @moveTo(@iniPosX, @iniPosY)
    @speed = options.iniSpd
    @vy = 0
    @startAt = Infinity
    @line = 0
    @time = 119
    coordinates()

  onenterframe: ->
    if core.frame - @startAt == @time
      if @iniPosY < 0
        @tl.moveTo(@iniPosX, 720, 790 / @speed)
        if @scene.player.isOnTheCoaster and @scene.player.line == @line
          @scene.player.speed = @speed
      if @iniPosY > 0
        @tl.moveTo(@iniPosX, -860, 790 / @speed)
        if @scene.player.isOnTheCoaster and @scene.player.line == @line
          @scene.player.speed = -@speed
    if @age % 120 == 0
      @speed += 3
      if @time > 95
        @time--

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
    @bg = new Sprite(HQ_GAME_WIDTH, 2 * HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @moveTo 0, -2 * HQ_GAME_HEIGHT
    @bg.addEventListener "enterframe", ->
      @y += 14
      if @y >= 0
        @y = -HQ_GAME_HEIGHT

    @currentLine = 1

    @coasters = []
    for i in [0..2] by 1
      coaster = new Coaster(coasterOptions[i])
      coaster.line = i
      @addChild coaster
      @coasters.push coaster
      if i == 1
        coaster.y = 0
        coaster.startAt = core.frame

    @player = new Player()
    @addChild @player

    @score = 0;
    @scoreLabel = new Label(this.score.toString());
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo(0, 20)
    @scoreLabel.font = "64px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild(@scoreLabel);

  onenterframe: ->
    @player.isOnTheCoaster = false
    for i in [0..2] by 1
      coaster = @coasters[i]
      if coaster.intersect(@player)
        @player.isOnTheCoaster = true
        @score++
        @scoreLabel.text = @score.toString()

    if core.frame - @player.jumpAt == 30
      if !@player.isOnTheCoaster
        @player.tl.rotateTo(720, 30).and().scaleTo(0.1, 0.1, 30)
        @player.tl.then =>
          core.gameOverScene = new GameOverScene(@score)
          core.replaceScene(core.gameOverScene)

    if @age % 90 == 0
      switch @currentLine
        when 0
          @currentLine = 1
        when 1
          nextLine = Math.random() * 2 - 1
          if nextLine < 0
            @currentLine = 0
          else
            @currentLine = 2
        when 2
          @currentLine = 1
      coaster = @coasters[@currentLine]
      coaster.startAt = core.frame
      startPos = Math.random() * 2 - 1
      if startPos < 0
        coaster.iniPosY = -860
      else
        coaster.iniPosY = 720
      coaster.moveTo(coaster.iniPosX, coaster.iniPosY)
      coaster.tl.moveTo(coaster.iniPosX, -70, 790 / coaster.speed)

  ontouchstart: (e) ->
    @player.speed = 0
    @player.jumpAt = core.frame
    switch @player.line
      when 0
        if e.x > 460
          @player.line = 1
          @player.tl.scaleTo(1.3,1.3,15).and().moveBy(175, 0, 15)
          @player.tl.scaleTo(1,1,15).and().moveBy(175, 0, 15)
      when 1
        if e.x > 815
          @player.line = 2
          @player.tl.scaleTo(1.3,1.3,15).and().moveBy(175, 0, 15)
          @player.tl.scaleTo(1,1,15).and().moveBy(175, 0, 15)
        else if e.x < 460
          @player.line = 0
          @player.tl.scaleTo(1.3,1.3,15).and().moveBy(-175, 0, 15)
          @player.tl.scaleTo(1,1,15).and().moveBy(-175, 0, 15)
      when 2
        if e.x < 815
          @player.line = 1
          @player.tl.scaleTo(1.3,1.3,15).and().moveBy(-175, 0, 15)
          @player.tl.scaleTo(1,1,15).and().moveBy(-175, 0, 15)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score
    @scoreLabel = new Label(@score.toString() + "点")
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo((HQ_GAME_WIDTH-@scoreLabel.width)/2, 300)
    @scoreLabel.font = "64px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild(@scoreLabel)

  ontouchstart: ->
    core.titleScene = new TitleScene()
    core.replaceScene(core.titleScene)

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("coaster1.png")
  assets.push("coaster2.png")
  assets.push("coaster3.png")
  assets.push("chara.png")
  assets.push("warning.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
