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

class Panel extends Sprite
  constructor: (num) ->
    super(575, 75)

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

    @number = (Math.floor(Math.random() * 899 + 100) for num in [1..10])

    sum = (s) ->
      s.reduce (t, s) -> t + s

    @sum = sum(@number)

    @label       = new Label(@number[0])
    @label.font  = "128px Serif"
    @label.color = "rgb(244, 244, 244)"
    @label.width = 800
    @label.textAlign = "center"
    @label.moveTo((HQ_GAME_WIDTH - @label.width) / 2, 300)
    @addChild(@label)

    @n = 1

  onenterframe: ->
    if @age % 20 is 0 and @n < 10
      @label.text = @number[@n]
      @n++
    else if @age % 20 is 0
      core.gameOverScene = new GameOverScene(@sum)
      core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (sum) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @sum = sum

    @number = []
    @number.push @sum
    (@number.push(@sum + Math.floor(Math.random() * 999 - 400))) for num in [0..2]
    @number.shuffle
    console.log @number

    @label = []

    for i in [0..3]
      pos = Pos[i]
      label       = new Label(@number[i])
      label.font  = "64px Serif"
      label.color = "rgb(24, 24, 24)"
      label.width = 575
      label.textAlign = "center"
      label.moveTo(pos.x, pos.y)
      @addChild(label)
      @label.push label

      panel = new Panel(@number[i])
      panel.moveTo pos.x, pos.y
      @addChild panel
      panel.addEventListener "touchstart", =>
        if @number[i] is @sum
          @scoreLabel = new Label("正解")
          @scoreLabel.width = 900
          @scoreLabel.textAlign = "center"
          @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 300)
          @scoreLabel.font = "128px Sans-serif"
          @scoreLabel.color = "red"
          @addChild(@scoreLabel)
          @tl.delay(90).then ->
            core.replaceScene core.titleScene
        else
          @scoreLabel = new Label("残念")
          @scoreLabel.width = 900
          @scoreLabel.textAlign = "center"
          @scoreLabel.moveTo((HQ_GAME_WIDTH - @scoreLabel.width) / 2, 300)
          @scoreLabel.font = "128px Sans-serif"
          @scoreLabel.color = "blue"
          @addChild(@scoreLabel)
          @tl.delay(90).then ->
            core.replaceScene core.titleScene


  Pos = [
    {x: 33,y: 246}
    {x: 675,y: 246}
    {x: 33,y: 388}
    {x: 675,y: 388}
  ]

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("panel.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
