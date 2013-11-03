// Generated by CoffeeScript 1.6.3
(function() {
  var Ball, CpuRacket, GameOverScene, GameScene, MyRacket, Racket, TitleScene, core, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  Ball = (function(_super) {
    __extends(Ball, _super);

    function Ball() {
      Ball.__super__.constructor.call(this, 49, 38);
      this.image = core.assets["pack.png"];
      this.vx = 1;
      this.vy = 3;
      this.lastTouched = "";
    }

    Ball.prototype.v = function() {
      return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
    };

    Ball.prototype.centerX = function() {
      return this.x - this.width / 2;
    };

    Ball.prototype.centerY = function() {
      return this.y - this.height / 2;
    };

    Ball.prototype.collisionWithEnemyRacket = function(racket) {
      this.vy = -this.vy + racket.vy();
      return this.vx = -this.vx + racket.vx();
    };

    Ball.prototype.collisionWithPlayerRacket = function(racket) {
      this.vy = -this.vy + racket.vy();
      return this.vx = -this.vx + racket.vx();
    };

    Ball.prototype._collisionWithLeftSide = function() {
      return this.y - 70 < (this.x - 390) * (700 - 70) / (100 - 390);
    };

    Ball.prototype._collisionWithRightSide = function() {
      return this.y - 70 < (this.x - 900) * (700 - 70) / (1200 - 900);
    };

    Ball.prototype.onenterframe = function() {
      var dx, dy, xIsInCore, yIsInCore;
      dx = this.x + this.vx;
      dy = this.y + this.vy;
      xIsInCore = 0 < dx && dx < HQ_GAME_WIDTH;
      yIsInCore = 0 < dy && dy < HQ_GAME_HEIGHT;
      if (xIsInCore && yIsInCore) {
        this.moveTo(dx, dy);
      } else {
        this.dispatchEvent(new Event("out"));
      }
      if (this._collisionWithLeftSide() && this.vx < 0) {
        return this.vx = Math.abs(this.vx);
      } else if (this._collisionWithRightSide() && this.vx > 0) {
        return this.vx = -Math.abs(this.vx);
      }
    };

    return Ball;

  })(Sprite);

  Racket = (function(_super) {
    __extends(Racket, _super);

    function Racket() {
      _ref = Racket.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Racket.prototype.moveCenterTo = function(x, y) {
      this.previousX = this.x;
      this.previousY = this.y;
      this.x = x - this.width / 2;
      return this.y = y - this.height / 2;
    };

    Racket.prototype.vx = function() {
      return this.x - this.previousX;
    };

    Racket.prototype.vy = function() {
      return this.y - this.previousY;
    };

    return Racket;

  })(Sprite);

  CpuRacket = (function(_super) {
    __extends(CpuRacket, _super);

    function CpuRacket() {
      CpuRacket.__super__.constructor.call(this, 79, 64);
      this.image = core.assets["cpuhockey.png"];
      this.moveTo(400, 50);
    }

    return CpuRacket;

  })(Racket);

  MyRacket = (function(_super) {
    __extends(MyRacket, _super);

    function MyRacket() {
      MyRacket.__super__.constructor.call(this, 114, 92);
      this.image = core.assets["myhockey.png"];
      this.moveTo(800, 400);
    }

    return MyRacket;

  })(Racket);

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
      this.count = 0;
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.cpuracket = new CpuRacket();
      this.addChild(this.cpuracket);
      this.ball = new Ball();
      this.ball.moveTo(300, 400);
      this.addChild(this.ball);
      this.myracket = new MyRacket();
      this.addChild(this.myracket);
      this.ball.addEventListener("out", function() {
        var winner;
        if (_this.ball.y > HQ_GAME_HEIGHT / 2) {
          winner = "enemy";
        } else {
          winner = "player";
        }
        core.gameOverScene = new GameOverScene(winner);
        return core.replaceScene(core.gameOverScene);
      });
    }

    GameScene.prototype.moveRackets = function(options) {
      var x, y;
      x = options.x;
      y = options.y;
      this.myracket.moveCenterTo(x, y);
      return this.cpuracket.moveCenterTo(x, y - 400);
    };

    GameScene.prototype.ontouchmove = function(e) {
      return this.moveRackets(e);
    };

    GameScene.prototype.ontouchstart = function(e) {
      return this.moveRackets(e);
    };

    GameScene.prototype.onenterframe = function() {
      if (this.ball.intersect(this.myracket) && this.ball.lastTouched !== "player") {
        this.ball.collisionWithPlayerRacket(this.myracket);
        this.count++;
      }
      if (this.ball.intersect(this.cpuracket) && this.ball.lastTouched !== "enemy") {
        this.ball.collisionWithEnemyRacket(this.cpuracket);
        return this.count++;
      }
    };

    return GameScene;

  })(Scene);

  GameOverScene = (function(_super) {
    __extends(GameOverScene, _super);

    function GameOverScene(winner) {
      GameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.addChild(this.bg);
      if (winner === "enemy") {
        this.bg.image = core.assets["game_over2.png"];
      } else {
        this.bg.image = core.assets["game_over1.png"];
      }
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
    assets.push("cpuhockey.png");
    assets.push("myhockey.png");
    assets.push("pack.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
