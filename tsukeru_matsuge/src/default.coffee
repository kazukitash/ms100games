enchant()

core = {}

Kao = [
  {image: "game1.png", lMatsuge: {x: 352, y: 301}, rMatsuge: {x: 933, y: 301}, lTop: true, rTop: true},
  {image: "game2.png", lMatsuge: {x: 352, y: 301}, rMatsuge: {x: 933, y: 429}, lTop: true, rTop: false},
  {image: "game3.png", lMatsuge: {x: 352, y: 429}, rMatsuge: {x: 933, y: 301}, lTop: false, rTop: true},
  {image: "game4.png", lMatsuge: {x: 352, y: 429}, rMatsuge: {x: 933, y: 429}, lTop: false, rTop: false}
]

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

class Atari extends Sprite
  constructor: ->
    super(20, 20)

class MakeUp extends Sprite
  constructor: ->
    super(808, 179)
    @image = core.assets["makeup.png"]
    @moveTo (HQ_GAME_WIDTH - @width) / 2, (HQ_GAME_HEIGHT - @height) / 2

class LTMatsuge extends Sprite
  constructor: ->
    super(254, 104)
    @image = core.assets["lt_matuge.png"]

  ontouchmove: (e) ->
    @moveTo e.x - @width / 2, e.y - @height / 2

class RTMatsuge extends Sprite
  constructor: ->
    super(254, 104)
    @image = core.assets["rt_matuge.png"]

  ontouchmove: (e) ->
    @moveTo e.x - @width / 2, e.y - @height / 2

class LBMatsuge extends Sprite
  constructor: ->
    super(200, 89)
    @image = core.assets["lb_matuge.png"]

  ontouchmove: (e) ->
    @moveTo e.x - @width / 2, e.y - @height / 2

class RBMatsuge extends Sprite
  constructor: ->
    super(200, 89)
    @image = core.assets["rb_matuge.png"]

  ontouchmove: (e) ->
    @moveTo e.x - @width / 2, e.y - @height / 2

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.gameScene = new GameScene(Kao[Math.floor(Math.random() * 4)])
    core.replaceScene(core.gameScene)

class GameScene extends Scene
  constructor: (options) ->
    super()

    @lTop = options.lTop
    @rTop = options.rTop

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets[options.image]
    @addChild(@bg)

    @lAtari = new Atari()
    @addChild @lAtari
    @lAtari.moveTo options.lMatsuge.x, options.lMatsuge.y

    @rAtari = new Atari()
    @addChild @rAtari
    @rAtari.moveTo options.rMatsuge.x, options.rMatsuge.y

    @ltMatsuge = new LTMatsuge()
    @addChild @ltMatsuge
    @ltMatsuge.moveTo Math.random() * (HQ_GAME_WIDTH - @ltMatsuge.width), Math.random() * (HQ_GAME_HEIGHT - @ltMatsuge.height)

    @rtMatsuge = new RTMatsuge()
    @addChild @rtMatsuge
    @rtMatsuge.moveTo Math.random() * (HQ_GAME_WIDTH - @rtMatsuge.width), Math.random() * (HQ_GAME_HEIGHT - @rtMatsuge.height)

    @lbMatsuge = new LBMatsuge()
    @addChild @lbMatsuge
    @lbMatsuge.moveTo Math.random() * (HQ_GAME_WIDTH - @lbMatsuge.width), Math.random() * (HQ_GAME_HEIGHT - @lbMatsuge.height)

    @rbMatsuge = new RBMatsuge()
    @addChild @rbMatsuge
    @rbMatsuge.moveTo Math.random() * (HQ_GAME_WIDTH - @rbMatsuge.width), Math.random() * (HQ_GAME_HEIGHT - @rbMatsuge.height)

    @ltAtari = new Atari()
    @addChild @ltAtari

    @rtAtari = new Atari()
    @addChild @rtAtari

    @lbAtari = new Atari()
    @addChild @lbAtari

    @rbAtari = new Atari()
    @addChild @rbAtari

    @timer = new CountUpTimer()
    @timer.width = 180
    @timer.textAlign = "center"
    @timer.moveTo 30, 75
    @timer.font = "48px Sans-serif"
    @timer.color = "rgb(24, 24, 24)"

    @makeUp = new MakeUp()
    @addChild @makeUp

  onenterframe: ->
    if @age == 30
      @timer.start()
      @addChild @timer
      @removeChild @makeUp
    @ltAtari.moveTo @ltMatsuge.x + 123, @ltMatsuge.y + 46
    @rtAtari.moveTo @rtMatsuge.x + 113, @rtMatsuge.y + 45
    @lbAtari.moveTo @lbMatsuge.x + 85, @lbMatsuge.y + 15
    @rbAtari.moveTo @rbMatsuge.x + 90, @rbMatsuge.y + 18

    if @lTop and @rTop
      if @ltAtari.intersect @lAtari
        if @rtAtari.intersect @rAtari
          core.gameOverScene = new GameOverScene(@timer.currentSec())
          core.replaceScene core.gameOverScene
    if @lTop and !@rTop
      if @ltAtari.intersect @lAtari
        if @rbAtari.intersect @rAtari
          core.gameOverScene = new GameOverScene(@timer.currentSec())
          core.replaceScene core.gameOverScene
    if !@lTop and @rTop
      if @lbAtari.intersect @lAtari
        if @rtAtari.intersect @rAtari
          core.gameOverScene = new GameOverScene(@timer.currentSec())
          core.replaceScene core.gameOverScene
    if !@lTop and !@rTop
      if @lbAtari.intersect @lAtari
        if @rbAtari.intersect @rAtari
          core.gameOverScene = new GameOverScene(@timer.currentSec())
          core.replaceScene core.gameOverScene


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
    @scoreLabel.moveTo((HQ_GAME_WIDTH-@scoreLabel.width)/2, 430)
    @scoreLabel.font = "100px Sans-serif"
    @scoreLabel.color = "rgb(230,230,230)"
    @addChild(@scoreLabel)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game1.png")
  assets.push("game2.png")
  assets.push("game3.png")
  assets.push("game4.png")
  assets.push("game_over.png")
  assets.push("rt_matuge.png")
  assets.push("lt_matuge.png")
  assets.push("rb_matuge.png")
  assets.push("lb_matuge.png")
  assets.push("makeup.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
