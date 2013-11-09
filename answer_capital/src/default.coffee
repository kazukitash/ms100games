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
    content:"アイスランド共和国",
    answer:"レイキャビク"
  },
  {
    content:"アイルランド",
    answer:"ダブリン"
  },
  {
    content:"アゼルバイジャン共和国",
    answer:"バクー"
  },
  {
    content:"アフガニスタンイスラム国",
    answer:"カブ-ル"
  },
  {
    content:"アメリカ合衆国",
    answer:"ワシン卜ン"
  },
  {
    content:"アラブ首長国連邦",
    answer:"アブダビ"
  },
  {
    content:"アルジェリア民主人民共和国",
    answer:"アルジェ"
  },
  {
    content:"アルゼンチン共和国",
    answer:"ブエノスアイレス"
  },
  {
    content:"アルバニア共和国",
    answer:"チラナ"
  },
  {
    content:"アルメニア共和国",
    answer:"エレバン"
  },
  {
    content:"アンゴラ共和国",
    answer:"ルアンダ"
  },
  {
    content:"アンチグア=バーブーダ",
    answer:"セントジョンズ"
  },
  {
    content:"アンドラ公国",
    answer:"アンドラ・ラ・べリャ"
  },
  {
    content:"イェメン共和国",
    answer:"サナア"
  },
  {
    content:"イスラエル国",
    answer:"エルサレム"
  },
  {
    content:"イタリア共和国",
    answer:"ローマ"
  },
  {
    content:"イラク共和国",
    answer:"バグダッド"
  },
  {
    content:"イランイスラム共和国",
    answer:"テヘラン"
  },
  {
    content:"インド",
    answer:"ニュ-デリ-"
  },
  {
    content:"インドネシア共和国",
    answer:"ジャカルタ"
  },
  {
    content:"ウガンダ共和国",
    answer:"カンパラ"
  },
  {
    content:"ウクライナ",
    answer:"キエフ"
  },
  {
    content:"ウズべキスタン共和国",
    answer:"タシケント"
  },
  {
    content:"ウルグアイ東方共和国",
    answer:"モンテビデオ"
  },
  {
    content:"エクアドル共和国",
    answer:"キト"
  },
  {
    content:"エジプトアラブ共和国",
    answer:"カイロ"
  },
  {
    content:"エストニア共和国",
    answer:"タリン"
  },
  {
    content:"エチオピア連邦民主共和国",
    answer:"アジスアべバ"
  },
  {
    content:"エリトリア国",
    answer:"アスマラ"
  },
  {
    content:"エルサルバドル共和国",
    answer:"サンサルバドル"
  },
  {
    content:"オ-ストリア共和国",
    answer:"ウイーン"
  },
  {
    content:"オーストラリア",
    answer:"キャンべラ"
  },
  {
    content:"オマ-ン国",
    answer:"マスカット"
  },
  {
    content:"オランダ王国",
    answer:"アムステルダム"
  },
  {
    content:"カーボべルデ共和国",
    answer:"プライア"
  },
  {
    content:"ガ-ナ共和国",
    answer:"アクラ"
  },
  {
    content:"ガイアナ協同共和国",
    answer:"ジョージタウン"
  },
  {
    content:"カザフスタン共和国",
    answer:"アルマトゥイ"
  },
  {
    content:"カタ―ル国",
    answer:"ドーハ"
  },
  {
    content:"カナダ",
    answer:"オタワ"
  },
  {
    content:"ガボン共和国",
    answer:"リ-ブルビル"
  },
  {
    content:"カメルーン共和国",
    answer:"ヤウンデ"
  },
  {
    content:"ガンビア共和国",
    answer:"バンジュ-ル"
  },
  {
    content:"カンボジア王国",
    answer:"プノンぺン"
  },
  {
    content:"ギニアビサオ共和国",
    answer:"ビサオ"
  },
  {
    content:"ギニア共和国",
    answer:"コナクリ"
  },
  {
    content:"キプロス共和国",
    answer:"ニコシア"
  },
  {
    content:"キューバ共和国",
    answer:"ハバナ"
  },
  {
    content:"ギリシア共和国",
    answer:"アテネ"
  },
  {
    content:"キリバス共和国",
    answer:"タラワ"
  },
  {
    content:"キルギス共和国",
    answer:"ビシュケク"
  },
  {
    content:"グアテマラ共和国",
    answer:"グアテマラシティ"
  },
  {
    content:"クウェート国",
    answer:"クウェ-ト"
  },
  {
    content:"グルジア共和国",
    answer:"トビリシ"
  },
  {
    content:"グレートブリテンおよび北部アイルランド連合",
    answer:"ロンドン"
  },
  {
    content:"グレナダ",
    answer:"セントジョージズ"
  },
  {
    content:"クロアチア共和国",
    answer:"ザグレブ"
  },
  {
    content:"ケニア共和国",
    answer:"ナイロビ"
  },
  {
    content:"コートジボアール共和国",
    answer:"ヤムスクロ"
  },
  {
    content:"コスタリカ共和国",
    answer:"サンホセ"
  },
  {
    content:"コモロイスラム連邦共和国",
    answer:"モロニ"
  },
  {
    content:"コロンビア共和国",
    answer:"サンタフェデボゴタ"
  },
  {
    content:"コンゴ共和国",
    answer:"ブラザビル"
  },
  {
    content:"ザイ―ル共和国",
    answer:"キンシヤサ"
  },
  {
    content:"サウジアラビア王国",
    answer:"リヤド"
  },
  {
    content:"サントメ=プリンシペ民主共和国",
    answer:"サントメ"
  },
  {
    content:"ザンビア共和国",
    answer:"ルサカ"
  },
  {
    content:"サンマリノ共和国",
    answer:"サンマリノ"
  },
  {
    content:"シェラレオネ共和国",
    answer:"フリータウン"
  },
  {
    content:"ジブチ共和国",
    answer:"ジブチ"
  },
  {
    content:"ジャマイカ",
    answer:"キングストン"
  },
  {
    content:"シリアアラブ共和国",
    answer:"ダマスカス"
  },
  {
    content:"シンガポ-ル共和国",
    answer:"シンガポ-ル"
  },
  {
    content:"ジンバブエ共和国",
    answer:"ハラーレ"
  },
  {
    content:"スイス連邦",
    answer:"べルン"
  },
  {
    content:"スウェ‐デン王国",
    answer:"ストックホルム"
  },
  {
    content:"スーダン共和国",
    answer:"ハルツーム"
  },
  {
    content:"スぺイン",
    answer:"マドリ-ド"
  },
  {
    content:"スリナム共和国",
    answer:"パラマリボ"
  },
  {
    content:"スリランカ民主社会主義共和国",
    answer:"スリジャヤワルダナプラコッテ"
  },
  {
    content:"スロバキア共和国",
    answer:"ブラチスラバ"
  },
  {
    content:"スロべニア共和国",
    answer:"リュブリャナ"
  },
  {
    content:"スワジランド王国",
    answer:"ムババネ"
  },
  {
    content:"セイシェル共和国",
    answer:"ビクトリア"
  },
  {
    content:"赤道ギニア共和国",
    answer:"マラボ"
  },
  {
    content:"セネガル共和国",
    answer:"ダカ-ル"
  },
  {
    content:"セントクリストファー=ネイビス",
    answer:"バセテ一ル"
  },
  {
    content:"セントビンセントおよぴグレナディーン諸島",
    answer:"キングスタウン"
  },
  {
    content:"セントルシア",
    answer:"カストリーズ"
  },
  {
    content:"ソマリア民主共和国",
    answer:"モガディシュ"
  },
  {
    content:"ソロモン諸島",
    answer:"ホニアラ"
  },
  {
    content:"大韓民国",
    answer:"ソウル"
  },
  {
    content:"タイ王国",
    answer:"バンコク"
  },
  {
    content:"タジキスタン共和国",
    answer:"ドゥシャンべ"
  },
  {
    content:"タンザニア連合共和国",
    answer:"ダルエスサラ-ム"
  },
  {
    content:"チェコ共和国",
    answer:"プラハ"
  },
  {
    content:"チャド共和国",
    answer:"ンジャメナ"
  },
  {
    content:"中華人民共和国",
    answer:"ぺキン"
  },
  {
    content:"中央アフリカ共和国",
    answer:"バンギ"
  },
  {
    content:"チュニジア共和国 ",
    answer:"チュニス"
  },
  {
    content:"朝鮮民主主義人民共和国",
    answer:"ピョンヤン"
  },
  {
    content:"チリ共和国 ",
    answer:"サンチアゴ"
  },
  {
    content:"ツバル",
    answer:"フナフチ"
  },
  {
    content:"デンマーク王国",
    answer:"コぺンハーゲン"
  },
  {
    content:"ドイツ連邦共和国",
    answer:"べルリン"
  },
  {
    content:"トーゴ共和国",
    answer:"ロメ"
  },
  {
    content:"ドミニカ共和国",
    answer:"サントドミンゴ"
  },
  {
    content:"ドミニカ国",
    answer:"ロゾー"
  },
  {
    content:"トリニダード=トバゴ共和国",
    answer:"ポートオブスペイン"
  },
  {
    content:"トルクメニスタン",
    answer:"アシガバ‐ド"
  },
  {
    content:"トルコ共和国",
    answer:"アンカラ"
  },
  {
    content:"トンガ王国",
    answer:"ヌクアロファ"
  },
  {
    content:"ナイジェリア連邦共和国",
    answer:"アブジャ"
  },
  {
    content:"ナウル共和国",
    answer:"ナウル"
  },
  {
    content:"ナミビア共和国",
    answer:"ウイントフック"
  },
  {
    content:"ニカラグア共和国",
    answer:"マナグア"
  },
  {
    content:"ニジェール共和国",
    answer:"ニアメ"
  },
  {
    content:"西サモア",
    answer:"アピア"
  },
  {
    content:"日本国",
    answer:"東京"
  },
  {
    content:"ニュージーランド",
    answer:"ウェリントン"
  },
  {
    content:"ネパール王国",
    answer:"カトマンズ"
  },
  {
    content:"ノルウェー王国",
    answer:"オスロ"
  },
  {
    content:"バ-レ-ン国",
    answer:"マナーマ"
  },
  {
    content:"ハイチ共和国",
    answer:"ポルトープランス"
  },
  {
    content:"パキスタンイスラム共和国",
    answer:"イスラマバード"
  },
  {
    content:"バチカン市国",
    answer:"バチカン"
  },
  {
    content:"パナマ共和国",
    answer:"パナマ"
  },
  {
    content:"バヌアツ共和国",
    answer:"ポートビラ"
  },
  {
    content:"バハマ国",
    answer:"ナッソー"
  },
  {
    content:"パプアニューギニア",
    answer:"ポートモレスビー"
  },
  {
    content:"パラオ共和国",
    answer:"コロール"
  },
  {
    content:"パラグアイ共和国",
    answer:"アスンシオン"
  },
  {
    content:"バルバドス",
    answer:"ブリッジタウン"
  },
  {
    content:"ハンガリー共和国",
    answer:"ブダぺスト"
  },
  {
    content:"バングラデシュ人民共和国",
    answer:"ダッカ"
  },
  {
    content:"ブ-タン王国 ",
    answer:"テインプー"
  },
  {
    content:"フイジー共和国",
    answer:"スバ"
  },
  {
    content:"フィリピン共和国",
    answer:"マニラ"
  },
  {
    content:"フィンランド共和国",
    answer:"ヘルシンキ"
  },
  {
    content:"ブラジル連邦共和国",
    answer:"ブラジリア"
  },
  {
    content:"フランス共和国",
    answer:"パリ"
  },
  {
    content:"ブルガリア共和国",
    answer:"ソフィア"
  },
  {
    content:"ブルキナファソ",
    answer:"ワガドゥーグー"
  },
  {
    content:"ブルネイダルサラ-ム国",
    answer:"バンダルスリブガワン"
  },
  {
    content:"ブルンジ共和国  ",
    answer:"ブジュンブラ"
  },
  {
    content:"べトナム社会主義共和国",
    answer:"ハノイ"
  },
  {
    content:"べナン共和国",
    answer:"ポルトノボ"
  },
  {
    content:"べネズエラ共和国 ",
    answer:"カラカス"
  },
  {
    content:"べラルーシ共和国",
    answer:"ミンスク"
  },
  {
    content:"べリーズ",
    answer:"べルモパン"
  },
  {
    content:"ぺルー共和国",
    answer:"リマ"
  },
  {
    content:"べルギー王国",
    answer:"ブリュッセル"
  },
  {
    content:"ポーランド共和国",
    answer:"ワルシャワ"
  },
  {
    content:"ボスニア=へルツェゴビナ",
    answer:"サラエボ"
  },
  {
    content:"ボツワナ共和国",
    answer:"ハボロ-ネ"
  },
  {
    content:"ボリビア共和国",
    answer:"ラパス"
  },
  {
    content:"ポルトガル共和国",
    answer:"リスボン"
  },
  {
    content:"(ホンコン)",
    answer:"主市ビクトリア"
  },
  {
    content:"ホンジュラス共和国",
    answer:"テグシガルパ"
  },
  {
    content:"マーシャル諸島共和国",
    answer:"マジュロ"
  },
  {
    content:"マケドニア・旧ユーゴスラビア共和国",
    answer:"スコピエ"
  },
  {
    content:"マダガスカル共和国",
    answer:"アンタナナリボ"
  },
  {
    content:"マラウイ共和国",
    answer:"リロングウェ"
  },
  {
    content:"マリ共和国",
    answer:"バマコ"
  },
  {
    content:"マルタ共和国",
    answer:"バレッタ"
  },
  {
    content:"マレ―シア",
    answer:"クアラルンプ-ル"
  },
  {
    content:"ミクロネシア連邦",
    answer:"パリキール"
  },
  {
    content:"南アフリカ共和国",
    answer:"プレトリア"
  },
  {
    content:"ミャンマ―連邦 ",
    answer:"ヤンゴン"
  },
  {
    content:"メキシコ合衆国",
    answer:"メキシコシティ"
  },
  {
    content:"モーリシャス共和国",
    answer:"ポートルイス"
  },
  {
    content:"モーリタニアイスラム共和国",
    answer:"ヌアクショット"
  },
  {
    content:"モザンビ―ク共和国",
    answer:"マプート"
  },
  {
    content:"モナコ公国",
    answer:"モナコ"
  },
  {
    content:"モルジブ共和国",
    answer:"マレ"
  },
  {
    content:"モルドバ共和国",
    answer:"キシニョフ"
  },
  {
    content:"モロッコ王国",
    answer:"ラバト"
  },
  {
    content:"モンゴル国",
    answer:"ウランバ-トル"
  },
  {
    content:"ユーゴスラビア連邦共和国",
    answer:"べオグラード"
  },
  {
    content:"ヨルダンハシミテ王国",
    answer:"アンマン"
  },
  {
    content:"ラオス人民民主共和国",
    answer:"ビエンチヤン"
  },
  {
    content:"ラトビア共和国",
    answer:"リガ"
  },
  {
    content:"リトアニア共和国",
    answer:"ビリニュス"
  },
  {
    content:"社会主義人民リビアアラブ国",
    answer:"トリポリ"
  },
  {
    content:"リヒテンシュタイン公国",
    answer:"ファドーツ"
  },
  {
    content:"リべリア共和国",
    answer:"モンロビア"
  },
  {
    content:"ルーマニア",
    answer:"ブカレスト"
  },
  {
    content:"ルクセンブルク大公国",
    answer:"ルクセンブルク"
  },
  {
    content:"ルワンダ共和国",
    answer:"キガリ"
  },
  {
    content:"レソト王国",
    answer:"マセル"
  },
  {
    content:"レバノン共和国 ",
    answer:"べイルート"
  },
  {
    content:"ロシア連邦",
    answer:"モスクワ"
  }
]

