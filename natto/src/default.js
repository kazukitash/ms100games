enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this);
  }
});

var CountDownTimer = enchant.Class.create(Label, {
  initialize: function(sec) {
    Label.call(this);

    this.frame   = sec * core.fps;
    this.startAt = Infinity;
    this.stopAt  = Infinity;
  },

  start: function(){
    this.startAt = core.frame;
  },

  stop: function(){
    this.stopAt = core.frame;
  },

  isStarted: function(){
    return this.startAt < core.frame;
  },

  isStopped: function(){
    return this.stopAt < core.frame;
  },

  remainingFrame: function(){
    return this.frame - core.frame + this.startAt;
  },

  remainingSec: function(){
    return this.remainingFrame() / core.fps;
  },

  onenterframe: function(){
    if(!this.isStopped()){
      this.text = this.remainingSec().toFixed(2);
    }

    if(this.remainingFrame() == 0){
      this.stop();

      var e = new Event("over");
      this.dispatchEvent(e);
    }
  }
});

var Natto = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 471, 93);
    this.image = core.assets["natto.png"];
    this.moveTo(400, 300);
  }
});

var Neba = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 558, 326);
    this.image = core.assets["neba.png"];
    this.moveTo(400, 200);
  }
});

var Hashi = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 192, 664);
    this.image = core.assets["ohashi.png"];
    this.moveOnCourse(core.frame);
  },

  moveOnCourse: function(frame){
    this.x = 600 + 100 * Math.cos(frame / 5);
    this.y = -280 + 30 * Math.sin(frame / 5);
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function () {
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["start.png"];
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function () {
    Scene.call(this);
    var _this = this;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["play.png"];
    this.addChild(this.bg);

    this.totalDistance = 0;

    this.timer = new CountDownTimer(10);
    this.timer.font = "80px Serif";
    this.timer.moveTo(50, 50);
    this.timer.start();
    this.timer.addEventListener("over", function(){
      core.gameOverScene = new GameOverScene(_this.totalDistance);
      core.replaceScene(core.gameOverScene);
    });
    this.addChild(this.timer);

    this.natto = new Natto();
    this.addChild(this.natto);

    this.neba = new Neba();
    this.addChild(this.neba);

    this.hashi = new Hashi();
    this.addChild(this.hashi);
  },

  ontouchmove: function(){
    this.totalDistance++;
    this.hashi.moveOnCourse(core.frame);

    this.natto.tl
      .moveBy(2, 0, 5)
      .moveBy(-5, 0, 5).moveBy(5, 0, 5)
      .moveBy(-5, 0, 5).moveBy(5, 0, 5)
      .moveBy(-5, 0, 5).moveBy(5, 0, 5)
      .moveBy(-2, 0, 5)
    this.neba.tl
      .moveBy(2, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-2, 0, 3)
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(distance) {
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["gameover.png"];
    this.addChild(this.bg);

    this.label = new Label((distance / 100).toString());
    this.label.moveTo(550, 140);
    this.label.font = "80px Serif";
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function () {
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("start.png");
  assets.push("play.png");
  assets.push("gameover.png");
  assets.push("natto.png");
  assets.push("neba.png");
  assets.push("ohashi.png");
  core.preload(assets);

  core.onload = function () {
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};