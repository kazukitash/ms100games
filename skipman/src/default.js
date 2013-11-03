enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this);
  }
});

var SwingButton = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 276, 75);
    this.image = core.assets["btn1.png"];
    this.moveTo(300, 600);
  }
});

var ThrowButton = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 276, 75);
    this.image = core.assets["btn2.png"];
    this.moveTo(600, 600);
  }
});

var SwingBase = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 133, 166);
    this.image = core.assets["buranko1.png"];
    this.moveTo(100, 415);
    this.isScrolling = false;
    this.vx = 0;
  },

  onenterframe: function(){
    if(this.isScrolling){
      this.x -= this.vx;
    }
  }
});

var Boy = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 64, 139);
    this.image = core.assets["buranko2.png"];
    this.moveTo(142, 415);
    this.originX = this.width / 2 - 9;
    this.originY = 0;

    this.angularVelocity = 2;
    this.isScrolling = false;
    this.vx = 0;
  },

  swing: function(){
    this.angularVelocity += 1;
  },

  onenterframe: function(){
    if(this.isScrolling){
      this.x -= this.vx;
    }

    this.rotation -= this.angularVelocity - Math.sin(this.rotation);
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function () {
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["start.png"];
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function () {
    Scene.call(this);
    var _this = this;
    this.bg = new Sprite(2 * HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["play.png"];
    this.bg.addEventListener("enterframe", function(){
      if(this.isScrolling){
        this.x -= this.vx;

        if(this.x < - HQ_GAME_WIDTH){
          this.x = 0;
        }else if(this.x > 0){
          this.x = - HQ_GAME_WIDTH;
        }
      }
    });

    this.addChild(this.bg);

    this.swingButton = new SwingButton();
    this.addChild(this.swingButton);

    this.throwButton = new ThrowButton();
    this.addChild(this.throwButton);

    this.boy = new Boy();
    this.addChild(this.boy);

    this.swingBase = new SwingBase();
    this.addChild(this.swingBase);

    this.touchCount = 0;
    this.shoe = {y: 1};
    this.totalX = 0.0;

    this.swingButton.addEventListener("touchstart", function(){
      _this.boy.swing();
    });

    this.throwButton.addEventListener("touchstart", function(){
      if(_this.touchCount == 0){
        _this.touchCount++;
        var shoe
        shoe = new Sprite(20, 10);
        shoe.image = core.assets["kutu.png"];
        shoe.rotation = _this.boy.rotation;

        shoe.x  = _this.boy.x - 137 * Math.sin((_this.boy.rotation - 15) / 360 * 2 * Math.PI);
        shoe.y  = _this.boy.y + 137 * Math.cos((_this.boy.rotation - 15) / 360 * 2 * Math.PI);;
        shoe.vy = Math.sin(shoe.rotation / 360 * 2 * Math.PI) * _this.boy.angularVelocity;

        shoe.addEventListener("enterframe", function(){
          shoe.y += shoe.vy;

          shoe.vy += 0.1;
        });

        var vx = Math.cos(shoe.rotation / 360 * 2 * Math.PI) * _this.boy.angularVelocity;

        _this.boy.isScrolling = true;
        _this.boy.vx = vx;
        _this.swingBase.isScrolling = true;
        _this.swingBase.vx = vx;
        _this.bg.isScrolling = true;
        _this.bg.vx = vx;

        _this.shoe = shoe;
        _this.addChild(_this.shoe);
      }
    });
  },

  onenterframe: function(){
    if(this.touchCount > 0){
      this.totalX += this.bg.vx;
    }

    if(this.shoe.y > HQ_GAME_HEIGHT){
      core.gameOverScene = new GameOverScene(this.totalX);
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function (score) {
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["gameover.png"];
    this.addChild(this.bg);

    this.label = new Label(Math.abs(score / 100).toFixed(0));
    this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, (HQ_GAME_HEIGHT - this.label.height) / 2);
    this.label.font = "120px Serif";
    this.label.color = "#fff";
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function () {
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("btn1.png");
  assets.push("btn2.png");
  assets.push("buranko1.png");
  assets.push("buranko2.png");
  assets.push("kutu.png");
  assets.push("gameover.png");
  assets.push("start.png");
  assets.push("play.png");
  core.preload(assets);

  core.onload = function () {
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};