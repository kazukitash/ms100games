// Generated by CoffeeScript 1.6.3
(function() {
  var BadGameOverScene, CountDownTimer, GameOverScene, GameScene, Hand, LeftHand, RightHand, Runner, TitleScene, core, _ref,
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

  Runner = (function(_super) {
    __extends(Runner, _super);

    function Runner() {
      Runner.__super__.constructor.call(this, 300, 300);
      this.image = core.assets[""];
    }

    return Runner;

  })(Sprite);

  Hand = (function(_super) {
    __extends(Hand, _super);

    function Hand() {
      _ref = Hand.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Hand.prototype.rumble = function() {
      this.x = this.baseX + 10 * Math.random() - 5;
      return this.y = this.baseY + 10 * Math.random() - 5;
    };

    return Hand;

  })(Sprite);

  RightHand = (function(_super) {
    __extends(RightHand, _super);

    function RightHand() {
      RightHand.__super__.constructor.call(this, 811, 475);
      this.image = core.assets["right-hand.png"];
      this.baseX = 500;
      this.baseY = 200;
      this.moveTo(this.baseX, this.baseY);
    }

    return RightHand;

  })(Hand);

  LeftHand = (function(_super) {
    __extends(LeftHand, _super);

    function LeftHand() {
      LeftHand.__super__.constructor.call(this, 810, 474);
      this.image = core.assets["left-hand.png"];
      this.baseX = 0;
      this.baseY = 200;
      this.moveTo(this.baseX, this.baseY);
    }

    return LeftHand;

  })(Hand);

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
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.length = 0;
      this.timer = new CountDownTimer(10);
      this.timer.start();
      this.timer.font = "80px Serif";
      this.timer.color = "black";
      this.timer.moveTo(50, 50);
      this.addChild(this.timer);
      this.right = new RightHand();
      this.addChild(this.right);
      this.left = new LeftHand();
      this.addChild(this.left);
      this.timer.addEventListener("over", function() {
        core.gameOverScene = new BadGameOverScene();
        return core.replaceScene(core.gameOverScene);
      });
    }

    GameScene.prototype.ontouchstart = function() {
      this.length++;
      this.right.rumble();
      this.left.rumble();
      if (this.length > 50) {
        core.gameOverScene = new GameOverScene(this.timer.remainingSec());
        return core.replaceScene(core.gameOverScene);
      }
    };

    return GameScene;

  })(Scene);

  GameOverScene = (function(_super) {
    __extends(GameOverScene, _super);

    function GameOverScene() {
      GameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over2.png"];
      this.addChild(this.bg);
      this.startAt = core.frame;
    }

    GameOverScene.prototype.ontouchstart = function() {
      if (this.startAt + core.fps * 2 < core.frame) {
        return core.replaceScene(core.titleScene);
      }
    };

    return GameOverScene;

  })(Scene);

  BadGameOverScene = (function(_super) {
    __extends(BadGameOverScene, _super);

    function BadGameOverScene() {
      BadGameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over1.png"];
      this.addChild(this.bg);
      this.startAt = core.frame;
    }

    BadGameOverScene.prototype.ontouchstart = function() {
      if (this.startAt + core.fps * 2 < core.frame) {
        return core.replaceScene(core.titleScene);
      }
    };

    return BadGameOverScene;

  })(Scene);

  window.onload = function() {
    var assets;
    core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    assets = [];
    assets.push("title.png");
    assets.push("game.png");
    assets.push("game_over1.png");
    assets.push("game_over2.png");
    assets.push("right-hand.png");
    assets.push("left-hand.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
