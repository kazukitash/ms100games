// Generated by CoffeeScript 1.6.3
(function() {
  var Flower, FlowerOpt, GameOverScene, GameScene, TitleScene, core,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  FlowerOpt = [
    {
      x: 61,
      y: -20,
      image: "flower1.png"
    }, {
      x: 538,
      y: 6 - 42,
      image: "flower2.png"
    }, {
      x: 968,
      y: 39 - 42,
      image: "flower3.png"
    }, {
      x: 109,
      y: 373 - 42,
      image: "flower4.png"
    }, {
      x: 578,
      y: 272 - 42,
      image: "flower5.png"
    }, {
      x: 895,
      y: 387 - 42,
      image: "flower6.png"
    }
  ];

  Flower = (function(_super) {
    __extends(Flower, _super);

    function Flower(options) {
      Flower.__super__.constructor.call(this, 220, 250);
      this.image = core.assets[options.image];
      this.moveTo(options.x, options.y);
      this.frame = 0;
      this.power = 0;
      this.isBloomed = false;
    }

    Flower.prototype.onenterframe = function() {
      if (this.power !== 0) {
        this.power--;
      }
      if (this.power > 300) {
        this.isBloomed = true;
        return this.frame = 2;
      } else if (this.power > 100) {
        this.isBloomed = false;
        return this.frame = 1;
      } else {
        return this.frame = 0;
      }
    };

    Flower.prototype.ontouchmove = function() {
      if (this.power <= 600) {
        return this.power += 7;
      }
    };

    return Flower;

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
      var flower, i, _i, _this;
      GameScene.__super__.constructor.call(this);
      _this = this;
      this.v = -0.5;
      this.bloom = 0;
      this.bg = new Sprite(HQ_GAME_WIDTH, 2 * HQ_GAME_HEIGHT);
      this.bg.image = core.assets["bg.png"];
      this.addChild(this.bg);
      this.moveTo(0, 0);
      this.bg.addEventListener("enterframe", function() {
        this.y += _this.v;
        if (this.y <= -HQ_GAME_HEIGHT) {
          if (_this.bloom >= 6) {
            core.gameOverScene = new GameOverScene(0);
            return core.replaceScene(core.gameOverScene);
          } else {
            core.gameOverScene = new GameOverScene(1);
            return core.replaceScene(core.gameOverScene);
          }
        }
      });
      this.front = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.front.image = core.assets["game.png"];
      this.addChild(this.front);
      this.flowers = [];
      for (i = _i = 0; _i <= 5; i = ++_i) {
        flower = new Flower(FlowerOpt[i]);
        this.addChild(flower);
        this.flowers.push(flower);
      }
    }

    GameScene.prototype.onenterframe = function() {
      var i, _i, _results;
      console.log(this.bloom);
      this.bloom = 0;
      _results = [];
      for (i = _i = 0; _i <= 5; i = ++_i) {
        if (this.flowers[i].isBloomed) {
          _results.push(this.bloom++);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
      if (score === 0) {
        this.scoreLabel = new Label("成功");
        this.scoreLabel.width = 900;
        this.scoreLabel.textAlign = "center";
        this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 530);
        this.scoreLabel.font = "128px Sans-serif";
        this.scoreLabel.color = "red";
        this.addChild(this.scoreLabel);
      } else {
        this.scoreLabel = new Label("残念");
        this.scoreLabel.width = 900;
        this.scoreLabel.textAlign = "center";
        this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 530);
        this.scoreLabel.font = "128px Sans-serif";
        this.scoreLabel.color = "blue";
        this.addChild(this.scoreLabel);
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
    assets.push("game_over.png");
    assets.push("bg.png");
    assets.push("flower1.png");
    assets.push("flower2.png");
    assets.push("flower3.png");
    assets.push("flower4.png");
    assets.push("flower5.png");
    assets.push("flower6.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