AnswerCandidates = [
  "レイキャビク",
  "ダブリン",
  "バクー",
  "カブ-ル",
  "ワシン卜ン",
  "アブダビ",
  "アルジェ",
  "ブエノスアイレス",
  "チラナ",
  "エレバン",
  "ルアンダ",
  "セントジョンズ",
  "アンドラ・ラ・べリャ",
  "サナア",
  "エルサレム",
  "ローマ",
  "バグダッド",
  "テヘラン",
  "ニュ-デリ-",
  "ジャカルタ",
  "カンパラ",
  "キエフ",
  "タシケント",
  "モンテビデオ",
  "キト",
  "カイロ",
  "タリン",
  "アジスアべバ",
  "アスマラ",
  "サンサルバドル",
  "ウイーン",
  "キャンべラ",
  "マスカット",
  "アムステルダム",
  "プライア",
  "アクラ",
  "ジョージタウン",
  "アルマトゥイ",
  "ドーハ",
  "オタワ",
  "リ-ブルビル",
  "ヤウンデ",
  "バンジュ-ル",
  "プノンぺン",
  "ビサオ",
  "コナクリ",
  "ニコシア",
  "ハバナ",
  "アテネ",
  "タラワ",
  "ビシュケク",
  "グアテマラシティ",
  "クウェ-ト",
  "トビリシ",
  "ロンドン",
  "セントジョージズ",
  "ザグレブ",
  "ナイロビ",
  "ヤムスクロ",
  "サンホセ",
  "モロニ",
  "サンタフェデボゴタ",
  "ブラザビル",
  "キンシヤサ",
  "リヤド",
  "サントメ",
  "ルサカ",
  "サンマリノ",
  "フリータウン",
  "ジブチ",
  "キングストン",
  "ダマスカス",
  "シンガポ-ル",
  "ハラーレ",
  "べルン",
  "ストックホルム",
  "ハルツーム",
  "マドリ-ド",
  "パラマリボ",
  "スリジャヤワルダナプラコッテ",
  "ブラチスラバ",
  "リュブリャナ",
  "ムババネ",
  "ビクトリア",
  "マラボ",
  "ダカ-ル",
  "バセテ一ル",
  "キングスタウン",
  "カストリーズ",
  "モガディシュ",
  "ホニアラ",
  "ソウル",
  "バンコク",
  "ドゥシャンべ",
  "ダルエスサラ-ム",
  "プラハ",
  "ンジャメナ",
  "ぺキン",
  "バンギ",
  "チュニス",
  "ピョンヤン",
  "サンチアゴ",
  "フナフチ",
  "コぺンハーゲン",
  "べルリン",
  "ロメ",
  "サントドミンゴ",
  "ロゾー",
  "ポートオブスペイン",
  "アシガバ‐ド",
  "アンカラ",
  "ヌクアロファ",
  "アブジャ",
  "ナウル",
  "ウイントフック",
  "マナグア",
  "ニアメ",
  "アピア",
  "東京",
  "ウェリントン",
  "カトマンズ",
  "オスロ",
  "マナーマ",
  "ポルトープランス",
  "イスラマバード",
  "バチカン",
  "パナマ",
  "ポートビラ",
  "ナッソー",
  "ポートモレスビー",
  "コロール",
  "アスンシオン",
  "ブリッジタウン",
  "ブダぺスト",
  "ダッカ",
  "テインプー",
  "スバ",
  "マニラ",
  "ヘルシンキ",
  "ブラジリア",
  "パリ",
  "ソフィア",
  "ワガドゥーグー",
  "バンダルスリブガワン",
  "ブジュンブラ",
  "ハノイ",
  "ポルトノボ",
  "カラカス",
  "ミンスク",
  "べルモパン",
  "リマ",
  "ブリュッセル",
  "ワルシャワ",
  "サラエボ",
  "ハボロ-ネ",
  "ラパス",
  "リスボン",
  "主市ビクトリア",
  "テグシガルパ",
  "マジュロ",
  "スコピエ",
  "アンタナナリボ",
  "リロングウェ",
  "バマコ",
  "バレッタ",
  "クアラルンプ-ル",
  "パリキール",
  "プレトリア",
  "ヤンゴン",
  "メキシコシティ",
  "ポートルイス",
  "ヌアクショット",
  "マプート",
  "モナコ",
  "マレ",
  "キシニョフ",
  "ラバト",
  "ウランバ-トル",
  "べオグラード",
  "アンマン",
  "ビエンチヤン",
  "リガ",
  "ビリニュス",
  "トリポリ",
  "ファドーツ",
  "モンロビア",
  "ブカレスト",
  "ルクセンブルク",
  "キガリ",
  "マセル",
  "べイルート",
  "モスクワ"
]

