enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this);
  }
});

var Rikishi = enchant.Class.create(Sprite, {
  initialize: function (width, height) {
    Sprite.call(this, width, height);
    this.vx = 0;
    this.vibePhase = 0;
    this.baseY = this.y;
  },

  stomp: function(){
    this.vx += this.direction();
  },

  onenterframe: function(){
    this.x += this.vx;
    this.y = this.baseY + 10 * Math.sin(this.vibePhase * 1000);
  },
});

var Player = enchant.Class.create(Rikishi, {
  initialize: function () {
    Rikishi.call(this, 155, 207);
    this.moveTo(400, 300);
    this.baseY = 300;
    this.image = core.assets["rikishi1.png"];
  },

  direction: function(){
    return 1;
  }
});

var Enemy = enchant.Class.create(Rikishi, {
  initialize: function () {
    Rikishi.call(this, 155, 207);
    this.moveTo(690, 300);
    this.baseY = 300;
    this.image = core.assets["rikishi2.png"];
  },

  direction: function(){
    return -1;
  }
});

var BigButton = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 145, 139);
    this.image = core.assets["big-btn.png"];
  }
});

var SmallButton = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this, 127, 121);
    this.image = core.assets["small-btn.png"];
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

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["play.png"];
    this.addChild(this.bg);

    this.player = new Player();
    this.addChild(this.player);

    this.enemy = new Enemy();
    this.addChild(this.enemy);

    this.leftSmallButton = new SmallButton();
    this.leftSmallButton.moveTo(200, 300);
    this.addChild(this.leftSmallButton);

    this.leftBigButton = new BigButton();
    this.leftBigButton.moveTo(50, 500);
    this.addChild(this.leftBigButton);

    this.rightSmallButton = new SmallButton();
    this.rightSmallButton.moveTo(1000, 300);
    this.addChild(this.rightSmallButton);

    this.rightBigButton = new BigButton();
    this.rightBigButton.moveTo(1100, 500);
    this.addChild(this.rightBigButton);

    var playerOnTouch = function(){
      _this.player.stomp();
      _this.player.vibePhase++;
    };

    var enemyOnTouch = function(){
      _this.enemy.stomp();
      _this.enemy.vibePhase++;
    };

    this.leftSmallButton.addEventListener("touchstart", playerOnTouch);
    this.leftBigButton.addEventListener("touchstart", playerOnTouch);

    this.rightSmallButton.addEventListener("touchstart", enemyOnTouch);
    this.rightBigButton.addEventListener("touchstart", enemyOnTouch);
  },

  onenterframe: function(){
    if(this.player.intersect(this.enemy)){
      var playerV = this.player.vx;
      var enemyV = this.enemy.vx;

      this.player.vx = enemyV;
      this.enemy.vx  = playerV;
    }

    if(1000 < this.enemy.x){
      this.gameover(true);
    }

    if(this.player.x < 100){
      this.gameover(false);
    }
  },

  gameover: function(isWin){
    core.gameOverScene = new GameOverScene(isWin);
    core.replaceScene(core.gameOverScene);
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function (isWin) {
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    if(isWin){
      this.bg.image = core.assets["gameover1.png"];
    }else{
      this.bg.image = core.assets["gameover2.png"];
    }

    this.addChild(this.bg);
    this.frame = core.frame;
  },

  ontouchstart: function(){
    if(this.frame + 1 * core.fps < core.frame){
      core.replaceScene(core.titleScene);
    }
  }
});

window.onload = function () {
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("start.png");
  assets.push("play.png");
  assets.push("gameover1.png");
  assets.push("gameover2.png");
  assets.push("small-btn.png");
  assets.push("big-btn.png");
  assets.push("rikishi1.png");
  assets.push("rikishi2.png");
  core.preload(assets);

  core.onload = function () {
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};