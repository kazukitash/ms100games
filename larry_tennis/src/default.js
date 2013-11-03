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
      Ball.__super__.constructor.call(this, 52, 51);
      this.image = core.assets["ball.png"];
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
      if (this.lastTouched !== "enemy") {
        this.vy = -this.vy + racket.vy();
        this.vx = -this.vx + racket.vx();
        return this.lastTouched = "enemy";
      }
    };

    Ball.prototype.collisionWithPlayerRacket = function(racket) {
      if (this.lastTouched !== "player") {
        this.vy = -this.vy + racket.vy();
        this.vx = -this.vx + racket.vx();
        return this.lastTouched = "player";
      }
    };

    Ball.prototype.onenterframe = function() {
      var dx, dy, xIsInCore, yIsInCore;
      dx = this.x + this.vx;
      dy = this.y + this.vy;
      xIsInCore = 0 < dx && dx < HQ_GAME_WIDTH;
      yIsInCore = 0 < dy && dy < HQ_GAME_HEIGHT;
      if (xIsInCore && yIsInCore) {
        return this.moveTo(dx, dy);
      } else {
        return this.dispatchEvent(new Event("out"));
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
      CpuRacket.__super__.constructor.call(this, 192, 135);
      this.image = core.assets["cpu-racket.png"];
      this.moveTo(400, 50);
    }

    return CpuRacket;

  })(Racket);

  MyRacket = (function(_super) {
    __extends(MyRacket, _super);

    function MyRacket() {
      MyRacket.__super__.constructor.call(this, 215, 142);
      this.image = core.assets["my-racket.png"];
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
        core.gameOverScene = new GameOverScene(_this.count);
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

    function GameOverScene(score) {
      GameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over.png"];
      this.addChild(this.bg);
      this.label = new Label(score.toString());
      this.label.font = "80px Serif";
      this.label.color = "white";
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
    assets.push("game_over.png");
    assets.push("ball.png");
    assets.push("my-racket.png");
    assets.push("cpu-racket.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
