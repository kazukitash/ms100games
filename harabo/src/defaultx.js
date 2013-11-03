// Generated by CoffeeScript 1.6.3
(function() {
  var CountUpTimer, GameOverScene, GameScene, Stick, TitleScene, core,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  CountUpTimer = (function(_super) {
    __extends(CountUpTimer, _super);

    function CountUpTimer() {
      CountUpTimer.__super__.constructor.call(this, "0.00");
      this.startAt = Infinity;
    }

    CountUpTimer.prototype.start = function() {
      return this.startAt = core.frame;
    };

    CountUpTimer.prototype.currentFrame = function() {
      return core.frame - this.startAt;
    };

    CountUpTimer.prototype.currentSec = function() {
      return this.currentFrame() / core.fps;
    };

    CountUpTimer.prototype.onenterframe = function() {
      return this.text = this.currentSec().toFixed(2);
    };

    return CountUpTimer;

  })(Label);

  Stick = (function(_super) {
    __extends(Stick, _super);

    function Stick() {
      Stick.__super__.constructor.call(this, 43, 43);
      this.image = core.assets["stick.png"];
      this.moveTo(80, (HQ_GAME_HEIGHT - this.height) / 2);
      this.vx = 0;
      this.vy = 0;
    }

    Stick.prototype.moveVelocityTo = function(x, y) {
      var dr, dx, dy;
      dx = x - this.x;
      dy = y - this.y;
      dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      this.vx = dr / 600 * dx;
      return this.vy = dr / 600 * dy;
    };

    Stick.prototype.onenterframe = function() {
      this.x += this.vx;
      return this.y += this.vy;
    };

    return Stick;

  })(Sprite);

  TitleScene = (function(_super) {
    __extends(TitleScene, _super);

    function TitleScene() {
      TitleScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["title.png"];
      this.addChild(this.bg);
    }

    TitleScene.prototype.ontouchstart = function() {
      core.gameScene = new GameScene();
      return core.replaceScene(core.gameScene);
    };

    return TitleScene;

  })(Scene);

  GameScene = (function(_super) {
    __extends(GameScene, _super);

    function GameScene() {
      GameScene.__super__.constructor.call(this);
      this.length = 0;
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.stick = new Stick();
      this.addChild(this.stick);
    }

    GameScene.prototype.ontouchstart = function(e) {
      return this.stick.moveVelocityTo(e.x, e.y);
    };

    GameScene.prototype.ontouchmove = function(e) {
      return this.stick.moveVelocityTo(e.x, e.y);
    };

    return GameScene;

  })(Scene);

  GameOverScene = (function(_super) {
    __extends(GameOverScene, _super);

    function GameOverScene(score) {
      GameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over.png"];
      this.addChild(this.bg);
      this.label = new Label(score.toString());
      this.label.font = "80px Serif";
      this.label.color = "black";
      this.label.x = (HQ_GAME_WIDTH - this.label.width) / 2 + 150;
      this.label.y = (HQ_GAME_HEIGHT - this.label.height) / 2;
      this.addChild(this.label);
    }

    GameOverScene.prototype.ontouchstart = function() {
      return core.replaceScene(core.titleScene);
    };

    return GameOverScene;

  })(Scene);

  window.onload = function() {
    var assets;
    core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    assets = [];
    assets.push("title.png");
    assets.push("game.png");
    assets.push("game_over1.png");
    assets.push("game_over2.png");
    assets.push("stick.png");
    assets.push("text.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
