enchant();

var Vegitable = enchant.Class.create(enchant.Sprite, {
  cut: function(){
    this.image    = this.cutImage;
    this.width    = this.cutWidth;
    this.height   = this.cutHeight;
    this.isCut    = true;
    this.isFading = true;
  },

  fade: function(){
    if(this.opacity > 0){
      this.opacity -= 0.1;
    }else{
      this.isFading = false;
    }
  },

  setCenter: function(){
    this.x = HQ_GAME_WIDTH / 2 - this.width / 2;
    this.y = HQ_GAME_HEIGHT / 2 - this.height / 2;
  },

  ontouchstart: function(e){
    this.touchStartX = e.localX;
    this.touchStartY = e.localY;
    this.isCut       = false;
    this.isFading    = false;
  },

  ontouchend: function(e){
    if(this.cuttingCondition(e)){
      this.cut();
      this.setCenter();
    }
  },

  onenterframe: function(){
    if(this.isCut && this.isFading){
      this.fade();
    }else if(this.isFading){
      this.scale(0.9, 0.9);
    }
  }
});

var RightCut = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 211, 244);
    this.setCenter();
    this.image    = core.assets["ringo1.png"];
    this.cutImage = core.assets["ringo2.png"];
    this.cutWidth = 256;
    this.cutHeight = 277;
  },

  cuttingCondition: function(e){
    return this.touchStartX < e.localX;
  }
});

var LeftCut = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 236, 264);
    this.setCenter();
    this.image    = core.assets["meron1.png"];
    this.cutImage = core.assets["meron2.png"];
    this.cutWidth = 282;
    this.cutHeight = 278;
  },

  cuttingCondition: function(e){
    return this.touchStartX > e.localX;
  }
})

var UpCut = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 274, 229);
    this.setCenter();
    this.image    = core.assets["kaki1.png"];
    this.cutImage = core.assets["kaki2.png"];
    this.cutWidth = 305;
    this.cutHeight = 278;
  },

  cuttingCondition: function(e){
    return this.touchStartY > e.localY;
  }
})

var DownCut = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 203, 254);
    this.setCenter();
    this.image    = core.assets["ichigo1.png"];
    this.cutImage = core.assets["ichigo2.png"];
    this.cutWidth = 233;
    this.cutHeight = 289;
  },

  cuttingCondition: function(e){
    return this.touchStartY < e.localY;
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this)
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["title.png"];
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.cuttingScene = new CuttingScene(core);
    core.replaceScene(core.cuttingScene);
  }
});

var CuttingScene = enchant.Class.create(Scene, {
  initialize: function(){
    enchant.Scene.call(this);

    this.score = 0;
    this.time = 60;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.timerLabel = new Label(this.time.toString);
    this.timerLabel.font = "48px Serif"
    this.timerLabel.moveTo(87, 595);
    this.addChild(this.timerLabel);

    this.nextVegitable();
  },

  nextVegitable: function(){
    this.removeChild(this.vegitable);
    rand = (function(){ return Math.floor(Math.random() * 4)})();
    var vegitables = [RightCut, LeftCut, UpCut, DownCut];
    this.vegitable = new vegitables[rand](core);
    this.addChild(this.vegitable);
  },

  onenterframe: function(){
    if(this.vegitable.isCut && ! this.vegitable.isFading){
      this.score++;
      this.nextVegitable();
    }

    if(this.time > 0){
      this.timerLabel.text = Math.floor(this.time);
      this.time -= 1 / core.fps;
    }else{
      core.replaceScene(new GameOverScene(this.score));
    }
  }
})

var GameOverScene = enchant.Class.create(enchant.Scene, {
  initialize: function(score){
    enchant.Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.score = new Label(score.toString());
    this.score.moveTo(600, 400);
    this.score.font = "84px Serif";
    this.score.color = "rgb(255, 255, 255)";
    this.addChild(this.score);

    this.medal = new Sprite(364, 398);
    this.medal.moveTo(400, 100);
    this.addChild(this.medal);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  assets = [];
  assets.push("title.png");
  assets.push("game_over.png");
  assets.push("game.png");
  assets.push("ichigo1.png");
  assets.push("ichigo2.png");
  assets.push("kaki1.png");
  assets.push("kaki2.png");
  assets.push("meron1.png");
  assets.push("meron2.png");
  assets.push("ringo1.png");
  assets.push("ringo2.png");
  assets.push("");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
