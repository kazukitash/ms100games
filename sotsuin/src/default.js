// Generated by CoffeeScript 1.6.3
(function() {
  var BrokenWindow, GameOverScene, GameScene, HowToScene, Player, TitleScene, WindowPos, core,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  WindowPos = [
    {
      x: 154,
      y: 61
    }, {
      x: 234,
      y: 61
    }, {
      x: 314,
      y: 61
    }, {
      x: 394,
      y: 61
    }, {
      x: 154,
      y: 249
    }, {
      x: 234,
      y: 249
    }, {
      x: 314,
      y: 249
    }, {
      x: 394,
      y: 249
    }, {
      x: 154,
      y: 431
    }, {
      x: 234,
      y: 431
    }, {
      x: 314,
      y: 431
    }, {
      x: 394,
      y: 431
    }, {
      x: 847,
      y: 61
    }, {
      x: 927,
      y: 61
    }, {
      x: 1007,
      y: 61
    }, {
      x: 1087,
      y: 61
    }, {
      x: 847,
      y: 249
    }, {
      x: 927,
      y: 249
    }, {
      x: 1007,
      y: 249
    }, {
      x: 1087,
      y: 249
    }, {
      x: 847,
      y: 431
    }, {
      x: 927,
      y: 431
    }, {
      x: 1007,
      y: 431
    }, {
      x: 1087,
      y: 431
    }
  ];

  Player = (function(_super) {
    __extends(Player, _super);

    function Player() {
      var _this = this;
      Player.__super__.constructor.call(this, 114, 120);
      this.image = core.assets["player.png"];
      this.moveTo(355, 555);
      this.vy = -12;
      this.isOnTheGround = true;
      this.isJumping = false;
      this.isLanding = false;
      this.isBack = false;
      this.addEventListener("Jump", function() {
        return _this.jump();
      });
      this.addEventListener("Land", function() {
        return _this.land();
      });
    }

    Player.prototype.onenterframe = function() {
      if (this.x + this.width / 2 < 0 || this.x + this.width / 2 > HQ_GAME_WIDTH || this.y + this.height / 2 < 0) {
        core.gameOverScene = new GameOverScene(this.scene.score);
        core.replaceScene(core.gameOverScene);
      }
      if (this.isOnTheGround) {
        return this.moveBy(5, 0);
      } else {
        if (this.isBack) {
          if (this.isJumping) {
            this.moveBy(-4, this.vy);
            this.rotation = -30;
          }
          if (this.isLanding) {
            if (core.frame % 2 === 0 && this.vy < 12) {
              this.vy++;
            }
            this.moveBy(-4, this.vy);
            if (this.y > 555) {
              this.isLanding = false;
              this.isOnTheGround = true;
              this.vy = -12;
              return this.rotation = 0;
            }
          }
        } else {
          if (this.isJumping) {
            this.moveBy(7, this.vy);
            this.rotation = -30;
          }
          if (this.isLanding) {
            if (core.frame % 2 === 0 && this.vy < 12) {
              this.vy++;
            }
            this.moveBy(7, this.vy);
            if (this.y > 555) {
              this.isLanding = false;
              this.isOnTheGround = true;
              this.vy = -12;
              return this.rotation = 0;
            }
          }
        }
      }
    };

    Player.prototype.jump = function() {
      this.isJumping = true;
      return this.isOnTheGround = false;
    };

    Player.prototype.land = function() {
      this.isJumping = false;
      return this.isLanding = true;
    };

    return Player;

  })(Sprite);

  BrokenWindow = (function(_super) {
    __extends(BrokenWindow, _super);

    function BrokenWindow() {
      var windowPos;
      BrokenWindow.__super__.constructor.call(this, 74, 116);
      this.image = core.assets["break.png"];
      this.frame = 0;
      this.broken = false;
      windowPos = WindowPos[Math.floor(Math.random() * 24)];
      this.moveTo(HQ_GAME_WIDTH + windowPos.x, windowPos.y);
    }

    BrokenWindow.prototype.onenterframe = function() {
      return this.moveBy(-this.scene.vx, 0);
    };

    return BrokenWindow;

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
      core.howToScene = new HowToScene();
      return core.pushScene(core.howToScene);
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
      core.popScene();
      core.gameScene = new GameScene();
      return core.replaceScene(core.gameScene);
    };

    return HowToScene;

  })(Scene);

  GameScene = (function(_super) {
    __extends(GameScene, _super);

    function GameScene() {
      var _this;
      GameScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH * 2, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.vx = 14;
      this.score = 0;
      this.windows = [];
      this.score = 0;
      this.scoreLabel = new Label(this.score.toString() + "枚");
      this.scoreLabel.width = 300;
      this.scoreLabel.textAlign = "center";
      this.scoreLabel.moveTo(0, 20);
      this.scoreLabel.font = "64px Sans-serif";
      this.scoreLabel.color = "rgb(34, 42, 46)";
      this.addChild(this.scoreLabel);
      this.moveTo(0, 0);
      _this = this;
      this.bg.addEventListener("enterframe", function() {
        var brokenWindow;
        this.x -= _this.vx;
        if (this.x <= -HQ_GAME_WIDTH) {
          brokenWindow = new BrokenWindow();
          _this.windows.push(brokenWindow);
          _this.addChild(brokenWindow);
          return this.x = 0;
        }
      });
      this.player = new Player();
      this.addChild(this.player);
    }

    GameScene.prototype.onenterframe = function() {
      var wdw, windowLength;
      windowLength = this.windows.length;
      while (windowLength) {
        wdw = this.windows[--windowLength];
        if (wdw.intersect(this.player) && !wdw.broken) {
          wdw.frame = 1;
          wdw.broken = true;
          this.score++;
          this.scoreLabel.text = this.score.toString() + "枚";
        }
        if (wdw.x < -wdw.width) {
          this.removeChild(wdw);
          this.windows.splice(windowLength, 1);
        }
      }
      if (core.frame % 120 === 0) {
        return this.vx++;
      }
    };

    GameScene.prototype.ontouchstart = function(e) {
      var ev;
      if (this.player.isOnTheGround) {
        if (e.x < this.player.x + this.player.width / 2) {
          this.player.isBack = true;
        } else {
          this.player.isBack = false;
        }
        ev = new Event("Jump");
        return this.player.dispatchEvent(ev);
      }
    };

    GameScene.prototype.ontouchend = function() {
      var ev;
      ev = new Event("Land");
      return this.player.dispatchEvent(ev);
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
      this.score = score;
      this.scoreLabel = new Label(this.score.toString() + "枚");
      this.scoreLabel.width = 600;
      this.scoreLabel.textAlign = "center";
      this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 300);
      this.scoreLabel.font = "128px Sans-serif";
      this.scoreLabel.color = "rgb(34, 42, 46)";
      this.addChild(this.scoreLabel);
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
    assets.push("player.png");
    assets.push("score.png");
    assets.push("break.png");
    assets.push("how.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
