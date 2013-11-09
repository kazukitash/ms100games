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

class Runner extends Sprite
  constructor: ->
    super(300, 300)
    @image = core.assets[""]

class Hand extends Sprite
  rumble: ->
    @x = @baseX + 10 * Math.random() - 5
    @y = @baseY + 10 * Math.random() - 5

class RightHand extends Hand
  constructor: ->
    super(811, 475)
    @image = core.assets["right-hand.png"]
    @baseX = 500
    @baseY = 200
    @moveTo(@baseX, @baseY)

class LeftHand extends Hand
  constructor: ->
    super(810, 474)
    @image = core.assets["left-hand.png"]
    @baseX = 0
    @baseY = 200
    @moveTo(@baseX, @baseY)

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
    @length = 0

    @timer = new CountDownTimer(10)
    @timer.start()
    @timer.font = "80px Serif"
    @timer.color = "black"
    @timer.moveTo(50, 50)
    @addChild(@timer)

    @right = new RightHand()
    @addChild(@right)

    @left = new LeftHand()
    @addChild(@left)

    @timer.addEventListener "over", ->
      core.gameOverScene = new BadGameOverScene()
      core.replaceScene(core.gameOverScene)

  ontouchstart: ->
    @length++
    @right.rumble()
    @left.rumble()

    if @length > 50
      core.gameOverScene = new GameOverScene(@timer.remainingSec())
      core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over2.png"]
    @addChild(@bg)
    @startAt = core.frame

  ontouchstart: ->
    if @startAt + core.fps * 2 < core.frame
      core.replaceScene core.titleScene

class BadGameOverScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over1.png"]
    @addChild(@bg)
    @startAt = core.frame

  ontouchstart: ->
    if @startAt + core.fps * 2 < core.frame
      core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over1.png")
  assets.push("game_over2.png")
  assets.push("right-hand.png")
  assets.push("left-hand.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
