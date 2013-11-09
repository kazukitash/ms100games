// Generated by CoffeeScript 1.6.3
(function() {
  var GameOverScene, GameScene, Hart, ResultText, Submit, TitleScene, core, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  enchant();

  core = {};

  ResultText = ["3年後に結婚する", "1度別れた後、復縁する", "どちらかが浮気をする", "恋人を友達に略奪される", "3人の子供に恵まれる", "恋人の借金が発覚し、別れる", "友達と恋人を争うが最終的にその恋人と結婚する", "おじいちゃん、おばあちゃんになっても手をつないで歩くほど仲良し", "遊ばれてフられる", "喧嘩が多くなるが、なんだかんだ別れない"];

  Submit = (function(_super) {
    __extends(Submit, _super);

    function Submit() {
      Submit.__super__.constructor.call(this);
      this.text = "占う";
      this.width = 600;
      this.textAlign = "center";
      this.moveTo((HQ_GAME_WIDTH - this.width) / 2, 510);
      this.font = "48px Sans-serif";
      this.color = "rgb(224, 134, 174)";
    }

    Submit.prototype.ontouchstart = function() {
      core.gameOverScene = new GameOverScene(Math.floor(Math.random() * 100));
      return core.replaceScene(core.gameOverScene);
    };

    return Submit;

  })(Label);

  Hart = (function(_super) {
    __extends(Hart, _super);

    function Hart() {
      _ref = Hart.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Hart;

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
      var f_birthday, f_name, m_birthday, m_name, submit;
      GameScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game.png"];
      this.addChild(this.bg);
      m_name = new Label("<form name='m_name'>" + "<input type='text' name='text' size='10'>" + "</form>");
      this.addChild(m_name);
      m_birthday = new Label("<form name='m_birthday'>" + "<input type='text' name='text' size='10'>" + "</form>");
      this.addChild(m_birthday);
      f_name = new Label("<form name='f_name'>" + "<input type='text' name='text' size='10'>" + "</form>");
      this.addChild(f_name);
      f_birthday = new Label("<form name='f_birthday'>" + "<input type='text' name='text' size='10'>" + "</form>");
      this.addChild(f_birthday);
      m_name.moveTo(300, 210);
      f_name.moveTo(300, 450);
      m_birthday.moveTo(650, 210);
      f_birthday.moveTo(650, 450);
      core.pause();
      submit = new Submit();
      this.addChild(submit);
    }

    return GameScene;

  })(DOMScene);

  GameOverScene = (function(_super) {
    __extends(GameOverScene, _super);

    function GameOverScene(score) {
      GameOverScene.__super__.constructor.call(this);
      this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
      this.bg.image = core.assets["game_over.png"];
      this.addChild(this.bg);
      this.label = new Label(score.toString() + "%");
      this.label.width = 600;
      this.label.textAlign = "center";
      this.label.font = "96px Sans-serif";
      this.label.color = "rgb(224, 134, 174)";
      this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, 300);
      this.addChild(this.label);
      this.label = new Label(ResultText[Math.floor(Math.random() * 10)]);
      this.label.width = 700;
      this.label.textAlign = "center";
      this.label.font = "18px Sans-serif";
      this.label.color = "rgb(224, 134, 174)";
      this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, 665);
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
    core.preload(assets);
    core.onload = function() {
      this.titleScene = new TitleScene();
      return this.pushScene(this.titleScene);
    };
    return core.start();
  };

}).call(this);
