enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Ball = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 133, 132);
    this.image = core.assets["ball.png"];
    this.vx = 0;
    this.vy = 0;
    this.x  = (HQ_GAME_WIDTH - this.width) / 2;
    this.y  = (HQ_GAME_HEIGHT - this.height) / 2;
  },

  isOut: function(){
    var left, bottom, right;
    left   = this.x + this.width < 0;
    bottom = HQ_GAME_HEIGHT < this.y;
    right  = HQ_GAME_WIDTH < this.x;

    return left || bottom || right;
  },

  onenterframe: function(){
    this.vy += 0.2;

    if(this.isOut()){
      var e = new Event("out");
      this.dispatchEvent(e);
    }

    this.x += this.vx;
    this.y += this.vy;
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

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.ball = new Ball();
    this.addChild(this.ball);

    this.count = 0;

    this.score = new Label("0");
    this.score.font = "80px Serif";
    this.score.color = "white";
    this.score.moveTo(1100, 60);
    this.score.addEventListener("enterframe", function(){
      this.text = _this.count.toFixed(0);
    });
    this.addChild(this.score);

    this.ball.addEventListener("out", function(){
      core.gameOverScene = new GameOverScene(_this.count);
      core.replaceScene(core.gameOverScene);
    })
  },

  ontouchstart: function(e){
    var dx, dy, dr,deg;
    dx = e.x - this.ball.x;
    dy = e.y - this.ball.y;
    dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    this.ball.vx = - (dx / dr) * 10;
    this.ball.vy = - (dy / dr * 4 + Math.abs(this.ball.vy) * 0.5);
    this.count++;
  },
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.label = new Label(score.toString());
    this.label.font = "120px Serif";
    this.label.color = "black";
    this.label.x = (HQ_GAME_WIDTH - this.label.width) / 2 + 130;
    this.label.y = (HQ_GAME_HEIGHT - this.label.height) / 2 - 50;

    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("ball.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};