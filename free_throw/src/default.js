enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Basket = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 122, 106);
    this.image = core.assets["basket.png"];
    this.moveTo(540, 190);
  }
});

var Ball = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 252, 252);
    this.moveTo(480, HQ_GAME_HEIGHT - this.height + 100);
    this.image = core.assets["ball.png"];
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.depth  = 0.0;
    this.touched = false;
    this.thrown = false;
    this.touchStartPoint = [];
    this.touchEndPoint   = [];
  },

  isFalling: function(){
    return this.touched && this.thrown && this.vy > 0;
  },

  direction: function(){
    return Math.atan(this.y / this.x);
  },

  ontouchstart: function(e){
    if(!this.touched){
      this.touchStartPoint = [e.x, e.y];
    }
  },

  ontouchend: function(e){
    if(!this.touched){
      this.touchEndPoint = [e.x, e.y];
      this.vx = this.touchEndPoint[0] - this.touchStartPoint[0];
      this.vy = this.touchEndPoint[1] - this.touchStartPoint[1];
      this.vz = 10;
      this.touched = true;
      this.thrown = true;
    }
  },

  onenterframe: function(){
    if(this.thrown){
      this.x += this.vx * 0.1;
      this.y += this.vy * 0.1;
      this.depth += this.vz;
      this.scaleX = 1.0 - this.depth / 600;
      this.scaleY = 1.0 - this.depth / 600;
      this.vy += 10;

      if(this.vy > 0 && this.y > HQ_GAME_HEIGHT - this.height){
        this.vy *= -0.3;
        this.vx *=  0.3;
      }

      if(this.depth > 400){
        this.vz = 0;
      }
    }
  }
});

var Goal = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 416, 228);
    this.moveTo(400, 0);
    this.image = core.assets["goal.png"];
  }
});

var Ring = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 25, 25);
    this.moveTo(400, 0);
    // this.image = core.assets["ball.png"];
    this.frame = 13;
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_WIDTH);
    this.bg.image = core.assets["title.png"];
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    var _this = this;

    this.cleared = false;
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.goal = new Goal();
    this.addChild(this.goal);

    this.basket = new Basket();
    this.addChild(this.basket);

    this.ball = new Ball();
    this.addChild(this.ball);

    this.rRing = new Ring();
    this.rRing.moveTo(530, 190);
    this.addChild(this.rRing);

    this.lRing = new Ring();
    this.lRing.moveTo(650, 190);
    this.addChild(this.lRing);

    var onringwithin = function(){
      if(_this.ball.isFalling()){
        if(this.within(_this.ball, 50)){
          var ball = _this.ball;
          // ball.vx *= - 0.6;
          ball.vy *= - 0.6;
        }
      }
    }

    this.rRing.addEventListener("enterframe", onringwithin);
    this.lRing.addEventListener("enterframe", onringwithin);
  },

  onenterframe: function(){
    if(this.ball.vy > 0 && this.basket.within(this.ball, 50)){
      var direction = this.ball.direction();
      var isCorrectDirection = - 10.0 < direction && direction < 10.0;

      if(isCorrectDirection){
        this.cleared = true;
      }
    }

    // z-index of Ball and Basket.
    if(this.ball.vy > 0){
      this.removeChild(this.basket);
      this.addChild(this.basket);
    }

    if(Math.abs(this.ball.y - 470) < 2 && Math.abs(this.ball.vy) < 30){
      core.gameOverScene = new GameOverScene();
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.titleScene = new TitleScene();
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("goal.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("ball.png");
  assets.push("basket.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
