enchant();

core = {}

class CountDownTimer extends Label
  constructor: (sec) ->
    super()

    @frame   = sec * core.fps
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
    @frame - core.frame + @startAt

  remainingSec: ->
    @remainingFrame() / core.fps

  bonus: (bonus) ->
    @frame += bonus * core.fps

  onenterframe: ->
    if !@isStopped()
      @text = @remainingSec().toFixed(2)

    if @remainingFrame() == 0
      @stop()
      ev = new Event "over"
      @dispatchEvent ev

class Traveler extends Sprite
  constructor: ->
    super(48, 77)
    @image = core.assets["traveler.png"]
    @frame = 0
    @moveTo Math.random() * HQ_GAME_WIDTH, Math.random() * HQ_GAME_HEIGHT

    @endurance = 0
    @isShined = false
    @isBlowed = false
    @isDead = false

    @vx = 3
    @vy = 5

  onenterframe: ->
    if @endurance > 45
      @tl.fadeOut(20).then =>
        @isDead = true
    else if @endurance > 30
      @frame = 2
    else if @endurance > 15
      @frame = 1
    if @isBlowed and (@endurance > 30 or @endurance <= 15)
      @endurance++
      @isBlowed = false
    if @isShined and @endurance <= 30 and @endurance > 15
      @endurance++
      @isShined = false
    if @x < 0 or @x > HQ_GAME_WIDTH - @width
      @vx = -@vx
      @scaleX = -1
    if @y < 0 or @y > HQ_GAME_HEIGHT - @height
      @vy = -@vy
    @moveBy @vx, @vy

class Travelers extends Group
  constructor: (sA, cA) ->
    super()
    @sA = sA
    @cA = cA
    @travelers = []

  onenterframe: ->
    travelersLength = @travelers.length
    while travelersLength
      traveler = @travelers[--travelersLength]
      if @cA.within traveler, 120
        traveler.isBlowed = true
      if @sA.within traveler, 120
        traveler.isShined = true
      if traveler.isDead
        @removeChild traveler
        @travelers.splice travelersLength, 1
        ev = new Event "remove"
        core.gameScene.dispatchEvent ev

    if core.frame % 90 == 0
      traveler = new Traveler()
      @addChild traveler
      @travelers.push traveler

class ScoreBoard extends Sprite
  constructor: ->
    super(185, 77)
    @image = core.assets["score.png"]
    @moveTo 1080, 20

class Sun extends Sprite
  constructor: ->
    super(240, 230)
    @image = core.assets["sun.png"]
    @moveTo HQ_GAME_WIDTH - @width, HQ_GAME_HEIGHT - @height

  ontouchstart: ->
    ev = new Event "Sun"
    @dispatchEvent ev

class Cloud extends Sprite
  constructor: ->
    super(338, 218)
    @image = core.assets["cloud.png"]
    @moveTo -126, -71

  ontouchstart: ->
    ev = new Event "Cloud"
    @dispatchEvent ev

class SunAttack extends Sprite
  constructor: ->
    super(133, 133)
    @image = core.assets["sun_attack.png"]
    @moveTo HQ_GAME_WIDTH, HQ_GAME_HEIGHT


class CloudAttack extends Sprite
  constructor: ->
    super(133, 133)
    @image = core.assets["cloud_attack.png"]
    @moveTo HQ_GAME_WIDTH, HQ_GAME_HEIGHT

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

    @addEventListener "remove", =>
      @score++
      @scoreLabel.text = @score.toString()
      @timer.bonus(4)

    @sunAttack = new SunAttack()
    @sunAttack.opacity = 0
    @addChild @sunAttack
    @cloudAttack = new CloudAttack()
    @cloudAttack.opacity = 0
    @addChild @cloudAttack

    travelers = new Travelers(@sunAttack, @cloudAttack)
    @addChild travelers

    scoreBoard = new ScoreBoard()
    @addChild scoreBoard

    @sun = new Sun()
    @addChild @sun
    @sun.addEventListener "Sun", =>
      @isSun = true

    @cloud = new Cloud()
    @addChild @cloud
    @cloud.addEventListener "Cloud", =>
      @isSun = false

    @isAttacking = false

    @score = 0
    @scoreLabel = new Label @score.toString()
    @scoreLabel.width = 200
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo 1080, 35
    @scoreLabel.font = "48px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild @scoreLabel

    @timer = new CountDownTimer(30)
    @timer.width = 300
    @timer.textAlign = "center"
    @timer.moveTo (HQ_GAME_WIDTH-@timer.width)/2, 35
    @timer.font = "48px Sans-serif"
    @timer.color = "rgb(34, 42, 46)"
    @timer.addEventListener "over", =>
      core.gameOverScene = new GameOverScene(@score);
      core.replaceScene core.gameOverScene

    @timer.start()
    @addChild @timer

  onenterframe: ->
    if @isAttacking
      if core.frame % 30 == 0
        if @isSun
          sun = new Sun()
          @addChild sun
          sun.tl.scaleTo(1.2, 1.2, 20).and().fadeOut(20).then =>
            @removeChild sun
        else
          @cloud.tl
            .moveBy(2, 0, 3)
            .moveBy(-5, 0, 3).moveBy(5, 0, 3)
            .moveBy(-5, 0, 3).moveBy(5, 0, 3)
            .moveBy(-5, 0, 3).moveBy(5, 0, 3)
            .moveBy(-2, 0, 3)

  ontouchstart: (e) ->
    console.log e.x.toFixed(0), e.y.toFixed(0)
    @isAttacking = true
    if @isSun
      @sunAttack.moveTo e.x - @sunAttack.width / 2, e.y - @sunAttack.height / 2
      @sunAttack.opacity = 1
    else
      @cloudAttack.moveTo e.x - @cloudAttack.width / 2, e.y - @cloudAttack.height / 2
      @cloudAttack.opacity = 1

  ontouchmove: (e) ->
    if @isSun
      @sunAttack.moveTo e.x - @sunAttack.width / 2, e.y - @sunAttack.height / 2
    else
      @cloudAttack.moveTo e.x - @cloudAttack.width / 2, e.y - @cloudAttack.height / 2

  ontouchend: ->
    if @isSun
      @sunAttack.opacity = 0
      @sunAttack.moveTo HQ_GAME_WIDTH, HQ_GAME_HEIGHT
    else
      @cloudAttack.opacity = 0
      @cloudAttack.moveTo HQ_GAME_WIDTH, HQ_GAME_HEIGHT
    @isAttacking = false

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score
    @scoreLabel = new Label(@score.toString() + "人")
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
  assets.push("cloud.png")
  assets.push("sun.png")
  assets.push("score.png")
  assets.push("sun_attack.png")
  assets.push("cloud_attack.png")
  assets.push("traveler.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
