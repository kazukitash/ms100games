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
    this.x = GAME_WIDTH / 2 - this.width / 2;
    this.y = GAME_HEIGHT / 2 - this.height / 2;
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

var Carrot = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 443, 137);
    this.setCenter();
    this.image    = core.assets["ninjin.png"];
    this.cutImage = core.assets["ninjin2.png"];
    this.cutWidth = 513;
    this.cutHeight = 164;
  },

  cuttingCondition: function(e){
    return this.touchStartX < e.localX;
  }
});

var Eggplant = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 441, 143);
    this.setCenter();
    this.image    = core.assets["nasu.png"];
    this.cutImage = core.assets["nasu2.png"];
    this.cutWidth = 571;
    this.cutHeight = 231;
  },

  cuttingCondition: function(e){
    return this.touchStartX > e.localX;
  }
})

var Piment = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 157, 211);
    this.setCenter();
    this.image    = core.assets["piman.png"];
    this.cutImage = core.assets["piman2.png"];
    this.cutWidth = 222;
    this.cutHeight = 302;
  },

  cuttingCondition: function(e){
    return this.touchStartY > e.localY;
  }
})

var Tomato = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 204, 201);
    this.setCenter();
    this.image    = core.assets["tomato.png"];
    this.cutImage = core.assets["tomato2.png"];
    this.cutWidth = 225;
    this.cutHeight = 233;
  },

  cuttingCondition: function(e){
    return this.touchStartY < e.localY;
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this)
    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
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

    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["1min_cutting2.png"];
    this.addChild(this.bg);

    this.timerLabel = new Label(this.time.toString);
    this.timerLabel.font = "32px Serif"
    this.timerLabel.moveTo(80, 480);
    this.addChild(this.timerLabel);

    this.nextVegitable();
  },

  nextVegitable: function(){
    this.removeChild(this.vegitable);
    rand = (function(){ return Math.floor(Math.random() * 4)})();
    var vegitables = [Carrot, Eggplant, Piment, Tomato];
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
    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["1min_cutting3.png"];
    this.addChild(this.bg);

    this.score = new Label(score.toString());
    this.score.moveTo(220, 280);
    this.score.font = "84px Serif";
    this.score.color = "rgb(255, 255, 255)";
    this.addChild(this.score);

    this.medal = new Sprite(364, 398);
    this.medal.moveTo(400, 100);
    if(score > 40){
      this.medal.image = core.assets["gold.png"];
    }else if(score < 10){
      this.medal.image = core.assets["bronze.png"];
    }else{
      this.medal.image = core.assets["silver.png"];
    }
    this.addChild(this.medal);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(GAME_WIDTH, GAME_HEIGHT);
  assets = [];
  assets.push("ninjin.png");
  assets.push("ninjin2.png");
  assets.push("nasu.png");
  assets.push("nasu2.png");
  assets.push("piman.png");
  assets.push("piman2.png");
  assets.push("tomato.png");
  assets.push("tomato2.png");
  assets.push("bronze.png");
  assets.push("silver.png");
  assets.push("gold.png");
  assets.push("title.png");
  assets.push("1min_cutting2.png");
  assets.push("1min_cutting3.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
