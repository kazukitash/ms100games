// Generated by CoffeeScript 1.6.3
(function() {
  var GameScene, Scratch, TitleScene, core,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  Array.prototype.shuffle = function() {
    var i, j, t;
    i = this.length;
    while (i) {
      j = Math.floor(Math.random() * i);
      t = this[--i];
      this[i] = this[j];
      this[j] = t;
    }
    return this;
  };

  Scratch = (function(_super) {
    __extends(Scratch, _super);

    function Scratch(pos) {
      Scratch.__super__.constructor.call(this, 171, 171);
      this.image = core.assets["scratch.png"];
      this.moveTo(pos.x, pos.y);
      this.opacity = 1;
      this.isRevealed = false;
    }

    Scratch.prototype.ontouchmove = function() {
      if (!this.isRevealed) {
        if (this.opacity > 0) {
          return this.opacity -= 0.1;
        } else if (this.opacity < 0) {
          this.opacity = 0;
          return this.isRevealed = true;
        }
      }
    };

    return Scratch;

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
    var ScratchPos;

    __extends(GameScene, _super);

    function GameScene() {
      var atari, label, n, num, pos, scratch;
      GameScene.__super__.constructor.call(this);
      this.length = 0;
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      this.number = [1, 1, 2, 2, 3, 3, 4, 4];
      atari = Math.floor(Math.random() * 4) + 1;
      this.number.push(atari);
      this.number.shuffle();
      this.shoukinList = ["1,000,000,000", "1,000,000", "10,000", "1,000"];
      this.shoukin = 0;
      this.revealedNumber = [];
      this.limit = 2;
      this.scratchList = [];
      n = 0;
      while (n < 9) {
        num = this.number[n];
        label = new Label(num);
        label.width = 171;
        label.textAlign = "center";
        pos = ScratchPos[n];
        label.moveTo(pos.x, pos.y + 45);
        label.font = "64px Sans-serif";
        label.color = "rgb(24, 24, 24)";
        this.addChild(label);
        scratch = new Scratch(ScratchPos[n]);
        this.addChild(scratch);
        this.scratchList.push(scratch);
        n++;
      }
    }

    ScratchPos = [
      {
        x: 83,
        y: 102
      }, {
        x: 267,
        y: 102
      }, {
        x: 443,
        y: 102
      }, {
        x: 83,
        y: 279
      }, {
        x: 267,
        y: 279
      }, {
        x: 443,
        y: 279
      }, {
        x: 83,
        y: 463
      }, {
        x: 267,
        y: 463
      }, {
        x: 443,
        y: 463
      }
    ];

    GameScene.prototype.onenterframe = function() {
      var lank, length, scratch, _results;
      if (this.limit < 0) {
        if ((this.revealedNumber[0] === this.revealedNumber[1]) && (this.revealedNumber[0] === this.revealedNumber[2])) {
          lank = this.revealedNumber[0];
          console.log(lank);
          this.shoukin = this.shoukinList[0];
          this.success();
        } else {
          this.failure();
        }
      }
      length = this.scratchList.length;
      _results = [];
      while (length) {
        scratch = this.scratchList[--length];
        if (scratch.isRevealed) {
          this.limit--;
          this.revealedNumber.push(this.number[length]);
          _results.push(scratch.isRevealed = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    GameScene.prototype.failure = function() {
      this.label = new Label("残念");
      this.label.width = 900;
      this.label.textAlign = "center";
      this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, 150);
      this.label.font = "64px Sans-serif";
      this.label.color = "rgb(24, 24, 24)";
      this.addChild(this.label);
      return this.tl.delay(30).then(function() {
        return core.replaceScene(core.titleScene);
      });
    };

    GameScene.prototype.success = function() {
      this.label = new Label(this.shoukin + "円獲得！");
      this.label.width = 900;
      this.label.textAlign = "center";
      this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, 150);
      this.label.font = "64px Sans-serif";
      this.label.color = "rgb(24, 24, 24)";
      this.addChild(this.label);
      return this.tl.delay(30).then(function() {
        return core.replaceScene(core.titleScene);
      });
    };

    return GameScene;

  })(Scene);

  window.onload = function() {
    var assets;
    core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    assets = [];
    assets.push("title.png");
    assets.push("game.png");
    assets.push("scratch.png");
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
