enchant();

core = {}

BarList = ["bar1.png","bar2.png","bar3.png","bar4.png","bar5.png","bar6.png"]
IceList = ["ice1.png","ice2.png","ice3.png","ice4.png","ice5.png","ice6.png","ice7.png","ice8.png"]

class Bar extends Sprite
  constructor: (option) ->
    super(1043, 102)
    @image = core.assets[option]
    @moveTo 120, 312


class Ice extends Sprite
  constructor: (option) ->
    super(699, 373)
    @image = core.assets[option]
    @moveTo 85, 173
    @isAte = false

  ontouchstart: ->
    @isAte = true

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

    @bar = new Bar(BarList[Math.floor(Math.random() * 6)])
    @addChild @bar

    @count = 0

    @ices = []

    for i in [7..0]
      ice = new Ice(IceList[i])
      @ices.push ice
      @addChild ice

    @isEnd = false

  ontouchstart: ->
    for i in [0..7]
      if @ices[i].isAte
        @removeChild @ices[i]
        @ices[i].isAte = false
        @count++

    if @isEnd
      core.replaceScene core.titleScene

  onenterframe: ->
    if @count == 8
      @isEnd = true

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("bar1.png")
  assets.push("bar2.png")
  assets.push("bar3.png")
  assets.push("bar4.png")
  assets.push("bar5.png")
  assets.push("bar6.png")
  assets.push("ice1.png")
  assets.push("ice2.png")
  assets.push("ice3.png")
  assets.push("ice4.png")
  assets.push("ice5.png")
  assets.push("ice6.png")
  assets.push("ice7.png")
  assets.push("ice8.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
