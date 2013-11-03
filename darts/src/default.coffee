enchant();

core = {}

ScoreBoard = [
  13, 4, 18, 1, 20, 5, 12, 9, 14, 11, 8, 16, 7, 19, 3, 17, 2, 15, 10, 6
]

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

class Arrow extends Sprite
  constructor: ->
    super(250, 40)
    @image = core.assets["arrow.png"]
    @moveTo 800, 400

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
    @point = x: 0, y: 0

    @arrow = new Arrow()
    @addChild @arrow

    @target = x: 400, y: 320

    @number = 10
    @numberLabel = new Label(@number.toString());
    @numberLabel.width = 300
    @numberLabel.textAlign = "center"
    @numberLabel.moveTo(980, 20)
    @numberLabel.font = "64px Sans-serif"
    @numberLabel.color = "rgb(34, 42, 46)"
    @addChild(@numberLabel);

    @score = 0;
    @scoreLabel = new Label(@score.toString() + "P");
    @scoreLabel.width = 300
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo(980, 104)
    @scoreLabel.font = "64px Sans-serif"
    @scoreLabel.color = "rgb(34, 42, 46)"
    @addChild(@scoreLabel);

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
    @arrow.tl.moveTo(@point.x - @arrow.width / 4, @point.y - @arrow.height / 2, 30).and().scaleTo(0.5, 0.5, 30).then =>
      @addChild @arrow
      @cal(@point)
      @number--
      if @number == 0
        core.gameOverScene = new GameOverScene(@score)
        core.replaceScene(core.gameOverScene)
      @numberLabel.text = @number.toString()
    @arrow = new Arrow()

  cal: (point) ->
    deg = relativeAngle(@target, point)
    radius = distance(@target, point)
    score = ScoreBoard[Math.floor(deg / 20)]
    if radius < 10
      score = 50
    else if radius < 30
      score = 25
    else if radius > 150 and radius < 180
      score = score * 3
    else if radius > 270 and radius < 300
      score = score * 2
    else if radius >= 300
      score = 0
    else
      score
    @score += score
    @scoreLabel.text = @score.toString() + "P"


class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @score = score
    @scoreLabel = new Label(@score.toString() + "P")
    @scoreLabel.width = 600
    @scoreLabel.textAlign = "center"
    @scoreLabel.moveTo(720, 200)
    @scoreLabel.font = "128px Sans-serif"
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
  assets.push("arrow.png")
  assets.push("how.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
