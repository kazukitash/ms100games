enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var CountUpTimer = enchant.Class.create(Label, {
  initialize: function(){
    Label.call(this, "0.00");
    this.startAt = Infinity;
  },

  start: function(){
    this.startAt = core.frame;
  },

  currentFrame: function(){
    return core.frame - this.startAt;
  },

  currentSec: function(){
    return this.currentFrame() / core.fps;
  },

  onenterframe: function(){
    this.text = this.currentSec().toFixed(2);
  }
});

var Bar = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 170, 27);
    this.image = core.assets["stick.png"];
    this.x = (HQ_GAME_WIDTH - this.width) / 2;
    this.y = 600;
  },
});

var Ball = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 31, 31);
    this.image = core.assets["ball.png"];
    this.x = 230;
    this.y = 270;
    this.vx = 9;
    this.vy = 9;
  },

  onenterframe: function(){
    if(this.x + this.vx < 0 || HQ_GAME_WIDTH < this.x + this.width + this.vx){
      this.vx *= - 1.0;
    }

    if(this.y + this.vy < 70) {
      this.vy *= - 1.0;
    }else if(HQ_GAME_HEIGHT < this.y + this.height + this.vy && this.y + this.height < HQ_GAME_HEIGHT){
      var e = new Event("out");
      this.dispatchEvent(e);
    }

    this.x += this.vx;
    this.y += this.vy;
  }
});

var Block = enchant.Class.create(Sprite, {
  initialize: function(options){
    Sprite.call(this, 106, 40);
    this.image = core.assets["block.png"];
    this.frame = options.frame || 0;
    this.hitAt = Infinity;
    this.moveAt(options.place);
  },

  moveAt: function(place){
    var line = Math.floor(place / 12);
    var colm = place % 12;
    this.moveTo(colm * 106, line * 40 + 100);
  },

  hit: function(){
    this.hitAt = core.frame;
  },

  isHit: function(){
    return this.hitAt < core.frame;
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
    this.blocks = [];

    this.timer = new CountUpTimer();
    this.timer.start();
    this.timer.color = "white";
    this.timer.font = "30px Serif";
    this.timer.moveTo(300, 25);
    this.addChild(this.timer);

    this.ball = new Ball();
    this.ball.addEventListener("out", function(){
      _this.gameOver({out: true});
    });

    this.addChild(this.ball);

    this.bar = new Bar();
    this.addChild(this.bar);

    for(var i = 0; i < 48; i++){
      var frame = Math.floor(Math.random() * 8);
      var block = new Block({place: i, frame: frame});
      this.blocks.push(block);
      this.addChild(block);
    }
  },

  gameOver: function(options){
    core.gameOverScene = new GameOverScene(options);
    core.replaceScene(core.gameOverScene);
  },

  ontouchstart: function(e){
    this.bar.x = e.x - this.bar.width / 2;
  },

  ontouchmove: function(e){
    this.bar.x = e.x - this.bar.width / 2;
  },

  onenterframe: function(){
    var _this = this;

    var remainingBlocks = _this.blocks.filter(function(block){
      return !block.isHit();
    })

    if(remainingBlocks.length < 1){
      _this.gameOver({time: _this.timer.currentSec()});
    }

    this.blocks.forEach(function(block, index, blocks){
      if(_this.ball.intersect(block) && !block.isHit()){
        block.hit();
        _this.removeChild(block);
        _this.ball.vy *= - 1.0;


      }
    })

    if(this.ball.intersect(this.bar)){
      this.ball.vy *= - 1.0;
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(options){
    Scene.call(this);

    var time = options.time;
    var out  = options.out  || false;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    if(out){
      this.bg.image = core.assets["gameover-image1.png"];
    }else{
      this.bg.image = core.assets["game_over.png"];
    }

    this.addChild(this.bg);

    if(!out){
      this.label = new Label(time.toFixed(2));
      this.label.font = "120px Serif";
      this.label.color = "white";
      this.label.x = (HQ_GAME_WIDTH - this.label.width) / 2;
      this.label.y = (HQ_GAME_HEIGHT - this.label.height) / 2 - 100;
      this.addChild(this.label);

      this.timeSprite = new Sprite(244, 50);
      this.timeSprite.image = core.assets["time.png"];
      this.timeSprite.moveTo((HQ_GAME_WIDTH - this.timeSprite.width) / 2, (HQ_GAME_HEIGHT - this.timeSprite.height) / 2 - 300);
      this.addChild(this.timeSprite);
    }
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
  assets.push("gameover-image1.png");
  assets.push("ball.png");
  assets.push("block.png");
  assets.push("gameover-text.png");
  assets.push("time.png");
  assets.push("stick.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};