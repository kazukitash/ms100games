// Generated by CoffeeScript 1.6.3
(function() {
  var Bun, CountUpTimer, GameOverScene, GameScene, MySprite, Player, TitleScene, core,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  MySprite = (function(_super) {
    __extends(MySprite, _super);

    function MySprite() {
      MySprite.__super__.constructor.call(this, 300, 300);
    }

    return MySprite;

  })(Sprite);

  Bun = (function(_super) {
    __extends(Bun, _super);

    function Bun() {
      Bun.__super__.constructor.call(this, 151, 127);
      this.startAt = core.frame;
    }

    Bun.prototype.isTimePassed = function() {
      return this.startAt + core.fps * 1 < core.frame;
    };

    Bun.prototype.onenterframe = function() {
      if (this.isTimePassed()) {
        return this.image = core.assets["bun.png"];
      } else if (this.startAt + core.fps * 2 < core.frame) {
        return this.image = void 0;
      }
    };

    return Bun;

  })(Sprite);

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

  Player = (function(_super) {
    __extends(Player, _super);

    function Player() {
      Player.__super__.constructor.call(this, 150, 191);
      this.image = core.assets["runner.png"];
      this.moveTo(100, 500);
    }

    Player.prototype.nextStep = function() {
      if (this.frame) {
        return this.frame = 0;
      } else {
        return this.frame = 1;
      }
    };

    Player.prototype.onenterframe = function() {
      var e;
      if (HQ_GAME_WIDTH < this.x) {
        e = new Event("out");
        return this.dispatchEvent(e);
      }
    };

    return Player;

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
      var _this = this;
      GameScene.__super__.constructor.call(this);
      this.v = 0;
      this.bg = new Sprite(11400, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.bun = new Bun();
      this.addChild(this.bun);
      this.timer = new CountUpTimer();
      this.timer.start();
      this.player = new Player();
      this.addChild(this.player);
      this.player.addEventListener("out", function() {
        core.gameOverScene = new GameOverScene(_this.timer.currentSec());
        console.log(_this.timer.currentSec());
        return core.replaceScene(core.gameOverScene);
      });
    }

    GameScene.prototype.scrolBack = function() {
      if (this.canBackScrol()) {
        return this.bg.x -= this.v;
      } else {
        return this.player.x += this.v;
      }
    };

    GameScene.prototype.canBackScrol = function() {
      var bgRightEnd;
      bgRightEnd = this.bg.width + this.bg.x;
      return HQ_GAME_WIDTH <= bgRightEnd;
    };

    GameScene.prototype.ontouchstart = function() {
      if (this.bun.isTimePassed()) {
        this.v += 0.5;
        return this.player.nextStep();
      }
    };

    GameScene.prototype.onenterframe = function() {
      return this.scrolBack();
    };

    return GameScene;

  })(Scene);

  GameOverScene = (function(_super) {
    __extends(GameOverScene, _super);

    function GameOverScene(sec) {
      GameOverScene.__super__.constructor.call(this);
      this.startAt = core.frame;
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over.png"];
      this.addChild(this.bg);
      this.label = new Label(sec.toFixed(2));
      this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2 + 80, (HQ_GAME_HEIGHT - this.label.height) / 2 - 120);
      this.label.font = "80px Serif";
      this.label.color = "yellow";
      this.addChild(this.label);
    }

    GameOverScene.prototype.ontouchstart = function() {
      if (this.startAt < core.frame + core.fps) {
        return core.replaceScene(core.titleScene);
      }
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
    assets.push("runner.png");
    assets.push("bun.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
