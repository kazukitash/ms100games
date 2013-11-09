enchant();

core = {}

ScoreBoard = [
  13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10, 6
]

ScorePosition = [
  {x: 197, y: 9}
  {x: 496, y: 9}
  {x: 794, y: 9}
  {x: 197, y: 114}
  {x: 496, y: 114}
  {x: 794, y: 114}
]

Array.prototype.shuffle = ->
  i = @length
  while i
    j = Math.floor(Math.random() * i)
    t = this[--i]
    this[i] = this[j]
    this[j] = t
  return @

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

distance = (self, other) ->
  dX = other.x - self.x;
  dY = other.y - self.y;
  return Math.sqrt(dX * dX + dY * dY)

relativeAngle = (self, other) ->
  dX = other.x - self.x;
  dY = other.y - self.y;
  rad = Math.atan(Math.abs(dY)/Math.abs(dX))
  if dY < 0
    if dX > 0
      return rad/(Math.PI / 180)
    else
      return 180 - rad/(Math.PI / 180)
  else
    if dX < 0
      return 180 + rad/(Math.PI / 180)
    else
      return 360 - rad/(Math.PI / 180)

class Gari extends Sprite
  constructor: ->
    super(103, 144)
    @image = core.assets["gari.png"]
    @moveTo (HQ_GAME_WIDTH + @width) /2, 500

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
    @point = x: 0, y: 0

    @gari = new Gari()
    @addChild @gari

    @target = x: 400, y: 320

    @score = 0;
    @scoreLabel = new Label(@score.toString());
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo(1020, 60)
    @scoreLabel.font = "44px Sans-serif"
    @scoreLabel.color = "#d8f4ff"
    @addChild(@scoreLabel);

    @timer = new CountDownTimer(15);
    @timer.width = 150
    @timer.textAlign = "center"
    @timer.start()
    @timer.font = "64px Serif"
    @timer.color = "#6e8ca2"
    @timer.moveTo(10, 110)
    @addChild(@timer)

    @timer.addEventListener "over", =>
      core.GameOverScene = new GameOverScene(@score)
      core.replaceScene(core.GameOverScene)

    @scoreList = []

    for i in [0..5]
      pos = ScorePosition[i]
      label = new Label(ScoreBoard[i])
      label.width = 289
      label.textAlign = "center"
      label.moveTo(pos.x, pos.y)
      label.font = "90px Sans-serif"
      label.color = "#6e8ca2"
      @addChild label
      @scoreList.push label

  ontouchstart: (e) ->
    maxRadius = 20
    radian = Math.random() * 360
    if radian >= 0 and radian < 180
      @point.y = e.y + maxRadius * Math.random() * Math.sin(radian)
      if radian < 90
        @point.x = e.x + maxRadius * Math.random() * Math.cos(radian)
      else
        @point.x = e.x - maxRadius * Math.random() * Math.cos(radian)
    if radian >= 180 and radian < 360
      @point.y = e.y - maxRadius * Math.random() * Math.sin(radian)
      if radian < 270
        @point.x = e.x - maxRadius * Math.random() * Math.cos(radian)
      else
        @point.x = e.x + maxRadius * Math.random() * Math.cos(radian)
    @gari.tl.moveTo(@point.x - @gari.width / 2, @point.y - @gari.height / 2, 30).and().scaleTo(0.5, 0.5, 30).then =>
      @addChild @gari
      @cal(@point)
    @gari = new Gari()

  cal: (point) ->
    x = @point.x + @gari.width / 2
    y = @point.y + @gari.height / 2

    score = 0
    for i in [0..5]
      pos = ScorePosition[i]
      if x > pos.x and x < pos.x + 289 and y > pos.y and y < pos.y + 197
        score = ScoreBoard[i]

    @score += score
    @scoreLabel.text = @score.toString()

  onenterframe: ->
    if @age % 10 is 0
      ScoreBoard.shuffle()
      for i in [0..5]
        @scoreList[i].text = ScoreBoard[i]


class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score
    @scoreLabel = new Label(@score.toString())
    @scoreLabel.width = 600
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo(250, 330)
    @scoreLabel.font = "96px Sans-serif"
    @scoreLabel.color = "#ff5739"
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
  assets.push("gari.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
