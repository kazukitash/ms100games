enchant();

window.onload = function(){
  var core = new Core(GAME_WIDTH, GAME_HEIGHT);
  core.preload(["title.png", "bg.png", "gameover2.png", "ball.png", "bat.png"]);

  var PlayScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
      enchant.Scene.call(this);

      var playing = new Sprite(GAME_WIDTH, GAME_HEIGHT);
      playing.image = core.assets["bg.png"];
      this.addChild(playing);

      this.ballsCount = 10;
      this.score = 0;
      this.randomNumber = function(){ return core.frame + 20 + 20 * Math.floor(Math.random() * 2)}();

      var scoreLabel = new Label("0");
      scoreLabel.font = "32px Serif";
      scoreLabel.x = 750;
      scoreLabel.y = 120;
      this.addChild(scoreLabel);

      var ballsLabel = new Label(this.ballsCount);
      ballsLabel.font = "32px Serif";
      ballsLabel.x = 750;
      ballsLabel.y = 40;
      this.addChild(ballsLabel)

      var ball = new Ball();
      var bat  = new Bat();
      this.addChild(bat);

      this.addEventListener("enterframe", function(){
        if(core.frame == this.randomNumber){
          this.addChild(ball);
          ball.move();
        }

        if(ball.y < 0){
          ball = new Ball()
          this.ballsCount--;
          this.score++;
          scoreLabel.text = this.score;
          ballsLabel.text = this.ballsCount;
          core.frame = 0;
          this.randomNumber = 100 + core.frame;
          bat.rotation = 0;
          bat.isSwung = false;
        }else if(ball.y > GAME_HEIGHT){
          ball = new Ball()
          this.ballsCount--;
          bat.rotation = 0;
          bat.isSwung = false;
          ballsLabel.text = this.ballsCount;
          core.frame = 0;
          this.randomNumber = 100 + core.frame;
          bat.rotation = 0;
          bat.isSwung = false;
        }

        if(this.ballsCount == 0){
          core.replaceScene(new GameOverScene(this.score));
        }
      });

      this.addEventListener("touchstart", function(){
        if(!bat.isSwung){
          if(ball.within(bat, 38)){
            ball.v = - 20;
            ball.hit = true;
          }
          bat.swing();
        }
      });
    }
  });

  var GameOverScene = enchant.Class.create(enchant.Scene, {
    initialize: function(score){
      enchant.Scene.call(this);

      var gameover = new Sprite(GAME_WIDTH, GAME_HEIGHT);
      gameover.image = core.assets["gameover2.png"];
      this.addChild(gameover);

      var scoreLabel   = new Label(score.toString());
      scoreLabel.font  = "48px Serif"
      scoreLabel.color = "rgb(230, 230, 125)";
      scoreLabel.x     = 420;
      scoreLabel.y     = 370;
      this.addChild(scoreLabel);

      this.addEventListener("touchstart", function(){
        core.replaceScene(core.rootScene);
        core.frame = 0;
      });
    }
  });

  var Ball = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
      enchant.Sprite.call(this, 22, 22);
      this.image = core.assets["ball.png"];
      this.x = 400;
      this.y = 350;
      this.v = (function(){ return 2 + Math.floor(Math.random() * 3) * 3})();
      this.hit = false;
      this.moving = false;

      this.addEventListener("enterframe", function(){
        if(this.moving){
          this.y += this.v;
          this.rotate(10);
        }

        if(this.y < 0){ this.hit = true }
        if(this.hit){
          this.scale(0.9, 0.9);
        }
      });
    },

    move: function(){
      this.moving = true;
    }
  });

  var Bat = enchant.Class.create(enchant.Sprite, {
    initialize: function(){
      enchant.Sprite.call(this, 251, 51);
      this.image = core.assets["bat.png"];
      this.x = 250;
      this.y = 500;
      this.isSwinging = false;
      this.isSwung    = false;
      this.addEventListener("enterframe", function(){
        if(this.isSwinging && this.rotation < - 90){
          this.isSwinging = false;
        }else if(this.isSwinging){
          this.rotate(-15);
        }
      });
    },

    swing: function(){
      this.isSwinging = true;
      this.isSwung    = true;
    }
  });

  core.onload = function(){
    var playScene = new PlayScene();

    var title = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    title.image = core.assets["title.png"]
    core.rootScene.addChild(title);

    core.rootScene.addEventListener("touchstart", function(){
      core.replaceScene(new PlayScene());
    });
  };

  core.start();
}
