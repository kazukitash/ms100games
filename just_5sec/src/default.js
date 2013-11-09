enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var TimerLabel = enchant.Class.create(Label, {
  initialize: function(timeLimit){
    Label.call(this);
    this.timeLimit = timeLimit;
    this.remainingFrame = timeLimit * core.fps;

    this.isStarted = false;
  },

  start: function(){
    this.isStarted = true;
    this.startAt = core.frame;
  },

  currentFrame: function(){
    return this.startAt + this.remainingFrame - core.frame;
  },

  remainingSec: function(){
    return this.currentFrame() / core.fps;
  },

  percentage: function(){
    return this.currentFrame / this.timeLimit / core.fps;
  },

  onenterframe: function(){
    if(this.isStarted){
      this.text = Math.floor(this.remainingSec()).toString();
    }
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["title.png"]
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["play.png"]
    this.addChild(this.bg);

    this.timer = new TimerLabel(5, core.frame);
    this.timer.moveTo(600, 300);
    this.timer.font = "60px Serif";
    this.timer.opacity = 0;
    this.addChild(this.timer);

    this.button = new Sprite(179, 90);
    this.button.image = core.assets["btn.png"];
    this.button.frame = 1;
    this.button.moveTo((HQ_GAME_WIDTH - this.button.width) / 2, HQ_GAME_HEIGHT - this.button.height - 100);
    this.addChild(this.button);

    this.isStarted = false;
  },

  ontouchstart: function(){
    if(this.isStarted){
      console.log(this.timer.remainingSec());
      core.gameOverScene = new GameOverScene(5.0 - this.timer.remainingSec());
      core.replaceScene(core.gameOverScene);
    }else{
      var _this = this;

      this.timer.start(core.frame);
      this.button.frame = 2;
      this.isStarted = true;

      this.mesuringMessage = new Sprite(653, 151);
      this.mesuringMessage.image = core.assets["play-text.png"];
      this.mesuringMessage.moveTo((HQ_GAME_WIDTH - this.mesuringMessage.width) / 2, (HQ_GAME_HEIGHT - this.mesuringMessage.height) / 2);
      this.mesuringMessage.addEventListener("enterframe", function(){
        if(_this.timer.currentFrame() % 20 < 18){
          this.opacity = 1.0;
        }else{
          this.opacity = 0.0;
        }
      })
      this.addChild(this.mesuringMessage);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(sec){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["gameover-img.png"];
    this.addChild(this.bg);

    this.label = new Label(sec.toFixed(2));
    this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, 300);
    this.label.font = "120px Serif";
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  core.fps = 29;
  var assets = [];
  assets.push("title.png");
  assets.push("play.png");
  assets.push("btn.png");
  assets.push("gameover-img.png");
  assets.push("gameover-text.png");
  assets.push("play-text.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