class Question extends Label
  constructor: ->
    super()
    @question = QuestionCandidates[Math.floor(Math.random() * QuestionCandidates.length)]
    @text = @question.content
    @font = "60px Serif"
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
    @textAlign = "center"
    @font = "40px Serif"

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

    @answers[0].moveTo(200, 480)
    @answers[1].moveTo(800, 480)
    @answers[2].moveTo(200, 620)
    @answers[3].moveTo(800, 620)

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
      core.gameOverScene = new GameOverScene(@score)
      core.replaceScene(core.gameOverScene)

class GameOverScene extends Scene
  constructor: (score) ->
    super()
    @bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    @bg.image = core.assets["game_over.png"]
    @addChild(@bg)

    @label       = new Label(score.toString())
    @label.font  = "80px Serif"
    @label.color = "white"
    @label.x     = (HQ_GAME_WIDTH - @label.width) / 2 + 100
    @label.y     = (HQ_GAME_HEIGHT - @label.height) / 2
    @addChild(@label)

  ontouchstart: ->
    core.replaceScene core.titleScene

window.onload = ->
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
  assets = []
  assets.push("title.png")
  assets.push("game.png")
  assets.push("game_over.png")
  assets.push("")
  core.preload assets

  core.onload = ->
    @titleScene = new TitleScene()
    @pushScene @titleScene

  core.start()
