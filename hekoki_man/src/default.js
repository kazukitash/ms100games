enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Fart = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 454, 169);
    this.image = core.assets["onara.png"];
    this.moveTo((HQ_GAME_WIDTH - this.width) / 2, HQ_GAME_HEIGHT - this.height - 20);
  },

  onenterframe: function(){
    this.tl
      .moveBy(2, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-2, 0, 3)
  }
});

var Player = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 351, 352);
    this.image = core.assets["hekoki-man.png"];
    this.moveTo((HQ_GAME_WIDTH - this.width) / 2 - 20, HQ_GAME_HEIGHT - this.height - 40);
    this.frame = 0;

    this.isMoving = false;
    this.hasMoved = false;
    this.vx = 0.0;
  },

  start: function(){
    this.isMoving = true;
  },

  onenterframe: function(){
    if(this.isMoving && !this.hasMoved){
      if(core.frame % 10 < 5){
        this.frame = 1;
      }else{
        this.frame = 2;
      }

      this.x += this.vx;
    }
  }
});

var PlayBG = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, HQ_GAME_WIDTH, 4000);
    this.image = core.assets["play-back.png"];
    this.y = HQ_GAME_HEIGHT - 4000;

    this.isMoving = false;
    this.hasMoved = false;
    this.vy = 0.0;
    this.g  = 0.8;
  },

  start: function(count){
    this.vy = - this.initialVelocityFromTouchCount(count);
    this.isMoving = true;
  },

  stop: function(){
    this.vy = 0;
    this.isMoving = false;
    this.hasMoved = true;
    this.stoppedAt = core.frame;
  },

  nextFrameY: function(){
    return this.y - this.vy;
  },

  initialVelocityFromTouchCount: function(count){
    var y = Math.pow(1.3, - count * 0.5);
    var a = 70;

    return a * (1 - y);
  },

  onenterframe: function(){
    if(HQ_GAME_HEIGHT - this.height < this.nextFrameY()){
    }else{
      if(this.isMoving){
        this.stop();
      }
    }

    if(this.isMoving){
      this.y -= this.vy;
      this.vy += this.g;
    }
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["title.png"];
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
    this.bg = new PlayBG();
    this.addChild(this.bg);

    this.fart = new Fart();
    this.fart.opacity = 0;
    this.addChild(this.fart);

    this.player = new Player();
    this.addChild(this.player);

    this.timer = new TimerLabel(5);
    this.timer.start();
    this.timer.font = "60px Serif";
    this.timer.moveTo(50, 50);
    this.addChild(this.timer);

    this.touchCount = 0;
  },

  ontouchstart: function(){
    if(this.timer.remainingSec() > 0){
      this.touchCount++;
    }
  },

  onenterframe: function(){
    if(this.timer.remainingSec() < 0){
      if(!this.bg.hasMoved && !this.bg.isMoving){
        this.bg.start(this.touchCount);
      }

      if(!this.player.isMoving){
        this.player.start();
        this.fart.opacity = 1.0;
      }

      this.removeChild(this.timer);
    }

    if(this.bg.vy > 0 && this.player.isMoving){
      this.player.hasMoved = true;
      this.fart.opacity = 0.0;
    }

    if(this.bg.stoppedAt + 1 * core.fps < core.frame){
      core.gameOverScene = new GameOverScene(this.touchCount);
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(count){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["gameover.png"];
    this.addChild(this.bg);

    this.label = new Label(count.toString());
    this.label.font = "120px Serif";
    this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2 + 100, (HQ_GAME_HEIGHT - this.label.height) / 2 - 100);
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
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

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("gameover.png");
  assets.push("play-back.png");
  assets.push("onara.png");
  assets.push("hekoki-man.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
