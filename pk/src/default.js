enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Ball = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 75, 77);
    this.startAt = Infinity;
    this.course  = 1;
    this.baseX = (HQ_GAME_WIDTH - this.width) / 2;
    this.baseY = 100;

    this.image = core.assets["ball.png"];
    this.moveTo(this.baseX, this.baseY);
  },

  shoot: function(){
    this.startAt = core.frame;
  },

  moveOnCourse: function(){
    var t = core.frame - this.startAt;

    switch(this.course){
      case 1:
      var p = 20
      this.x = this.baseX - (Math.pow(t - p, 2) - Math.pow(p, 2));
      this.y = this.baseY + t * 18;
      break;

      case 0:
      this.y = this.baseY + t * 18
      break;

      case 2:
      var p = 20
      this.x = this.baseX + (Math.pow(t - p, 2) - Math.pow(p, 2));
      this.y = this.baseY + t * 18;
      break;
    }
  },

  stop: function(){
    this.startAt = Infinity;
  },

  isStopped: function(){
    return this.startAt == Infinity;
  },

  onenterframe: function(){
    if(this.startAt < core.frame){
      this.moveOnCourse();
    }

    if(HQ_GAME_HEIGHT < this.y + this.height){
      var e = new Event("out");
      this.dispatchEvent(e);
    }
  }
});

var Player = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 210, 280);
    this.getReady();
  },

  getReady: function(){
    this.image  = core.assets["player-front.png"];
    this.width  = 210;
    this.height = 280;
    this.x = (HQ_GAME_WIDTH - this.width) / 2;
    this.y = 400;
  },

  goRight: function(){
    this.image  = core.assets["player-right.png"];
    this.width  = 272;
    this.height = 233;
    this.x      = 900;
    this.y      = 450;
  },

  goLeft: function(){
    this.image  = core.assets["player-left.png"];
    this.width  = 272;
    this.height = 233;
    this.x      = 100;
    this.y      = 450;
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
    var _this = this;
    this.endAt = Infinity;
    this.balls = [];
    this.remainingBallsCount = 50;
    this.catchedBallsCount = 0;

    this.endAt = 0;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.ballsGroup = new Group();
    this.addChild(this.ballsGroup);

    this.player = new Player();
    this.addChild(this.player);

    this.catchDialog = new Sprite(668, 172);
    this.catchDialog.image = core.assets["catch.png"];


    this.goalDialog  = new Sprite(508, 175);
    this.goalDialog.image = core.assets["goal.png"];

    this.label = new Label("");
    this.label.font = "80px Serif";
    this.label.color = "white";
    this.label.moveTo(100, 30);
    this.addChild(this.label);
  },

  addOneBall: function(){
    var ball, random;

    ball = new Ball(random);
    ball.course = Math.floor(Math.random() * 3);
    ball.shoot()

    ball.addEventListener("out", function(){
      // console.log("out");
    });

    this.balls.push(ball);
    this.ballsGroup.addChild(ball);
  },

  ontouchstart: function(e){
    if(this.endAt < core.frame){
      if(e.x < HQ_GAME_WIDTH / 3){
        this.player.goLeft();
      }else if(HQ_GAME_WIDTH * 2 / 3 < e.x){
        this.player.goRight();
      }else{
        this.player.getReady();
      }
    }
  },

  onenterframe: function(){
    var i = this.balls.length;
    while(i){
      var ball = this.balls[--i]
      if(this.player.within(ball, 100) && ball.isStopped){
        var e = new Event("stop");
        e.ball = ball;
        this.dispatchEvent(e);
        this.balls.splice(i, 1);
      }
    }

    if(core.frame % 15 == 0 && this.remainingBallsCount > 0){
      this.remainingBallsCount--;
      this.addOneBall();
    }

    if(this.remainingBallsCount == 0){
      this.remainingBallsCount--;
      core.gameOverScene = new GameOverScene(this.catchedBallsCount);
      core.replaceScene(core.gameOverScene)
    }

    this.label.text = this.remainingBallsCount.toString();
  },

  onstop: function(e, ball){
    var ball = e.ball;
    ball.stop();
    this.catchedBallsCount++;
    this.ballsGroup.removeChild(ball);
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.label = new Label("");
    this.label.font = "80px Serif";
    this.label.color = "black";
    this.label.text = score.toString();
    this.label.moveTo(600, 350);
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene)
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("ball.png");
  assets.push("catch.png");
  assets.push("goal.png");
  assets.push("player-front.png");
  assets.push("player-right.png");
  assets.push("player-left.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};