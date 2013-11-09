enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var CountDownTimer = enchant.Class.create(Label, {
  initialize: function(sec) {
    Label.call(this);

    this.frame   = sec * core.fps;
    this.startAt = Infinity;
  },

  start: function(){
    this.startAt = core.frame;
  },

  isStarted: function(){
    return this.startAt < core.frame;
  },

  remainingFrame: function(){
    return this.frame - core.frame + this.startAt;
  },

  remainingSec: function(){
    return this.remainingFrame() / core.fps;
  },

  onenterframe: function(){
    this.text = this.remainingSec().toFixed(2);

    if(this.remainingFrame() == 0){
      var e = new Event("over");
      this.dispatchEvent(e);
    }
  }
});

var Tissue = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 714 ,249);
    this.image = core.assets["tissue1.png"];
    this.moveTo(270, 160);

    this.initialX = this.x;
    this.initialY = this.y;
  },

  isGone: function(){
    var x, y;
    x = true ;
    y = - 30 > this.y - this.initialY;

    return x && y;
  },

  ontouchmove: function(e){
    this.x = e.x - this.width / 2;
    this.y = e.y - this.height / 2;
    this.opacity -= 0.05
  },

  ontouchend: function(e){
    if(this.isGone()){
      var e = new Event("gone");
      this.dispatchEvent(e);
    }
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
    var _this = this;
    var tissueLength = 100;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.count = 0;

    this.timer = new CountDownTimer(10);
    this.timer.x = 90;
    this.timer.y = 80;
    this.timer.font = "60px Serif";
    this.timer.start();
    this.addChild(this.timer);

    this.tissues = [];

    for(var i = 0; i < tissueLength; i++){
      var tissue = new Tissue();
      tissue.addEventListener("gone", function(){
        _this.count++;
        _this.removeChild(this);
      });
      this.tissues.push(tissue);
      this.addChild(tissue);
    };

    this.timer.addEventListener("over", function(){
      core.gameOverScene = new GameOverScene(_this.count);
      core.replaceScene(core.gameOverScene);
    })
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(count){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.label = new Label(count.toString());
    this.label.font = "80px Serif";
    this.label.x = (HQ_GAME_WIDTH + this.label.width) / 2 - 150;
    this.label.y = (HQ_GAME_HEIGHT + this.label.height) / 2 + 30;

    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("tissue1.png");
  assets.push("tissue2.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};