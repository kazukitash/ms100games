enchant();

core = {}

ResultText = [
  "3年後に結婚する",
  "1度別れた後、復縁する",
  "どちらかが浮気をする",
  "恋人を友達に略奪される",
  "3人の子供に恵まれる",
  "恋人の借金が発覚し、別れる",
  "友達と恋人を争うが最終的にその恋人と結婚する",
  "おじいちゃん、おばあちゃんになっても手をつないで歩くほど仲良し",
  "遊ばれてフられる",
  "喧嘩が多くなるが、なんだかんだ別れない"
]

class Submit extends Label
  constructor: ->
    super()

    @text = "占う"
    @width = 600
    @textAlign = "center"
    @moveTo((HQ_GAME_WIDTH - @width) / 2, 510)
    @font = "48px Sans-serif"
    @color = "rgb(224, 134, 174)"

  ontouchstart: ->
    core.gameOverScene = new GameOverScene(Math.floor(Math.random() * 100))
    core.replaceScene(core.gameOverScene)

class Hart extends Sprite

class TitleScene extends Scene
  constructor: ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["title.png"]
    @addChild(@bg)

  ontouchstart: ->
    core.gameScene = new GameScene()
    core.replaceScene(core.gameScene)

class GameScene extends DOMScene
  constructor: ->
    super()

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    m_name = new Label "<form name='m_name'>" + "<input type='text' name='text' size='10'>" + "</form>"
    @addChild m_name
    m_birthday = new Label "<form name='m_birthday'>" + "<input type='text' name='text' size='10'>" + "</form>"
    @addChild m_birthday
    f_name = new Label "<form name='f_name'>" + "<input type='text' name='text' size='10'>" + "</form>"
    @addChild f_name
    f_birthday = new Label "<form name='f_birthday'>" + "<input type='text' name='text' size='10'>" + "</form>"
    @addChild f_birthday

    m_name.moveTo 300, 210
    f_name.moveTo 300, 450
    m_birthday.moveTo 650, 210
    f_birthday.moveTo 650, 450

    core.pause()

    submit = new Submit()
    @addChild submit

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toString() + "%")
    @label.width = 600
    @label.textAlign = "center"
    @label.font  = "96px Sans-serif"
    @label.color = "rgb(224, 134, 174)"
    @label.moveTo((HQ_GAME_WIDTH - @label.width) / 2, 300)
    @addChild(@label)

    @label       = new Label(ResultText[Math.floor(Math.random() * 10)])
    @label.width = 700
    @label.textAlign = "center"
    @label.font  = "18px Sans-serif"
    @label.color = "rgb(224, 134, 174)"
    @label.moveTo((HQ_GAME_WIDTH - @label.width) / 2, 665)
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
