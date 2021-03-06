// Generated by CoffeeScript 1.6.3
(function() {
  var Cloud, CloudAttack, CountDownTimer, GameOverScene, GameScene, HowToScene, ScoreBoard, Sun, SunAttack, TitleScene, Traveler, Travelers, core,
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
      var ev;
      if (!this.isStopped()) {
        this.text = this.remainingSec().toFixed(2);
      }
      if (this.remainingFrame() === 0) {
        this.stop();
        ev = new Event("over");
        return this.dispatchEvent(ev);
      }
    };

    return CountDownTimer;

  })(Label);

  Traveler = (function(_super) {
    __extends(Traveler, _super);

    function Traveler() {
      Traveler.__super__.constructor.call(this, 48, 77);
      this.image = core.assets["traveler.png"];
      this.frame = 0;
      this.moveTo(Math.random() * HQ_GAME_WIDTH, Math.random() * HQ_GAME_HEIGHT);
      this.endurance = 0;
      this.isShined = false;
      this.isBlowed = false;
      this.isDead = false;
      this.vx = 3;
      this.vy = 5;
    }

    Traveler.prototype.onenterframe = function() {
      var _this = this;
      if (this.endurance > 45) {
        this.tl.fadeOut(20).then(function() {
          return _this.isDead = true;
        });
      } else if (this.endurance > 30) {
        this.frame = 2;
      } else if (this.endurance > 15) {
        this.frame = 1;
      }
      if (this.isBlowed && (this.endurance > 30 || this.endurance <= 15)) {
        this.endurance++;
        this.isBlowed = false;
      }
      if (this.isShined && this.endurance <= 30 && this.endurance > 15) {
        this.endurance++;
        this.isShined = false;
      }
      if (this.x < 0 || this.x > HQ_GAME_WIDTH - this.width) {
        this.vx = -this.vx;
        this.scaleX = -1;
      }
      if (this.y < 0 || this.y > HQ_GAME_HEIGHT - this.height) {
        this.vy = -this.vy;
      }
      return this.moveBy(this.vx, this.vy);
    };

    return Traveler;

  })(Sprite);

  Travelers = (function(_super) {
    __extends(Travelers, _super);

    function Travelers(sA, cA) {
      Travelers.__super__.constructor.call(this);
      this.sA = sA;
      this.cA = cA;
      this.travelers = [];
    }

    Travelers.prototype.onenterframe = function() {
      var ev, traveler, travelersLength;
      travelersLength = this.travelers.length;
      while (travelersLength) {
        traveler = this.travelers[--travelersLength];
        if (this.cA.within(traveler, 120)) {
          traveler.isBlowed = true;
        }
        if (this.sA.within(traveler, 120)) {
          traveler.isShined = true;
        }
        if (traveler.isDead) {
          this.removeChild(traveler);
          this.travelers.splice(travelersLength, 1);
          ev = new Event("remove");
          core.gameScene.dispatchEvent(ev);
        }
      }
      if (core.frame % 90 === 0) {
        traveler = new Traveler();
        this.addChild(traveler);
        return this.travelers.push(traveler);
      }
    };

    return Travelers;

  })(Group);

  ScoreBoard = (function(_super) {
    __extends(ScoreBoard, _super);

    function ScoreBoard() {
      ScoreBoard.__super__.constructor.call(this, 185, 77);
      this.image = core.assets["score.png"];
      this.moveTo(1080, 20);
    }

    return ScoreBoard;

  })(Sprite);

  Sun = (function(_super) {
    __extends(Sun, _super);

    function Sun() {
      Sun.__super__.constructor.call(this, 240, 230);
      this.image = core.assets["sun.png"];
      this.moveTo(HQ_GAME_WIDTH - this.width, HQ_GAME_HEIGHT - this.height);
    }

    Sun.prototype.ontouchstart = function() {
      var ev;
      ev = new Event("Sun");
      return this.dispatchEvent(ev);
    };

    return Sun;

  })(Sprite);

  Cloud = (function(_super) {
    __extends(Cloud, _super);

    function Cloud() {
      Cloud.__super__.constructor.call(this, 338, 218);
      this.image = core.assets["cloud.png"];
      this.moveTo(-126, -71);
    }

    Cloud.prototype.ontouchstart = function() {
      var ev;
      ev = new Event("Cloud");
      return this.dispatchEvent(ev);
    };

    return Cloud;

  })(Sprite);

  SunAttack = (function(_super) {
    __extends(SunAttack, _super);

    function SunAttack() {
      SunAttack.__super__.constructor.call(this, 133, 133);
      this.image = core.assets["sun_attack.png"];
      this.moveTo(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    }

    return SunAttack;

  })(Sprite);

  CloudAttack = (function(_super) {
    __extends(CloudAttack, _super);

    function CloudAttack() {
      CloudAttack.__super__.constructor.call(this, 133, 133);
      this.image = core.assets["cloud_attack.png"];
      this.moveTo(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    }

    return CloudAttack;

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
      var scoreBoard, travelers,
        _this = this;
      GameScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.addEventListener("remove", function() {
        _this.score++;
        _this.scoreLabel.text = _this.score.toString();
        return _this.timer.bonus(4);
      });
      this.sunAttack = new SunAttack();
      this.sunAttack.opacity = 0;
      this.addChild(this.sunAttack);
      this.cloudAttack = new CloudAttack();
      this.cloudAttack.opacity = 0;
      this.addChild(this.cloudAttack);
      travelers = new Travelers(this.sunAttack, this.cloudAttack);
      this.addChild(travelers);
      scoreBoard = new ScoreBoard();
      this.addChild(scoreBoard);
      this.sun = new Sun();
      this.addChild(this.sun);
      this.sun.addEventListener("Sun", function() {
        return _this.isSun = true;
      });
      this.cloud = new Cloud();
      this.addChild(this.cloud);
      this.cloud.addEventListener("Cloud", function() {
        return _this.isSun = false;
      });
      this.isAttacking = false;
      this.score = 0;
      this.scoreLabel = new Label(this.score.toString());
      this.scoreLabel.width = 200;
      this.scoreLabel.textAlign = "center";
      this.scoreLabel.moveTo(1080, 35);
      this.scoreLabel.font = "48px Sans-serif";
      this.scoreLabel.color = "rgb(34, 42, 46)";
      this.addChild(this.scoreLabel);
      this.timer = new CountDownTimer(30);
      this.timer.width = 300;
      this.timer.textAlign = "center";
      this.timer.moveTo((HQ_GAME_WIDTH - this.timer.width) / 2, 35);
      this.timer.font = "48px Sans-serif";
      this.timer.color = "rgb(34, 42, 46)";
      this.timer.addEventListener("over", function() {
        core.gameOverScene = new GameOverScene(_this.score);
        return core.replaceScene(core.gameOverScene);
      });
      this.timer.start();
      this.addChild(this.timer);
    }

    GameScene.prototype.onenterframe = function() {
      var sun,
        _this = this;
      if (this.isAttacking) {
        if (core.frame % 30 === 0) {
          if (this.isSun) {
            sun = new Sun();
            this.addChild(sun);
            return sun.tl.scaleTo(1.2, 1.2, 20).and().fadeOut(20).then(function() {
              return _this.removeChild(sun);
            });
          } else {
            return this.cloud.tl.moveBy(2, 0, 3).moveBy(-5, 0, 3).moveBy(5, 0, 3).moveBy(-5, 0, 3).moveBy(5, 0, 3).moveBy(-5, 0, 3).moveBy(5, 0, 3).moveBy(-2, 0, 3);
          }
        }
      }
    };

    GameScene.prototype.ontouchstart = function(e) {
      console.log(e.x.toFixed(0), e.y.toFixed(0));
      this.isAttacking = true;
      if (this.isSun) {
        this.sunAttack.moveTo(e.x - this.sunAttack.width / 2, e.y - this.sunAttack.height / 2);
        return this.sunAttack.opacity = 1;
      } else {
        this.cloudAttack.moveTo(e.x - this.cloudAttack.width / 2, e.y - this.cloudAttack.height / 2);
        return this.cloudAttack.opacity = 1;
      }
    };

    GameScene.prototype.ontouchmove = function(e) {
      if (this.isSun) {
        return this.sunAttack.moveTo(e.x - this.sunAttack.width / 2, e.y - this.sunAttack.height / 2);
      } else {
        return this.cloudAttack.moveTo(e.x - this.cloudAttack.width / 2, e.y - this.cloudAttack.height / 2);
      }
    };

    GameScene.prototype.ontouchend = function() {
      if (this.isSun) {
        this.sunAttack.opacity = 0;
        this.sunAttack.moveTo(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      } else {
        this.cloudAttack.opacity = 0;
        this.cloudAttack.moveTo(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      }
      return this.isAttacking = false;
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
      this.scoreLabel = new Label(this.score.toString() + "人");
      this.scoreLabel.width = 300;
      this.scoreLabel.textAlign = "center";
      this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 300);
      this.scoreLabel.font = "64px Sans-serif";
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
    assets.push("game.png");
    assets.push("game_over.png");
    assets.push("cloud.png");
    assets.push("sun.png");
    assets.push("score.png");
    assets.push("sun_attack.png");
    assets.push("cloud_attack.png");
    assets.push("traveler.png");
    assets.push("how.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
