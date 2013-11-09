enchant();

var Door = enchant.Class.create(Sprite, {
  onenterframe: function(){
    this.x = GAME_WIDTH / 2 - this.direction() * ( 100 + 100 * Math.cos(0.025 * core.frame) );
  }
});

var LeftDoor = enchant.Class.create(Door, {
  initialize: function(score){
    Door.call(this, 369, 163);
    this.image = core.assets["matte-ya2_2.png"];
    this.score = score;
  },

  direction: function(){
    vx = this.score * 0.1 + 1;
    return vx;
  },

  x: {
    get: function() {
      return this._x;
    },
    set: function(x) {
      this._x = x - this.width;
      this._dirty = true;
    }
  }
});

var RightDoor = enchant.Class.create(Door, {
  initialize: function(score){
    Door.call(this, 369, 163);
    this.image = core.assets["matte-ya2_3.png"];
    this.score = score;
  },

  direction: function(){
    vx = this.score * -0.1 - 1;
    return vx;
  }
});

var Player = enchant.Class.create(Sprite, {
  initialize: function(score){
    Sprite.call(this, 95, 153);
    this.image = core.assets["matte-ya2_4.png"];
    this.vx = 6 + score;
    this.vy = 10;
    this.isRushed = false;

    this.moveTo(0,420);
  },

  onenterframe: function(){
    this.y += 5 * Math.sin(core.frame);

    if(this.isRushed){
      this.y -= this.vy;
    }else{
      this.x += this.vx;
    }
  },

  rush: function(){
    if(! this.isRushed){
      this.isRushed = true;
    };
  }
});

var Hantei = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 90, 25);
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);

    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["title.png"];
    this.addChild(this.bg);

    this.score = 0;
  },

  ontouchstart: function(){
    core.gameScene = new GameScene(this.score);
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);

    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["matte-ya2_1.png"];
    this.addChild(this.bg);

    this.score = score + 1;

    this.leftDoor = new LeftDoor(this.score);
    this.addChild(this.leftDoor);

    this.rightDoor = new RightDoor(this.score);
    this.addChild(this.rightDoor);

    this.player = new Player(this.score);
    this.addChild(this.player);

    this.hantei = new Hantei();
    this.addChild(this.hantei);

    this.scoreLabel = new Label(this.score.toString() + "回目");
    this.scoreLabel.width = 200;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(15, 35);
    this.scoreLabel.font = "64px Serif";
    this.scoreLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.scoreLabel);
  },

  ontouchstart: function(){
    if(this.player.isRushed){
      this.player.isRushed = false;
      this.player.vx *= -1;
    } else {
      this.player.rush();
    }
  },

  onenterframe: function(){
    this.hantei.moveTo(this.player.x, this.player.y + 100);
    if(this.player.x + this.player.width > GAME_WIDTH || this.rightDoor.intersect(this.hantei) || this.leftDoor.intersect(this.hantei) || this.player.x < 0){
      core.gameOverScene = new GameOverScene(this.score);
      core.pushScene(core.gameOverScene);
    }else if(this.player.y + this.player.height < 0){
      core.gameScene = new GameScene(this.score);
      core.pushScene(core.gameScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);

    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["matte-ya3.jpg"];
    this.addChild(this.bg);

    this.score = score - 1;

    this.scoreLabel = new Label(this.score.toString() + "回");
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo((GAME_WIDTH-this.scoreLabel.width)/2, 200);
    this.scoreLabel.font = "100px Serif";
    this.scoreLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.scoreLabel);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(GAME_WIDTH, GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("matte-ya2_1.png");
  assets.push("matte-ya2_2.png");
  assets.push("matte-ya2_3.png");
  assets.push("matte-ya2_4.png");
  assets.push("matte-ya3.jpg");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
