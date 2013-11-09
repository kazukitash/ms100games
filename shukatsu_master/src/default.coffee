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

Array.prototype.shuffle = ->
  i = @length
  while i
    j = Math.floor(Math.random() * i)
    t = this[--i]
    this[i] = this[j]
    this[j] = t
  return @

QuestionCandidates = [
  {
    content:"文書での相手の会社の呼び方は？",
    answer:"貴社"
  },
  {
    content:"コートはどこに入るまでに脱ぐのが一般的なマナーでしょう？",
    answer:"会社の前まで"
  },
  {
    content:"あなたの長所は何ですか？",
    answer:"物事に真面目に取り組むところです。以下過去に真面目にとりくんだことを述べましょう。"
  },
  {
    content:"志望動機を教えて下さい。",
    answer:"御社でアルバイトをさせて頂いた際に社員の方が昼休みでも仕事を相談をする等いつでも真剣に仕事に取り組んでおり、そんな方々と一緒にお仕事をさせて頂きたいと思ったからです。"
  },
  {
    content:"学校での成績や勉強はどうでしたか？",
    answer:"成績は正直あまりよくありませんが、できる限り努力致しました。成績が思う様な結果に繋がらなくても、学生の本分なのでこれからも精一杯努力していきたいです。"
  },
  {
    content:"弊社の志望順位は？"
    answer:"御社が第一志望です。",
  },
  {
    content:"希望以外の職種になっても大丈夫ですか？",
    answer:"はい、御社に入社することが私の一番の希望です。可能でしたら、希望の職種で仕事を行いたいですが、希望以外の職種になっても一生懸命頑張りたいと思います。"
  },
  {
    content:"10年後はどうなっていたいと思いますか？",
    answer:"私の10年後は御社にとってなくてはならない存在になりたいと思っています。様々な経験を積んで、結果を残せるように頑張りたいと思います。"
  },
  {
    content:"なぜ留年したと思いますか？？",
    answer:"部活動に時間を割きすぎて、勉強がおろそかになってしまいました。この自己管理能力の低さを反省して、次の年からは勉強のスケジュールを組んでから部活動のスケジュールを組むようにしました。結果、留年してからは単位を一つも落としていないのでこのまましっかりと頑張りたいと思います。"
  },
  {
    content:"あなたの短所は何ですか？"
    answer:"御社が第一志望です。",
  }
]

AnswerCandidates = [
  "貴社",
  "会社の前まで",
  "物事に真面目に取り組むところです。以下過去に真面目にとりくんだことを述べましょう。",
  "御社でアルバイトをさせて頂いた際に社員の方が昼休みでも仕事を相談をする等いつでも真剣に仕事に取り組んでおり、そんな方々と一緒にお仕事をさせて頂きたいと思ったからです。",
  "成績は正直あまりよくありませんが、できる限り努力致しました。成績が思う様な結果に繋がらなくても、学生の本分なのでこれからも精一杯努力していきたいです。",
  "御社が第一志望です。",
  "はい、御社に入社することが私の一番の希望です。可能でしたら、希望の職種で仕事を行いたいですが、希望以外の職種になっても一生懸命頑張りたいと思います。",
  "私の10年後は御社にとってなくてはならない存在になりたいと思っています。様々な経験を積んで、結果を残せるように頑張りたいと思います。",
  "部活動に時間を割きすぎて、勉強がおろそかになってしまいました。この自己管理能力の低さを反省して、次の年からは勉強のスケジュールを組んでから部活動のスケジュールを組むようにしました。結果、留年してからは単位を一つも落としていないのでこのまましっかりと頑張りたいと思います。",
  "御社が第一志望です。"
]

class Question extends Label
  constructor: ->
    super()
    @question = QuestionCandidates[Math.floor(Math.random() * QuestionCandidates.length)]
    @text = @question.content
    @font = "15px Serif"
    @color = "white"
    @textAlign = "center"
    @width = 800
    @x = (HQ_GAME_WIDTH - @width) / 2
    @y = (HQ_GAME_HEIGHT - @height) / 2 - 150

  answer: ->
    answer = new Answer()
    answer.text = @question.answer
    answer

class Answer extends Label
  constructor: ->
    super()
    @text = AnswerCandidates[Math.floor(Math.random() * AnswerCandidates.length)]
    @width = 400
    @height = 30
    @font = "15px Serif"

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
    @score = 0

    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game.png"]
    @addChild(@bg)

    @timer = new CountUpTimer()
    @timer.font = "40px Serif"
    @timer.moveTo(60, 60)
    @timer.start()
    @addChild(@timer)

    @next()

  next: ->
    @startAt = core.frame

    @question = new Question();
    @addChild(@question)

    @answers = [@question.answer()]
    @answers.push(new Answer())
    @answers.push(new Answer())
    @answers.push(new Answer())

    @answers = @answers.shuffle()

    @answers[0].moveTo(100, 460)
    @answers[1].moveTo(700, 460)
    @answers[2].moveTo(100, 620)
    @answers[3].moveTo(700, 620)

    @answers.forEach (answer) =>
      @addChild(answer)
      answer.addEventListener "touchstart", =>

  removePrevious: ->
    @removeChild(@question)
    @answers.forEach (answer) =>
      @removeChild(answer)

  ontouchstart: (e) ->
    @length++
    x = e.x
    y = e.y

    if x < HQ_GAME_WIDTH / 2
      if 560 < y
        answer = @answers[2]
      else if 440 < y
        answer = @answers[0]
    else
      if 560 < y
        answer = @answers[3]
      else if 440 < y
        answer = @answers[1]


    console.log @question.answer().text
    console.log answer.text
    if @question.answer().text == answer.text
      @score++

    @removePrevious()
    @next()

    if @length == 10
      core.titleScene = new TitleScene()
      core.replaceScene(core.titleScene)


window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
