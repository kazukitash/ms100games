enchant();

var coasterOptions = [
{image: "coaster2.png", speed: 10, startPos: 182},
{image: "coaster1.png", speed: 20, startPos: 530},
{image: "coaster3.png", speed: 30, startPos: 878}
];

var Warning = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 108, 94);
    this.image = core.assets["warning.png"];
  }
});

var Coaster = enchant.Class.create(Sprite, {
  initialize: function(options){
    Sprite.call(this, 217, 860);
    this.image = core.assets[options.image];
    this.moveTo(options.startPos, 0)
    this.speed = options.speed;
    this.vy = 0;
  },

  onenterframe: function(){
    this.moveBy(0, this.vy);
  }
});

var Player = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 107, 128);
    this.image = core.assets["chara.png"];
    this.moveTo((HQ_GAME_WIDTH - this.width)/2, 420);

    this.line = 1;
    this.onTheCoaster = true;
    this.speed = 0;
  },

  onenterframe: function(){
    this.y += this.speed;
    if(this.y > HQ_GAME_HEIGHT){
      core.gameOverScene = new GameOverScene();
      core.replaceScene(core.gameOverScene);
    }
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
    this.v = 14;

    this.bg = new Sprite(HQ_GAME_WIDTH, 2 * HQ_GAME_HEIGHT);
    this.addChild(this.bg);
    this.bg.image = core.assets["game.png"];
    this.moveTo(0, - 2 * HQ_GAME_HEIGHT);
    this.bg.addEventListener("enterframe", function(){
      this.y += _this.v;
      if(this.y >= 0){
        this.y = - HQ_GAME_HEIGHT;
      }
    });

    this.coasterList = [];
    for(i=0; i<3; i++){
      var coaster = new Coaster(coasterOptions[i]);
      this.addChild(coaster);
      this.coasterList.push(coaster);
      if(i != 1){
        coaster.y = -860;
      }
    }

    // this.player = new Player();
    // this.addChild(this.player);
  },

  onenterframe: function(){
    if((core.frame) % 90 == 0){

    }
    if(this.player.onTheCoaster){
      var coaster = this.coasterList[this.player.line];
      this.player.speed = coaster.vy;
    } else {
      this.player.speed = 0;
    }
    for(i=0; i<3; i++){
      var coaster = this.coasterList[i];
      if(coaster.age == 120){
        coaster.vy = coaster.speed;
      }
    }
  },

  ontouchstart: function(e){
    console.log(e.x,e.y);
    this.player.onTheCoaster = false;
    switch(this.player.line){
    case 0:
    if(e.x > 460){
      this.player.tl.scaleTo(1.3,1.3,15).and().moveBy(175, 0, 15);
      this.player.tl.scaleTo(1,1,15).and().moveBy(175, 0, 15);
      this.player.line = 1;
      this.player.onTheCoaster = true;
    }
    break;
    case 1:
    if(e.x > 815){
      var _this = this;
      this.player.tl.scaleTo(1.3,1.3,15).and().moveBy(175, 0, 15);
      this.player.tl.scaleTo(1,1,15).and().moveBy(175, 0, 15);
      this.player.line = 2;
      this.player.onTheCoaster = true;
    } else if(e.x < 460){
      this.player.tl.scaleTo(1.3,1.3,15).and().moveBy(-175, 0, 15);
      this.player.tl.scaleTo(1,1,15).and().moveBy(-175, 0, 15);
      this.player.line = 0;
      this.player.onTheCoaster = true;
    }
    break;
    case 2:
    if(e.x < 815){
      this.player.tl.scaleTo(1.3,1.3,15).and().moveBy(-175, 0, 15);
      this.player.tl.scaleTo(1,1,15).and().moveBy(-175, 0, 15);
      this.player.line = 1;
      this.player.onTheCoaster = true;
    }
    break;
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
  assets.push("coaster1.png");
  assets.push("coaster2.png");
  assets.push("coaster3.png");
  assets.push("chara.png");
  assets.push("warning.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};