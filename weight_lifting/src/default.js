enchant();


var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["title.png"];
    this.addChild(this.bg);
  },

  ontouchstart:  function(){
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.meter = 1;

    this.timer = 0.00;
    this.isEnd = false;

    this.timerLabel = new Label(this.timer.toString());
    this.timerLabel.width = 200;
    this.timerLabel.textAlign = "center";
    this.timerLabel.moveTo(15, 40);
    this.timerLabel.font = "64px Sans-serif";
    this.timerLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.timerLabel);

    this.howLabel = new Label("タップ！");
    this.howLabel.width = 300;
    this.howLabel.textAlign = "center";
    this.howLabel.moveTo(980, 35);
    this.howLabel.font = "64px Sans-serif";
    this.howLabel.color = "rgb(24, 24, 24)";
    this.addChild(this.howLabel);
  },

  onenterframe: function(){
    if(!this.isEnd){
      this.timerLabel.text = (this.scene.age / core.fps).toFixed(2).toString();
    }
  },

  ontouchstart: function(){
    this.meter++
    if(this.meter == 30){
      this.bg.image = core.assets["game2.png"];
    } else if(this.meter == 60){
      this.bg.image = core.assets["game3.png"];
      this.timer = (this.scene.age / core.fps).toFixed(2);
      this.timerLabel.text = "終了";
      this.isEnd = true;
      this.tl.delay(60).then(function(){
        core.gameOverScene = new GameOverScene(this.timer);
        core.replaceScene(core.gameOverScene)
      });
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.score = score;
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 150);
    this.scoreLabel.font = "96px Sans-serif";
    this.scoreLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.scoreLabel);
  },

  ontouchstart:  function(){
    core.titleScene = new TitleScene();
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game2.png");
  assets.push("game3.png");
  assets.push("game_over.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};