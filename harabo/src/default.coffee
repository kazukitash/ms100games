enchant();

core = {}

class CountUpTimer extends Label
  constructor: ->
    super "0.00"
    @startAt = Infinity

  start: ->
    @startAt = core.frame

  currentFrame: ->
    core.frame - @startAt

  currentSec: ->
    @currentFrame() / core.fps

  onenterframe: ->
    @text = @currentSec().toFixed(2)

class Traveler extends Sprite
  constructor: ->
    super(175, 25)
    @image = core.assets["iraira.png"]
    @frame = 0
    @moveTo Math.random() * HQ_GAME_WIDTH, Math.random() * HQ_GAME_HEIGHT

    @life = 300
    if core.gameScene.age > 200
      @life += Math.floor(core.gameScene / 200) * 10
    @isDead = false

    @vx = 3
    @vy = 5

  onenterframe: ->
    if @life < 0
      @isDead = true
    @life--
    if @x < 0 or @x > HQ_GAME_WIDTH - @width
      @vx = -@vx
      @scaleX = -1
    if @y < 0 or @y > HQ_GAME_HEIGHT - @height
      @vy = -@vy
    @moveBy @vx, @vy

class Travelers extends Group
  constructor: (player) ->
    super()
    @player = player
    @travelers = []

  onenterframe: ->
    travelersLength = @travelers.length
    while travelersLength
      traveler = @travelers[--travelersLength]
      if @player.intersect traveler
        core.gameOverScene = new GameOverScene(@scene.timer.currentSec())
        core.replaceScene core.gameOverScene
      if traveler.isDead
        @removeChild traveler
        @travelers.splice travelersLength, 1

    if core.frame % 90 == 0
      traveler = new Traveler()
      @addChild traveler
      @travelers.push traveler

class player extends Sprite
  constructor: ->
    super(43, 43)
    @image = core.assets["stick.png"]
    @moveTo HQ_GAME_WIDTH / 2, HQ_GAME_HEIGHT / 2

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
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @player = new player()
    @addChild @player

    travelers = new Travelers(@player)
    @addChild travelers

    @timer = new CountUpTimer()
    @timer.width = 180
    @timer.textAlign = "center"
    @timer.moveTo 30, 75
    @timer.font = "48px Sans-serif"
    @timer.color = "rgb(230, 230, 230)"

    @timer.start()
    @addChild @timer

  ontouchstart: (e) ->
    @player.moveTo e.x - @player.width / 2, e.y - @player.height / 2

  ontouchmove: (e) ->
    @player.moveTo e.x - @player.width / 2, e.y - @player.height / 2

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score.toFixed(2)
    @scoreLabel = new Label(@score.toString())
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo((HQ_GAME_WIDTH-@scoreLabel.width)/2, 150)
    @scoreLabel.font = "100px Sans-serif"
    @scoreLabel.color = "rgb(230,230,230)"
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
  assets.push("stick.png")
  assets.push("iraira.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
