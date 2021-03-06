// Generated by CoffeeScript 1.6.3
(function() {
  var CountDownTimer, GameOverScene, GameScene, HowToScene, Player, ShockWave, TitleScene, Wall, core,
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
      this.stopAt = Infinity;
    }

    CountDownTimer.prototype.start = function() {
      return this.startAt = core.frame;
    };

    CountDownTimer.prototype.stop = function() {
      return this.stopAt = core.frame;
    };

    CountDownTimer.prototype.isStarted = function() {
      return this.startAt < core.frame;
    };

    CountDownTimer.prototype.isStopped = function() {
      return this.stopAt < core.frame;
    };

    CountDownTimer.prototype.remainingFrame = function() {
      return this.frame - core.frame + this.startAt;
    };

    CountDownTimer.prototype.remainingSec = function() {
      return this.remainingFrame() / core.fps;
    };

    CountDownTimer.prototype.bonus = function(bonus) {
      return this.frame += bonus * core.fps;
    };

    CountDownTimer.prototype.onenterframe = function() {
      if (!this.isStopped()) {
        return this.text = this.remainingSec().toFixed(2);
      }
    };

    return CountDownTimer;

  })(Label);

  Player = (function(_super) {
    __extends(Player, _super);

    function Player() {
      Player.__super__.constructor.call(this, 276, 147);
      this.image = core.assets["player.png"];
      this.frame = [0, 0, 0, 1, 1, 1];
      this.moveTo(100, 250);
    }

    Player.prototype.onenterframe = function() {
      if ((this.age - 1) % 120 === 0) {
        return this.behavior();
      }
    };

    Player.prototype.behavior = function() {
      this.tl.moveBy(2, 0, 30, enchant.Easing.CUBIC_EASEIN).and().moveBy(0, -3, 30);
      this.tl.moveBy(2, 0, 30, enchant.Easing.CUBIC_EASEOUT).and().moveBy(0, 3, 30);
      this.tl.moveBy(-2, 0, 30, enchant.Easing.CUBIC_EASEIN).and().moveBy(0, 3, 30);
      return this.tl.moveBy(-2, 0, 30, enchant.Easing.CUBIC_EASEOUT).and().moveBy(0, -3, 30);
    };

    return Player;

  })(Sprite);

  Wall = (function(_super) {
    __extends(Wall, _super);

    function Wall(vx) {
      Wall.__super__.constructor.call(this, 345, 720);
      this.image = core.assets["wall.png"];
      this.frame = 0;
      this.moveTo(HQ_GAME_WIDTH, 0);
      this.isdestroyed = false;
      this.vx = vx;
    }

    Wall.prototype.ontouchstart = function() {
      this.frame = 1;
      return this.isdestroyed = true;
    };

    Wall.prototype.onenterframe = function() {
      return this.moveBy(this.vx, 0);
    };

    return Wall;

  })(Sprite);

  ShockWave = (function(_super) {
    __extends(ShockWave, _super);

    function ShockWave(e) {
      var _this = this;
      ShockWave.__super__.constructor.call(this, 300, 300);
      this.image = core.assets["attack.png"];
      this.moveTo(e.x - this.width / 2, e.y - this.height / 2);
      this.tl.scaleTo(0.9, 0.9, 10).scaleTo(1.1, 1.1, 10);
      this.tl.scaleTo(1.0, 1.0, 10).and().fadeOut(10).then(function() {
        var ev;
        ev = new Event("end");
        return _this.dispatchEvent(ev);
      });
    }

    return ShockWave;

  })(Sprite);

  TitleScene = (function(_super) {
    __extends(TitleScene, _super);

    function TitleScene() {
      TitleScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["title.png"];
      this.addChild(this.bg);
      this.round = 1;
      this.how = false;
    }

    TitleScene.prototype.ontouchstart = function() {
      var _this = this;
      if (!this.how) {
        this.how = true;
        core.howToScene = new HowToScene();
        core.pushScene(core.howToScene);
        this.bg.image = core.assets["start.png"];
        return this.tl.delay(30).then(function() {
          core.gameScene = new GameScene(_this.round);
          return core.replaceScene(core.gameScene);
        });
      }
    };

    return TitleScene;

  })(Scene);

  HowToScene = (function(_super) {
    __extends(HowToScene, _super);

    function HowToScene() {
      HowToScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["how.png"];
      this.addChild(this.bg);
    }

    HowToScene.prototype.ontouchstart = function() {
      return core.popScene();
    };

    return HowToScene;

  })(Scene);

  GameScene = (function(_super) {
    __extends(GameScene, _super);

    function GameScene(round) {
      var vx,
        _this = this;
      GameScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH * 2, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.round = round;
      vx = (this.round * 0.1 + 1) * 14;
      this.vx = -vx;
      this.player = new Player();
      this.addChild(this.player);
      this.walls = [];
      this.delay = 90;
      if (round * 3 < 80) {
        this.offset = 90 - round * 3;
      } else {
        this.offset = 10;
      }
      this.timer = new CountDownTimer(30);
      this.timer.start();
      this.moveTo(0, 0);
      this.bg.addEventListener("enterframe", function() {
        this.x -= vx;
        if (this.x <= -HQ_GAME_WIDTH) {
          return this.x = 0;
        }
      });
      this.score = round;
      this.scoreLabel = new Label(this.score.toString() + "階");
      this.scoreLabel.width = 600;
      this.scoreLabel.textAlign = "center";
      this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 300);
      this.scoreLabel.font = "128px Sans-serif";
      this.scoreLabel.color = "rgb(34, 42, 46)";
      this.addChild(this.scoreLabel);
      this.tl.delay(30).then(function() {
        return _this.removeChild(_this.scoreLabel);
      });
    }

    GameScene.prototype.onenterframe = function() {
      var wall, wallsLength, _results;
      if (this.timer.remainingFrame() === 0) {
        core.gameScene = new GameScene(this.round + 1);
        core.replaceScene(core.gameScene);
      }
      if (this.age === this.delay) {
        if (this.offset > 10) {
          this.offset--;
        }
        this.delay += Math.floor(Math.random() * this.offset) + 30;
        wall = new Wall(this.vx);
        this.addChild(wall);
        this.walls.push(wall);
      }
      wallsLength = this.walls.length;
      _results = [];
      while (wallsLength) {
        wall = this.walls[--wallsLength];
        if (!wall.isdestroyed) {
          if (wall.intersect(this.player)) {
            core.gameOverScene = new GameOverScene(this.round);
            _results.push(core.replaceScene(core.gameOverScene));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    GameScene.prototype.ontouchstart = function(e) {
      var shockWave,
        _this = this;
      shockWave = new ShockWave(e);
      this.addChild(shockWave);
      return shockWave.addEventListener("end", function() {
        return _this.removeChild(shockWave);
      });
    };

    return GameScene;

  })(Scene);

  GameOverScene = (function(_super) {
    __extends(GameOverScene, _super);

    function GameOverScene(round) {
      GameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over.png"];
      this.addChild(this.bg);
      this.score = round;
      this.scoreLabel = new Label(this.score.toString() + "階");
      this.scoreLabel.width = 600;
      this.scoreLabel.textAlign = "center";
      this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 300);
      this.scoreLabel.font = "128px Sans-serif";
      this.scoreLabel.color = "rgb(34, 42, 46)";
      this.addChild(this.scoreLabel);
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
    assets.push("start.png");
    assets.push("game.png");
    assets.push("game_over.png");
    assets.push("player.png");
    assets.push("attack.png");
    assets.push("wall.png");
    assets.push("how.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
