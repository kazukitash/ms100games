enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Piku = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 151, 126);
    this.image = core.assets["piku.png"];
    this.moveTo(300, 300);
    this.baseX = this.x;
    this.baseY = this.y;
  },

  onenterframe: function(){
    this.x = this.baseX + 10 * Math.random();
    this.y = this.baseY + 10 * Math.random();
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["title.png"];
    this.addChild(this.bg);
  },

  ontouchstart:  function(){
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);
    this.pikuStartAt   = core.frame + Math.floor(5 * core.fps * Math.random() + 5 * core.fps);
    this.battleStartAt = Infinity;
    this.count = 0;
  },

  startBattle: function(){
    this.battleStartAt = core.frame;
  },

  isBattle: function(){
    return this.battleStartAt <= core.frame;
  },

  isPiku: function(){
    return this.pikuStartAt < core.frame && ! this.isBattle();
  },

  isStable: function(){
    return ! this.isPiku() && ! this.isBattle()
  },

  onenterframe: function(){
    if(this.pikuStartAt == core.frame){
      this.piku = new Piku();
      this.addChild(this.piku);
    }
  },

  ontouchstart: function(){
    if(this.isPiku()){
      this.count++;

      if(this.count > 10){
        core.gameOverScene = new GameOverScene(core.frame - this.pikuStartAt);
        core.replaceScene(core.gameOverScene);
      }
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(count){
    Scene.call(this);
    this.battleTime = count;
    this.startAt = core.frame;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.label = new Label();
    this.label.font = "80px Serif";
    this.label.color = "rgb(22, 58, 142)";
    this.label.x = (HQ_GAME_WIDTH - this.label.width) / 2 + 50;
    this.label.y = (HQ_GAME_HEIGHT - this.label.height) / 2 - 80;
    var score = 500000 / Math.pow(- this.battleTime, 2)
    if(score < 1){
      score = 1;
    }
    this.label.text = score.toFixed();
    this.addChild(this.label);
  },

  ontouchstart: function(){
    if(this.startAt + core.fps < core.frame){
      core.replaceScene(core.titleScene);
    }
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("piku.png");
  assets.push("");
  assets.push("");
  assets.push("");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    // this.titleScene = new GameOverScene(100);
    this.pushScene(this.titleScene);
  };

  core.start();
};