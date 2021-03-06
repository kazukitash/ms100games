// Generated by CoffeeScript 1.6.3
(function() {
  var CountUpTimer, GameOverScene, GameScene, Shaking, TitleScene, core,
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

  Shaking = (function(_super) {
    __extends(Shaking, _super);

    function Shaking() {
      Shaking.__super__.constructor.call(this, 300, 300);
      this.image = core.assets[""];
    }

    Shaking.prototype.endCondition = function() {
      return false;
    };

    Shaking.prototype.shake = function() {
      if (this.endCondition()) {
        return this.dispatchEvent(new Event("over"));
      } else {

      }
    };

    return Shaking;

  })(Sprite);

  TitleScene = (function(_super) {
    __extends(TitleScene, _super);

    function TitleScene() {
      TitleScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["title-game.png"];
      this.addChild(this.bg);
      this.title = new Sprite(693, 578);
      this.title.image = core.assets["title.png"];
      this.title.moveTo(300, HQ_GAME_HEIGHT - this.title.height);
      this.title.v = 0;
      this.addChild(this.title);
    }

    TitleScene.prototype.ontouchstart = function() {
      return this.title.v = 10;
    };

    TitleScene.prototype.onenterframe = function() {
      this.title.y += this.title.v;
      if (HQ_GAME_HEIGHT < this.title.y) {
        core.gameScene = new GameScene();
        return core.replaceScene(core.gameScene);
      }
    };

    return TitleScene;

  })(Scene);

  GameScene = (function(_super) {
    __extends(GameScene, _super);

    function GameScene() {
      GameScene.__super__.constructor.call(this);
      this.length = 0;
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["title-game.png"];
      this.addChild(this.bg);
      this.timer = new CountUpTimer();
      this.timer.start();
      this.messageLike = new Sprite(266, 169);
      this.messageLike.image = core.assets["text1.png"];
      this.messageLike.moveTo(100, 100);
      this.messageLike.opacity = 0;
      this.addChild(this.messageLike);
      this.messageOops = new Sprite(230, 147);
      this.messageOops.image = core.assets["text5.png"];
      this.messageOops.moveTo(400, 100);
      this.messageOops.opacity = 0;
      this.addChild(this.messageOops);
      this.messageHumm = new Sprite(230, 147);
      this.messageHumm.image = core.assets["text3.png"];
      this.messageHumm.moveTo(700, 100);
      this.messageHumm.opacity = 0;
      this.addChild(this.messageHumm);
      this.messageGood = new Sprite(231, 146);
      this.messageGood.image = core.assets["text4.png"];
      this.messageGood.moveTo(800, 400);
      this.messageGood.opacity = 0;
      this.addChild(this.messageGood);
      this.shine1 = new Sprite(312, 311);
      this.shine1.moveTo(600, 200);
      this.shine1.image = core.assets["shin1.png"];
      this.addChild(this.shine1);
      this.shine2 = new Sprite(176, 376);
      this.shine2.moveTo(300, 300);
      this.shine2.image = core.assets["shin2.png"];
      this.addChild(this.shine2);
      this.zoukin = new Sprite(159, 109);
      this.zoukin.image = core.assets["zokin.png"];
      this.zoukin.moveCenterTo = function(x, y) {
        this.x = x - this.width / 2;
        return this.y = y - this.height / 2;
      };
      this.addChild(this.zoukin);
    }

    GameScene.prototype.succPath = function(e) {
      this.zoukin.moveCenterTo(e.x, e.y);
      if (this.endCondition()) {
        core.gameOverScene = new GameOverScene();
        return core.replaceScene(core.gameOverScene);
      } else {
        ++this.length;
        this.shine1.opacity = (Math.sin(this.length / 6) + 1) / 2;
        this.shine2.opacity = (Math.cos(this.length / 5) + 1) / 2;
        if (this.length < 100) {
          return this.messageLike.opacity += 0.01;
        } else if (this.length < 200) {
          return this.messageGood.opacity += 0.01;
        } else if (this.length < 300) {
          return this.messageHumm.opacity += 0.01;
        } else if (this.length < 400) {
          return this.messageOops.opacity += 0.01;
        }
      }
    };

    GameScene.prototype.endCondition = function() {
      return 400 < this.length + 1;
    };

    GameScene.prototype.ontouchstart = function(e) {
      return this.succPath(e);
    };

    GameScene.prototype.ontouchmove = function(e) {
      return this.succPath(e);
    };

    return GameScene;

  })(Scene);

  GameOverScene = (function(_super) {
    __extends(GameOverScene, _super);

    function GameOverScene() {
      GameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over.png"];
      this.addChild(this.bg);
    }

    GameOverScene.prototype.ontouchstart = function() {
      core.titleScene = new TitleScene();
      return core.replaceScene(core.titleScene);
    };

    return GameOverScene;

  })(Scene);

  window.onload = function() {
    var assets;
    core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    assets = [];
    assets.push("title.png");
    assets.push("title-game.png");
    assets.push("game_over.png");
    assets.push("zokin.png");
    assets.push("shin1.png");
    assets.push("shin2.png");
    assets.push("shin3.png");
    assets.push("text1.png");
    assets.push("text2.png");
    assets.push("text3.png");
    assets.push("text4.png");
    assets.push("text5.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
