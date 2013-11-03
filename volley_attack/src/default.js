enchant();

var II = {
  Ball: {
    Width: 42,
    Height: 42
  },
  Player: {
    Width: 55,
    Height: 102
  }
}

var CountDownTimer = enchant.Class.create(Label, {
  initialize: function(sec) {
    Label.call(this);

    this.frame   = sec * core.fps;
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
    return this.frame - core.frame + this.startAt;
  },

  remainingSec: function(){
    return this.remainingFrame() / core.fps;
  },

  bonus: function(bonus){
    this.frame += bonus * core.fps;
  },

  onenterframe: function(){
    if(!this.isStopped()){
      this.text = this.remainingSec().toFixed(2);
    }

    if(this.remainingFrame() == 0){
      this.stop();

      var e = new Event("over");
      this.dispatchEvent(e);
    }
  }
});

var Ball = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Ball.Width, II.Ball.Height);
    this.image = core.assets["ball.png"];
    this.vx = 0;
    this.vy = 0;

    this.moveTo(1280,0);

    this.isStart = false;
    this.isHit = false;
    this.startAt = Infinity;
  },

  onenterframe: function(){
    if(this.isStart){
      this.vy += 1;
      this.moveBy(this.vx, this.vy);
      if(core.frame == this.startAt + 55){
        this.vy = -13;
        this.vx = 2;
        this.tl.fadeOut(20);
      } else if(core.frame == this.startAt + 75){
        this.isStart = false;
      }
    }
    if(this.isHit){
      this.moveBy(this.vx, this.vy);
      if(this.y > 500){
        this.vx = -50;
        this.vy = -40;
      }
      if(core.frame == this.startAt + 75){
        this.isHit = false;
      }
    }
  },

  start: function(){
    this.isStart = true;
    this.startAt = core.frame;
    this.opacity = 1;
    this.scale(4,4);
    this.moveTo(500, 720);
    this.vx = 4;
    this.vy = -35;
    this.tl.scaleTo(0.8,0.8, 45);
  },

  hit: function(){
    this.isStart = false;
    this.isHit = true;
    this.vx = -60;
    this.vy = 40;
  }
});

var Player = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Player.Width, II.Player.Height);
    this.image = core.assets["player.png"];
    this.vx = 0;
    this.vy = 0;
    this.frame = [0,0,0,1,1,1]
    this.moveTo(1280,0);

    this.isJump = false;

    this.jumpAt = Infinity;
  },

  onenterframe: function(){
    if(this.isJump){
      this.moveBy(this.vx, this.vy);
      this.vy += 1;
      if(core.frame - 48 > this.jumpAt){
        this.isJump = false;
        this.scaleX = -1;
        this.frame = [0,0,0,1,1,1]
        this.tl.resume();
      }
    }
  },

  start: function(){
    this.frame = [0,0,0,1,1,1]
    this.moveTo(1280, 500);
    this.tl.moveTo(770, 500, 30).then(function(){
      this.frame = 2;
      this.vx = -3;
      this.vy = -24;
      this.jumpAt = core.frame;
      this.isJump = true;
      this.tl.pause();
    }).moveBy(144,-60,30).and().scaleTo(-0.8, 0.8, 30).moveTo(1280, 440, 30);
    this.scaleX = 1;
    this.scaleY = 1;
  },

  attack: function(){
    this.frame = 3;
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

    this.player1 = new Player();
    this.addChild(this.player1);

    this.player2 = new Player();
    this.addChild(this.player2);

    this.ball = new Ball();
    this.addChild(this.ball);

    this.count = 0;

    this.score = 0;
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(980, 20);
    this.scoreLabel.font = "64px Sans-serif";
    this.scoreLabel.color = "rgb(34, 42, 46)";
    this.addChild(this.scoreLabel);

    var _this = this;
    this.timer = new CountDownTimer(30);
    this.timer.width = 300;
    this.timer.textAlign = "center";
    this.timer.moveTo(0, 20);
    this.timer.font = "64px Sans-serif";
    this.timer.color = "rgb(34, 42, 46)";
    this.timer.addEventListener("over", function(){
      core.gameOverScene = new GameOverScene(_this.score);
      core.replaceScene(core.gameOverScene);
    });

    this.timer.start();
    this.addChild(this.timer);
  },

  onenterframe: function(){
    if(core.frame % 90 == 0){
      this.count = 0;
      this.ball.start();
    }
    if((core.frame + 90) % 180 == 0){
      this.player1.start();
    }
    if(core.frame % 180 == 0){
      this.player2.start();
    }
  },

  ontouchstart: function(){
    if(core.frame - this.ball.startAt > 48 && core.frame - this.ball.startAt < 55 && this.count == 0){
      this.player1.attack();
      this.player2.attack();
      this.ball.hit();
      this.score++;
      this.timer.bonus(Math.floor(Math.random() * 4 + 1));
      this.scoreLabel.text = this.score.toString();
    }
    this.count++;
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
    this.scoreLabel.moveTo(980, 20);
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
  assets.push("player.png");
  assets.push("ball.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};