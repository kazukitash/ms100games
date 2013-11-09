// Generated by CoffeeScript 1.6.3
(function() {
  var CountDownTimer, GameOverScene, GameScene, Sara, Sushi, TitleScene, core,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  CountDownTimer = (function(_super) {
    __extends(CountDownTimer, _super);

    function CountDownTimer(sec) {
      CountDownTimer.__super__.constructor.call(this);
      this.frame = sec * core.fps;
      this.startAt = Infinity;
    }

    CountDownTimer.prototype.start = function() {
      return this.startAt = core.frame;
    };

    CountDownTimer.prototype.isStarted = function() {
      return this.startAt < core.frame;
    };

    CountDownTimer.prototype.remainingFrame = function() {
      return this.frame - core.frame + this.startAt;
    };

    CountDownTimer.prototype.remainingSec = function() {
      return this.remainingFrame() / core.fps;
    };

    CountDownTimer.prototype.onenterframe = function() {
      var e;
      this.text = this.remainingSec().toFixed(2);
      if (this.remainingFrame() === 0) {
        e = new Event("over");
        return this.dispatchEvent(e);
      }
    };

    return CountDownTimer;

  })(Label);

  Sushi = (function(_super) {
    __extends(Sushi, _super);

    function Sushi(option) {
      Sushi.__super__.constructor.call(this, 440, 254);
      this.image = core.assets[option[0]];
      this.hp = option[2];
      this.currentHp = this.hp;
      this.moveTo(-580, 320);
      this.v = 25;
    }

    Sushi.prototype.onenterframe = function() {
      return this.moveBy(this.v, 0);
    };

    Sushi.prototype.ontouchstart = function() {
      var ev;
      if (this.currentHp === 0) {
        ev = new Event("ate");
        this.dispatchEvent(ev);
      }
      this.currentHp--;
      return this.opacity -= 1 / (this.hp + 1);
    };

    return Sushi;

  })(Sprite);

  Sara = (function(_super) {
    __extends(Sara, _super);

    function Sara(option) {
      Sara.__super__.constructor.call(this, 636, 214);
      this.image = core.assets[option[1]];
      this.moveTo(-700, 430);
      this.v = 25;
    }

    Sara.prototype.onenterframe = function() {
      return this.moveBy(this.v, 0);
    };

    return Sara;

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
    var SushiList;

    __extends(GameScene, _super);

    function GameScene() {
      var _this = this;
      GameScene.__super__.constructor.call(this);
      this.length = 0;
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.timer = new CountDownTimer(30);
      this.timer.start();
      this.timer.width = 100;
      this.timer.textAlign = "center";
      this.timer.font = "48px Serif";
      this.timer.color = "rgb(25,25,25)";
      this.timer.moveTo(60, 100);
      this.addChild(this.timer);
      this.timer.addEventListener("over", function() {
        core.GameOverScene = new GameOverScene(_this.timer.remainingFrame());
        return core.replaceScene(core.GameOverScene);
      });
      this.score = 0;
      this.scoreLabel = new Label(this.score.toString());
      this.scoreLabel.width = 200;
      this.scoreLabel.textAlign = "center";
      this.scoreLabel.moveTo(1080, 35);
      this.scoreLabel.font = "48px Sans-serif";
      this.scoreLabel.color = "rgb(34, 42, 46)";
      this.addChild(this.scoreLabel);
    }

    GameScene.prototype.onenterframe = function() {
      var sara, sushi,
        _this = this;
      if (core.frame % 30 === 0) {
        sara = new Sara(SushiList[Math.floor(Math.random() * 3)]);
        this.addChild(sara);
        sushi = new Sushi(SushiList[Math.floor(Math.random() * 3)]);
        this.addChild(sushi);
        return sushi.addEventListener("ate", function() {
          _this.score++;
          _this.scoreLabel.text = _this.score.toString();
          return _this.removeChild(sushi);
        });
      }
    };

    SushiList = [["maguro.png", "maguro-sara.png", 4, 10, 4], ["ebi.png", "ebi-sara.png", 2, 7, 2], ["tamago.png", "tamago-sara.png", 7, 20, 6]];

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
      this.label.width = 600;
      this.label.textAlign = "center";
      this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, 300);
      this.label.font = "128px Sans-serif";
      this.label.color = "rgb(35,35,35)";
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
    assets.push("game_over.png");
    assets.push("maguro.png");
    assets.push("maguro-sara.png");
    assets.push("tamago.png");
    assets.push("tamago-sara.png");
    assets.push("ebi.png");
    assets.push("ebi-sara.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
