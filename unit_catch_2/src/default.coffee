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
  {content:"あんどん", answer:" 基（き）・灯（とう）"},
  {content:"うさぎ　", answer:" 軒（けん）・戸（こ）・棟（むね・とう）"},
  {content:"うどん　　", answer:"  杯（はい）・匹（ひき）"},
  {content:"エレべータ―　", answer:"  杯（はい）・瓶（へい）"},
  {content:"エンジン　", answer:"  体（たい）"},
  {content:"位牌（いはい）　", answer:" 脚（きゃく）"},
  {content:"椅子（いす）　", answer:"  体（たい）"},
  {content:"遺骨", answer:" 本（ほん）・巻（まき）"},
  {content:"遺体　", answer:"  頭（とう）・匹（ひき）"},
  {content:"稲　", answer:" 株（かぶ）・本（ほん）"},
  {content:"印判　", answer:"  柱（はしら）"},
  {content:"宇宙船　　", answer:"  株（かぶ）・鉢（はち）"},
  {content:"烏賊（いか）", answer:" 顆（か）・本（ほん）"},
  {content:"臼（うす）　　", answer:"  羽（わ）・匹（ひき）"},
  {content:"映画", answer:" 頭（とう）・匹（ひき）"},
  {content:"演劇　", answer:"  基（き）"},
  {content:"家", answer:"  機（き）"},
  {content:"額　", answer:" （なま）玉（たま）・重（じゅう）、（めんの束）把（わ）、（料理）杯（はい）・丁（ちょう）"},
  {content:"掛け軸", answer:"  頭（とう）・匹（ひき）・騎（き）"},
  {content:"牛　　", answer:"  本（ほん）・巻（かん）"},
  {content:"鏡", answer:"  基（き）・台（だい）"},
  {content:"鏡餅（かがみもち）　", answer:" 幕（まく）・本（ほん）"},
  {content:"犬　", answer:" 基（き）・台（だい）"},
  {content:"糸　", answer:" 本（ほん）・面（めん）"},
  {content:"植木　", answer:"  挺（ちょう）"},
  {content:"生け花", answer:"  本（ほん）"},
  {content:"折詰　", answer:"  個（こ）・折（おり）"},
  {content:"扇　", answer:" 面（めん）"},
  {content:"帯　", answer:" 重（かさね）　"},
  {content:"馬　", answer:" 面（めん）・架（か）　"},
  {content:"斧（おの）　", answer:" 本（ほん）・軸（じく）・対（つい）・幅（ふく）"},
  {content:"駕籠（かご）", answer:" 挺（ちょう）　"},
  {content:"傘", answer:"  本（ほん）、（和傘）張（はり）　"},
  {content:"カセット", answer:" 本（ほん）　"},
  {content:"刀", answer:"  本（ほん）・振（ふり）・腰（こし）　"},
  {content:"かつお節　", answer:"  本（ほん）・折（おり）　"},
  {content:"鐘（かね）　", answer:" 口（こう）　"},
  {content:"鎌　", answer:" 挺（ちょう）・本（ほん）　"},
  {content:"神　", answer:" 柱（はしら）・体（たい）　"},
  {content:"紙　", answer:" 枚（まい）・葉（よう）"},
  {content:"かみそり　", answer:"  挺（ちょう）"},
  {content:"カメラ　", answer:" 台（だい）"},
  {content:"棺（かん）", answer:"  基（き）"},
  {content:"木・樹木　", answer:"  本（ほん）・株（かぶ）　"},
  {content:"議案", answer:" 件（けん）　"},
  {content:"寄付　　", answer:" 口（くち）"},
  {content:"着物　", answer:"  枚（まい）"},
  {content:"鏡台　", answer:"  基（き）・台（だい）"},
  {content:"櫛（くし）　", answer:" 枚（まい）・具（ぐ）"},
  {content:"鯨", answer:"  頭（とう）　"},
  {content:"薬　", answer:" （服用する場合）服（ふく）・回（かい）、（粉薬）包（つつみ）、　　　　　　　（丸薬）粒（りゅう・つぶ）、（錠剤）錠（じょう）　"},
  {content:"靴・靴下　", answer:"  足（そく）"},
  {content:"グラウンド", answer:"  面（めん）"},
  {content:"鍬（くわ）", answer:"  挺（ちょう）・本（ほん）"},
  {content:"原子炉", answer:"  基（き）"},
  {content:"碁　", answer:" （対局）局（きょく）・番（ばん）、（手数）手（て）、（盤）面（めん）　"},
  {content:"鯉幟（こいのぼり）", answer:"  匹（ひき）"},
  {content:"口座", answer:" 口（くち）"},
  {content:"校正", answer:" 校（こう）"},
  {content:"琴　", answer:" 張（はり・ちょう）・面（めん）"},
  {content:"コンピュ―ター　", answer:" 台（だい）"},
  {content:"さお", answer:" 本（ほん）・竿（かん）"},
  {content:"魚", answer:"  匹（ひき）・尾（び）"},
  {content:"酒　", answer:" 本（ほん）、（酒杯）杯（はい）・献（こん）、（酒席）席（せき）"},
  {content:"ざるそば", answer:" 枚（まい）"},
  {content:"詩　", answer:" 　編（へん）"},
  {content:"寺院", answer:" 寺（じ）・山（さん）、（お堂）宇（う）"},
  {content:"敷物　", answer:"  枚（まい）"},
  {content:"事件", answer:" 件（けん）"},
  {content:"下着", answer:" 枚（まい）"},
  {content:"自転車", answer:"  台（だい）"},
  {content:"自動車", answer:"  台（だい）"},
  {content:"芝居（しばい）", answer:"  幕（まく）・本（ほん）"},
  {content:"三味線　", answer:" 棹（さお）・挺（ちょう）"},
  {content:"銃　", answer:" 挺（ちょう）"},
  {content:"重箱　", answer:"  重（かさね・じゅう）・組（くみ）"},
  {content:"数珠（じゅず）", answer:"  具（ぐ）・連（れん）"},
  {content:"将棋　", answer:"  （勝負）局（きょく）・番（ばん）"},
  {content:"小説　", answer:"  編（へん）・巻（かん）"},
  {content:"証文　", answer:"  札（さつ）・通（つう）"},
  {content:"書画", answer:" 点（てん）・幅（ふく）"},
  {content:"食事", answer:" 食（しょく）、（口に運ぶ量）口（くち）・箸（はし）・匙（さじ）"},
  {content:"書籍　", answer:"  冊（さつ）・部（ぶ）・巻（かん）"},
  {content:"書類　", answer:"  通（つう）・部（ぶ）"},
  {content:"神社　", answer:"  社（しゃ）・座（ざ）"},
  {content:"真珠　", answer:"  粒（つぶ）"},
  {content:"新聞　", answer:"  部（ぶ）、（紙面）面（めん）、（種類）紙（し）　"},
  {content:"吸い物　", answer:" 椀（わん）・碗（わん）"},
  {content:"鋤（すき）　", answer:" 挺（ちょう）・本（ほん）"},
  {content:"スキー", answer:"  本（ほん）、（二本一組みで）台（だい）"},
  {content:"硯（すずり）　", answer:"  個（こ）・面（めん）"},
  {content:"ズボン　", answer:" 本（ほん）"},
  {content:"炭　", answer:" 俵（ひょう）・駄（だ）"},
  {content:"墨", answer:"  挺（ちょう）・本（ほん）"},
  {content:"相撲", answer:" （勝負）番（ばん）"},
  {content:"背広　", answer:"  着（ちゃく）"},
  {content:"そうめん", answer:" 束（たば）・把（わ）"},
  {content:"ソフトウェア", answer:" 　本（ほん）"},
  {content:"そろばん　", answer:"  挺（ちょう）・面（めん）"},
  {content:"田", answer:"  面（めん）・枚（まい）"},
  {content:"太鼓", answer:" 張（はり）・個（こ）・台（だい）"},
  {content:"蛸（たこ）　", answer:" 杯（はい）・匹（ひき）"},
  {content:"畳　", answer:" 枚（まい）・畳（じょう）"},
  {content:"建物　", answer:"  棟（むね）、（住居単位）戸（こ）・軒（けん）"},
  {content:"足袋（たび）　", answer:"  足（そく）"},
  {content:"たんす", answer:"  本（ほん）・棹（さお）"},
  {content:"反物　　", answer:" 反（たん）・本（ほん）　"},
  {content:"茶　", answer:" 袋（ふくろ）・缶（かん）、（飲む場合）服（ふく）"},
  {content:"茶器　", answer:"  組（くみ）・揃（そろい）"},
  {content:"ちょうちん", answer:"  張（はり・ちょう）　"},
  {content:"机", answer:"  脚（きゃく）"},
  {content:"綱　", answer:" 筋（すじ）　"},
  {content:"壷（つぼ）　", answer:" 口（く・こう）"},
  {content:"手形　", answer:"  通（つう）"},
  {content:"手紙　", answer:"  通（つう）・札（さつ）"},
  {content:"鉄道路線　", answer:"  本（ほん）・条（じょう）"},
  {content:"テニスコート", answer:" 面（めん）"},
  {content:"手袋（てぶくろ）", answer:" 組（くみ）"},
  {content:"テレビ　", answer:" 台（だい）　"},
  {content:"電車・車両", answer:"  両（りょう）、（運行）本（ほん）"},
  {content:"テント　", answer:" 張（はり）"},
  {content:"電話　", answer:"  （器具）台（だい）、（回線）本（ほん）、（通話数）度（ど）"},
  {content:"灯台　", answer:"  基（き）"},
  {content:"投票　", answer:"  票（ひょう）"},
  {content:"豆腐　", answer:"  丁（ちょう）"},
  {content:"灯籠（とうろう）", answer:" 基（き）"},
  {content:"土地登記　", answer:"  筆（ひつ）"},
  {content:"鳥　", answer:" 羽（わ）、（雌雄で）番（つがい）　"},
  {content:"鳥居　", answer:"  基（き）"},
  {content:"苗", answer:"  株（かぶ）・本（ほん）・束（たば）"},
  {content:"長持　", answer:"  棹（さお）"},
  {content:"縄　", answer:" 筋（すじ）・把（わ）"},
  {content:"荷物　", answer:"  梱（こり）・荷（か）・駄（だ）"},
  {content:"鶏　", answer:" 羽（わ）"},
  {content:"人形　", answer:"  個（こ）・体（たい）"},
  {content:"縫い目　", answer:" 針（はり）・目（め）"},
  {content:"ネクタイ", answer:" 本（ほん）"},
  {content:"年齢　", answer:"  歳（さい）"},
  {content:"のこぎり　　", answer:" 挺（ちょう）・本（ほん）"},
  {content:"幟（のぼり）　　", answer:" 本（ほん）"},
  {content:"海苔（のり）　", answer:"  枚（まい）、帖（じょう）（十枚）"},
  {content:"のれん", answer:"  枚（まい）・張（はり）"},
  {content:"バイオリン　", answer:" 挺（ちょう）"},
  {content:"俳句　　", answer:" 句（く）"},
  {content:"羽織　", answer:"  領（りょう）・枚（まい）"},
  {content:"墓　", answer:" 基（き）"},
  {content:"はがき　", answer:" 通（つう）・枚（まい）・葉（よう）"},
  {content:"はかま　", answer:" 具（ぐ）・腰（こし）"},
  {content:"はさみ　", answer:" 挺（ちょう）"},
  {content:"箸（はし）　　　", answer:" 膳（ぜん）・揃（そろい）"},
  {content:"旗　", answer:" 棹（さお）・竿（さお）・旒（りゅう）・本（ほん）・流（ながれ）"},
  {content:"花", answer:"  枝（えだ）・輪（りん）・本（ほん）"},
  {content:"花輪", answer:" 基（き）"},
  {content:"番組", answer:" 本（ほん）"},
  {content:"半紙　", answer:"  枚（まい）・帖（じょう）（二十枚）、（束の場合）締（しめ）・束（たば）"},
  {content:"ピアノ　", answer:" 台（だい）"},
  {content:"飛行機　", answer:" 機（き）・台（だい）"},
  {content:"火箸（ひばし）　　", answer:"  具（ぐ）・対（つい）・揃（そろい）"},
  {content:"屏風（びょうぶ）", answer:" 双（そう）・帖（じょう）・隻（せき）"},
  {content:"琵琶（びわ）", answer:" 面（めん）・揃（そろい）"},
  {content:"フィルム", answer:" 卷（かん）・本（ほん）"},
  {content:"封書　", answer:"  通（つう）・封（ふう）"},
  {content:"プール", answer:"  面（めん）"},
  {content:"笛　", answer:" 管（かん）・本（ほん）"},
  {content:"仏像　", answer:"  躯（く）・体（たい）・座（ざ）"},
  {content:"筆", answer:"  本（ほん）・管（かん）"},
  {content:"ぶどう　", answer:" 房（ふさ）・粒（つぶ）"},
  {content:"布団", answer:" 重（かさね）・枚（まい）・揃（そろい）・組（くみ）"},
  {content:"船　　", answer:"  隻（せき）・艘（そう）"},
  {content:"ふんどし　", answer:"  本（ほん）"},
  {content:"ベッド　", answer:" 台（だい）・床（しょう）"},
  {content:"宝石", answer:" 顆（か）・石（せき）・粒（りゅう）"},
  {content:"包丁　", answer:"  本（ほん）・挺（ちょう）"},
  {content:"盆　", answer:" 枚（まい）"},
  {content:"盆栽　", answer:"  鉢（はち）"},
  {content:"巻物　　", answer:" 軸（じく）・巻（かん）"},
  {content:"幕　", answer:" 張（はり・ちょう）・帖（じょう）"},
  {content:"マネキン　", answer:"  体（たい）"},
  {content:"マンション　", answer:" 棟（むね）・戸（こ）・室（しつ）"},
  {content:"みこし　", answer:" 挺（ちょう）・基（き）"},
  {content:"水着", answer:" 枚（まい）"},
  {content:"むしろ", answer:"  枚（まい）"},
  {content:"名刺　", answer:"  枚（まい）・葉（よう）"},
  {content:"目録　", answer:"  通（つう）"},
  {content:"盛りそば　", answer:"  枚（まい）"},
  {content:"矢　", answer:" 本（ほん）・筋（すじ）・条（じょう）、（二本で）手（て）"},
  {content:"槍（やり）　", answer:" 本（ほん）・筋（すじ）・条（じょう）"},
  {content:"弓　", answer:" 張（はり・ちょう）"},
  {content:"ようかん　", answer:"  棹（さお）・本（ほん）、（切ったもの）切（きれ）"},
  {content:"鎧（よろい）　", answer:"  具（ぐ）・領（りょう）"},
  {content:"ラジオ　", answer:" 台（だい）"},
  {content:"料理　", answer:"  皿（さら）・品（ひん・しな）・人前（にんまえ）"},
  {content:"冷蔵庫　", answer:" 台（だい）"},
  {content:"櫓（ろ）　", answer:"  挺（ちょう）"},
  {content:"ろうそく　", answer:"  本（ほん）、束（そく）（百本）"},
  {content:"ロケット　　", answer:" 発（はつ）・基（き）"},
  {content:"論文　", answer:"  編（へん）・本（ほん）"},
  {content:"ワープロ", answer:" 台（だい）"},
  {content:"和歌　", answer:"  首（しゅ）"},
  {content:"椀（わん）　", answer:" 口（く）・客（きゃく）"}
]

