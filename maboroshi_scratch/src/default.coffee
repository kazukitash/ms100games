enchant();

core = {}

Array.prototype.shuffle = ->
  i = @length
  while i
    j = Math.floor(Math.random() * i)
    t = @[--i]
    @[i] = @[j];
    @[j] = t;
  return @

class Scratch extends Sprite
  constructor: (pos) ->
    super(171, 171)
    @image = core.assets["scratch.png"]
    @moveTo pos.x, pos.y
    @opacity = 1
    @isRevealed = false

  ontouchmove:->
    if !@isRevealed
      if @opacity > 0
        @opacity -= 0.1
      else if @opacity < 0
        @opacity = 0
        @isRevealed = true

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

    @number = [1,1,2,2,3,3,4,4]
    atari = Math.floor(Math.random() * 4) + 1
    @number.push(atari)
    @number.shuffle()

    @shoukinList = ["1,000,000,000", "1,000,000", "10,000", "1,000"]
    @shoukin = 0

    @revealedNumber = []
    @limit = 2
    @scratchList = []
    n = 0
    while n < 9
      num = @number[n]
      label = new Label(num)
      label.width = 171
      label.textAlign = "center"
      pos = ScratchPos[n]
      label.moveTo(pos.x, pos.y + 45)
      label.font = "64px Sans-serif"
      label.color = "rgb(24, 24, 24)"
      @addChild(label)
      scratch = new Scratch(ScratchPos[n])
      @addChild scratch
      @scratchList.push scratch
      n++

  ScratchPos = [
    {x: 83, y: 102},
    {x: 267, y: 102},
    {x: 443, y: 102},
    {x: 83, y: 279},
    {x: 267, y: 279},
    {x: 443, y: 279},
    {x: 83, y: 463},
    {x: 267, y: 463},
    {x: 443, y: 463}
  ]

  onenterframe: ->
    if @limit < 0
      if (@revealedNumber[0] is @revealedNumber[1]) and (@revealedNumber[0] is @revealedNumber[2])
        lank = @revealedNumber[0]
        console.log lank
        @shoukin = @shoukinList[0]
        @success()
      else
        @failure()
    length = @scratchList.length
    while length
      scratch = @scratchList[--length]
      if scratch.isRevealed
        @limit--
        @revealedNumber.push @number[length]
        scratch.isRevealed = false

  failure: ->
    @label = new Label("残念")
    @label.width = 900
    @label.textAlign = "center"
    @label.moveTo((HQ_GAME_WIDTH - @label.width) / 2, 150)
    @label.font = "64px Sans-serif"
    @label.color = "rgb(24, 24, 24)"
    @addChild(@label)
    @tl.delay(30).then ->
      core.replaceScene core.titleScene

  success: ->
    @label = new Label(@shoukin + "円獲得！")
    @label.width = 900
    @label.textAlign = "center"
    @label.moveTo((HQ_GAME_WIDTH - @label.width) / 2, 150)
    @label.font = "64px Sans-serif"
    @label.color = "rgb(24, 24, 24)"
    @addChild(@label)
    @tl.delay(30).then ->
      core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("scratch.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
