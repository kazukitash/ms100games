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

class IaiBaseScene extends Scene
  constructor: ->
    super()
    @fightsStartAt = []
    @fightsEndAt   = []

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

  pastFights: ->
    @fightsStartAt.filter (startAt, index, fights) =>
      startAt < core.frame

  nextFight: ->
    startAt = core.frame + 1 + Math.floor(Math.random() * 4)
    endAt   = startAt + 1

    @fightsStartAt.push(startAt)
    @fightsEndAt.push(endAt)

  isFighting: ->
    s = @fightsStartAt[@fightsStartAt.length - 1]
    e = @fightsEndAt[@fightsEndAt.length - 1]

    s < core.frame and core.frame < e

class MySprite extends Sprite
  constructor: ->
    super(300, 300)

  onenterframe: ->

class Teacup extends Sprite
  constructor: ->
    super(636, 332)
    @image = core.assets["tea2.png"]

  onenterframe: ->

class TeaSurface extends Sprite
  constructor: ->
    super(383, 49)
    @image = core.assets["tea4.png"]
    @opacity = 0.2

  onenterframe: ->
    @opacity += 0.001


class Teabag extends Group
  constructor: ->
    super()
    @vy = 0

    @string = new Sprite(86, 349)
    @string.image = core.assets["tea1.png"]

    @bag = new Sprite(166, 145)
    @bag.image = core.assets["tea3.png"]
    @bag.moveTo(-60, 320)

    @addChild(@string)
    @addChild(@bag)

  startMove: ->
    @vy = - 9

  onenterframe: ->
    @y += @vy

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

class GameScene extends IaiBaseScene
  constructor: ->
    super()
    @startAt = core.frame
    @touchedAt = core.frame

    teaX = 300
    teaY = 300

    @teaSurface = new TeaSurface()
    @teaSurface.moveTo(teaX + 120, teaY)
    @addChild(@teaSurface)

    @teabag = new Teabag()
    @teabag.moveTo(teaX + 270, teaY - 200)
    @addChild(@teabag)

    @teacup = new Teacup()
    @teacup.moveTo(teaX, teaY)
    @addChild(@teacup)

  ontouchstart: ->
    @teabag.startMove()
    if @startAt == @touchedAt
      @touchedAt = core.frame

  onenterframe: ->
    if @startAt != @touchedAt
      if @touchedAt + 2 * core.fps < core.frame
        core.gameOverScene = new GameOverScene(@touchedAt - @startAt)
        core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)

    @addChild(@bg)

    c1 = core.fps * 6
    c2 = core.fps * 9
    c3 = core.fps * 12

    if score < c1
      @bg.image = core.assets["game_over4.png"]
    else if score < c2
      @bg.image = core.assets["game_over2.png"]
    else if score < c3
      @bg.image = core.assets["game_over1.png"]
    else
      @bg.image = core.assets["game_over3.png"]

    @label       = new Label(score.toString())
    @label.font  = "80px Serif"
    @label.color = "white"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over1.png")
  assets.push("game_over2.png")
  assets.push("game_over3.png")
  assets.push("game_over4.png")
  assets.push("tea1.png")
  assets.push("tea2.png")
  assets.push("tea3.png")
  assets.push("tea4.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