AnswerCandidates = [
  "基（き）・灯（とう）",
  "軒（けん）・戸（こ）・棟（むね・とう）",
  "杯（はい）・匹（ひき）",
  "杯（はい）・瓶（へい）",
  "体（たい）",
  "脚（きゃく）",
  "体（たい）",
  "本（ほん）・巻（まき）",
  "頭（とう）・匹（ひき）",
  "株（かぶ）・本（ほん）",
  "柱（はしら）",
  "株（かぶ）・鉢（はち）",
  "顆（か）・本（ほん）",
  "羽（わ）・匹（ひき）",
  "頭（とう）・匹（ひき）",
  "基（き）",
  "機（き）",
  "（なま）玉（たま）・重（じゅう）、（めんの束）把（わ）、（料理）杯（はい）・丁（ちょう）",
  "頭（とう）・匹（ひき）・騎（き）",
  "本（ほん）・巻（かん）",
  "基（き）・台（だい）",
  "幕（まく）・本（ほん）",
  "基（き）・台（だい）",
  "本（ほん）・面（めん）",
  "挺（ちょう）",
  "本（ほん）",
  "個（こ）・折（おり）",
  "面（めん）",
  "重（かさね）　",
  "面（めん）・架（か）　",
  "本（ほん）・軸（じく）・対（つい）・幅（ふく）",
  "挺（ちょう）　",
  "本（ほん）、（和傘）張（はり）　",
  "本（ほん）　",
  "本（ほん）・振（ふり）・腰（こし）　",
  "本（ほん）・折（おり）　",
  "口（こう）　",
  "挺（ちょう）・本（ほん）　",
  "柱（はしら）・体（たい）　",
  "枚（まい）・葉（よう）",
  "挺（ちょう）",
  "台（だい）",
  "基（き）",
  "本（ほん）・株（かぶ）　",
  "件（けん）　",
  "口（くち）",
  "枚（まい）",
  "基（き）・台（だい）",
  "枚（まい）・具（ぐ）",
  "頭（とう）　",
  "（服用する場合）服（ふく）・回（かい）、（粉薬）包（つつみ）、　　　　　　　（丸薬）粒（りゅう・つぶ）、（錠剤）錠（じょう）　",
  "足（そく）",
  "面（めん）",
  "挺（ちょう）・本（ほん）",
  "基（き）",
  "（対局）局（きょく）・番（ばん）、（手数）手（て）、（盤）面（めん）　",
  "匹（ひき）",
  "口（くち）",
  "校（こう）",
  "張（はり・ちょう）・面（めん）",
  "台（だい）",
  "本（ほん）・竿（かん）",
  "匹（ひき）・尾（び）",
  "本（ほん）、（酒杯）杯（はい）・献（こん）、（酒席）席（せき）",
  "枚（まい）",
  "　編（へん）",
  "寺（じ）・山（さん）、（お堂）宇（う）",
  "枚（まい）",
  "件（けん）",
  "枚（まい）",
  "台（だい）",
  "台（だい）",
  "幕（まく）・本（ほん）",
  "棹（さお）・挺（ちょう）",
  "挺（ちょう）",
  "重（かさね・じゅう）・組（くみ）",
  "具（ぐ）・連（れん）",
  "（勝負）局（きょく）・番（ばん）",
  "編（へん）・巻（かん）",
  "札（さつ）・通（つう）",
  "点（てん）・幅（ふく）",
  "食（しょく）、（口に運ぶ量）口（くち）・箸（はし）・匙（さじ）",
  "冊（さつ）・部（ぶ）・巻（かん）",
  "通（つう）・部（ぶ）",
  "社（しゃ）・座（ざ）",
  "粒（つぶ）",
  "部（ぶ）、（紙面）面（めん）、（種類）紙（し）　",
  "椀（わん）・碗（わん）",
  "挺（ちょう）・本（ほん）",
  "本（ほん）、（二本一組みで）台（だい）",
  "個（こ）・面（めん）",
  "本（ほん）",
  "俵（ひょう）・駄（だ）",
  "挺（ちょう）・本（ほん）",
  "（勝負）番（ばん）",
  "着（ちゃく）",
  "束（たば）・把（わ）",
  "　本（ほん）",
  "挺（ちょう）・面（めん）",
  "面（めん）・枚（まい）",
  "張（はり）・個（こ）・台（だい）",
  "杯（はい）・匹（ひき）",
  "枚（まい）・畳（じょう）",
  "棟（むね）、（住居単位）戸（こ）・軒（けん）",
  "足（そく）",
  "本（ほん）・棹（さお）",
  "反（たん）・本（ほん）　",
  "袋（ふくろ）・缶（かん）、（飲む場合）服（ふく）",
  "組（くみ）・揃（そろい）",
  "張（はり・ちょう）　",
  "脚（きゃく）",
  "筋（すじ）　",
  "口（く・こう）",
  "通（つう）",
  "通（つう）・札（さつ）",
  "本（ほん）・条（じょう）",
  "面（めん）",
  "組（くみ）",
  "台（だい）　",
  "両（りょう）、（運行）本（ほん）",
  "張（はり）",
  "（器具）台（だい）、（回線）本（ほん）、（通話数）度（ど）",
  "基（き）",
  "票（ひょう）",
  "丁（ちょう）",
  "基（き）",
  "筆（ひつ）",
  "羽（わ）、（雌雄で）番（つがい）　",
  "基（き）",
  "株（かぶ）・本（ほん）・束（たば）",
  "棹（さお）",
  "筋（すじ）・把（わ）",
  "梱（こり）・荷（か）・駄（だ）",
  "羽（わ）",
  "個（こ）・体（たい）",
  "針（はり）・目（め）",
  "本（ほん）",
  "歳（さい）",
  "挺（ちょう）・本（ほん）",
  "本（ほん）",
  "枚（まい）、帖（じょう）（十枚）",
  "枚（まい）・張（はり）",
  "挺（ちょう）",
  "句（く）",
  "領（りょう）・枚（まい）",
  "基（き）",
  "通（つう）・枚（まい）・葉（よう）",
  "具（ぐ）・腰（こし）",
  "挺（ちょう）",
  "膳（ぜん）・揃（そろい）",
  "棹（さお）・竿（さお）・旒（りゅう）・本（ほん）・流（ながれ）",
  "枝（えだ）・輪（りん）・本（ほん）",
  "基（き）",
  "本（ほん）",
  "枚（まい）・帖（じょう）（二十枚）、（束の場合）締（しめ）・束（たば）",
  "台（だい）",
  "機（き）・台（だい）",
  "具（ぐ）・対（つい）・揃（そろい）",
  "双（そう）・帖（じょう）・隻（せき）",
  "面（めん）・揃（そろい）",
  "卷（かん）・本（ほん）",
  "通（つう）・封（ふう）",
  "面（めん）",
  "管（かん）・本（ほん）",
  "躯（く）・体（たい）・座（ざ）",
  "本（ほん）・管（かん）",
  "房（ふさ）・粒（つぶ）",
  "重（かさね）・枚（まい）・揃（そろい）・組（くみ）",
  "隻（せき）・艘（そう）",
  "本（ほん）",
  "台（だい）・床（しょう）",
  "顆（か）・石（せき）・粒（りゅう）",
  "本（ほん）・挺（ちょう）",
  "枚（まい）",
  "鉢（はち）",
  "軸（じく）・巻（かん）",
  "張（はり・ちょう）・帖（じょう）",
  "体（たい）",
  "棟（むね）・戸（こ）・室（しつ）",
  "挺（ちょう）・基（き）",
  "枚（まい）",
  "枚（まい）",
  "枚（まい）・葉（よう）",
  "通（つう）",
  "枚（まい）",
  "本（ほん）・筋（すじ）・条（じょう）、（二本で）手（て）",
  "本（ほん）・筋（すじ）・条（じょう）",
  "張（はり・ちょう）",
  "棹（さお）・本（ほん）、（切ったもの）切（きれ）",
  "具（ぐ）・領（りょう）",
  "台（だい）",
  "皿（さら）・品（ひん・しな）・人前（にんまえ）",
  "台（だい）",
  "挺（ちょう）",
  "本（ほん）、束（そく）（百本）",
  "発（はつ）・基（き）",
  "編（へん）・本（ほん）",
  "台（だい）",
  "首（しゅ）",
  "口（く）・客（きゃく）"
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
    @width = 600
    @textAlign = "center"
    @font = "20px Serif"

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

    @answers[0].moveTo(30, 480)
    @answers[1].moveTo(700, 480)
    @answers[2].moveTo(30, 620)
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
