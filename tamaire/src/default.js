enchant();

var II = {
  Ball: {
    Width: 42,
    Height: 42
  },
  Cage: {
    Width: 124,
    Height: 126
  }
}

var CountUpTimer = enchant.Class.create(Label, {
  initialize: function() {
    Label.call(this);

    this.startAt = Infinity;
    this.stopAt  = Infinity;
  },

  start: function(){
    this.startAt = core.frame;
  },

  stop: function(){
    this.stopAt = core.frame;
  },

  isStarted: function(){
    return this.startAt < core.frame;
  },

  isStopped: function(){
    return this.stopAt < core.frame;
  },

  remainingFrame: function(){
    return core.frame - this.startAt;
  },

  remainingSec: function(){
    return this.remainingFrame() / core.fps;
  },

  penalty: function(penalty){
    this.startAt -= penalty * core.fps;
  },

  onenterframe: function(){
    if(!this.isStopped()){
      this.text = this.remainingSec().toFixed(2);
    }
  }
});

var Ball = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Ball.Width, II.Ball.Height);
  },

  ontouchstart: function(e){
    this.moveTo(e.x, e.y);
  },

  ontouchmove: function(e){
    this.moveTo(e.x, e.y);
  }
});

var RedBall = enchant.Class.create(Ball, {
  initialize: function(){
    Ball.call(this);
    this.image = core.assets["red_ball.png"];
  }
});

var WhiteBall = enchant.Class.create(Ball, {
  initialize: function(){
    Ball.call(this);
    this.image = core.assets["white_ball.png"];
  }
});

var Cage = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Cage.Width, II.Cage.Height);
    this.image = core.assets["cage.png"]
    this.moveTo(900, 100);
  }
});

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

    this.cage = new Cage();
    this.addChild(this.cage);

    this.rBallList = [];
    this.wBallList = [];

    var i = 13;
    while(i){
      var rBall = new RedBall();
      rBall.moveTo(Math.random() * 1195 + 45 - 21, Math.random() * 370 + 310 - 21);
      this.rBallList.push(rBall);
      this.addChild(rBall);
      var wBall = new WhiteBall();
      wBall.moveTo(Math.random() * 1195 + 45 - 21, Math.random() * 370 + 310 - 21);
      this.wBallList.push(wBall);
      this.addChild(wBall);
      i--;
    }

    this.score = 0;

    this.timer = new CountUpTimer();
    this.timer.width = 300;
    this.timer.textAlign = "center";
    this.timer.moveTo(0, 20);
    this.timer.font = "64px Sans-serif";
    this.timer.color = "rgb(34, 42, 46)";

    this.timer.start();
    this.addChild(this.timer);
  },

  ontouchstart: function(e){
    console.log(e.x, e.y);
  },

  onenterframe: function(){
    var rBallLength = this.rBallList.length
    while(rBallLength){
      var rBall = this.rBallList[--rBallLength];
      if(this.cage.intersect(rBall)){
        this.score++;
        this.rBallList.splice(rBallLength, 1);
        this.removeChild(rBall);
        this.cage.tl.moveBy(5, 0, 3).moveBy(-10, 0, 3).moveBy(10, 0, 3).moveBy(-5, 0, 3);
      }
    }
    var wBallLength = this.wBallList.length
    while(wBallLength){
      var wBall = this.wBallList[--wBallLength];
      if(this.cage.intersect(wBall)){
        this.timer.penalty(10);
        this.wBallList.splice(wBallLength, 1);
        this.removeChild(wBall);

        var cage = new Cage();
        this.addChild(cage);
        var _this = this;
        cage.tl.scaleTo(1.2, 1.2, 5).fadeOut(10).then(function(){
          _this.removeChild(cage);
        });
      }
    }
    var _this = this;
    if(this.score == 13){
      _this.timer.stop();
      core.gameOverScene = new GameOverScene(_this.timer.remainingSec());
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(time){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.score = time;
    this.scoreLabel = new Label(this.score.toFixed(2).toString() + "秒");
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(0, 20);
    this.scoreLabel.font = "64px Sans-serif";
    this.scoreLabel.color = "rgb(34, 42, 46)";
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
  assets.push("game_over.png");
  assets.push("red_ball.png");
  assets.push("white_ball.png");
  assets.push("cage.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};