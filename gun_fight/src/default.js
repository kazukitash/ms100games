enchant();

var Hero = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 156, 148);
    this.image = core.assets["chara.png"];
    this.frame = 0;
    this.moveTo(350, 500);

  }
});

var Enemy = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 158, 148);
    this.image = core.assets["chara.png"];
    this.frame = 3;
    this.moveTo(730, 500);
  }
});

var Win = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 400, 200);
    this.image = core.assets["win.png"];
    this.moveTo(440, 220);
  }
});

var Exclamation = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 27, 73);
    this.image = core.assets["exclamation.png"];
    this.moveTo(440, 415);
  }
});

var TumbleWeed = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 135, 135);
    this.image = core.assets["tumble_weed.png"];
    this.moveTo(-135, 500);
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["start.png"];
    this.addChild(this.bg);

    this.score = -1;
    this.round = 0;
  },

  ontouchstart: function(){
    core.howToScene = new HowToScene(this.score, this.round);
    core.pushScene(core.howToScene);
  }
});

var HowToScene = enchant.Class.create(Scene, {
  initialize: function(score, round){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["how.png"];
    this.addChild(this.bg);

    this.score = score;
    this.round = round;
  },

  ontouchstart: function(){
    core.popScene();
    core.gameScene = new GameScene(this.score, this.round);
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(score, round){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.start = false;
    this.win = false;
    this.lose = false;
    this.canWin = false;
    this.animation = Math.floor(Math.random()*4);
    this.delay = Math.floor(Math.sqrt(1/Math.sqrt(this.round^2+3))*core.fps)
    this.limit = Math.floor((8*(1-Math.sqrt(1/Math.sqrt((this.round/4)^2+3)))*Math.random()+2)*core.fps);

    this.tumbleWeed = new TumbleWeed();
    this.addChild(this.tumbleWeed);

    this.hero = new Hero();
    this.addChild(this.hero);

    this.enemy = new Enemy();
    this.addChild(this.enemy);

    this.exclamation = new Exclamation();

    this.score = score + 1;
    this.scoreLabel = new Label(this.score.toString() + "人");
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(980, 20);
    this.scoreLabel.font = "64px Sans-serif";
    this.scoreLabel.color = "rgb(34, 42, 46)";
    this.addChild(this.scoreLabel);

    this.round = round + 1;
    this.roundLabel = new Label("Round" + this.round.toString());
    this.roundLabel.width = HQ_GAME_WIDTH;
    this.roundLabel.y = 220;
    this.roundLabel.textAlign = "center";
    this.roundLabel.font = "256px Sans-serif";
    this.roundLabel.color = "rgb(34, 42, 46)";
    this.addChild(this.roundLabel);
  },

  onenterframe: function(){
    if(this.roundLabel.age == core.fps){
      this.removeChild(this.roundLabel);
      this.start = true;
    }
    if(this.age == this.limit && !this.lose){
      this.addChild(this.exclamation);
      this.canWin = true;
    }
    if(this.age == this.limit + this.delay && !this.lose && !this.win){
      this.enemy.frame = 4;
      this.hero.frame = 2;
      this.lose = true;
    }
    switch(this.animation){
      case 0:
      this.tumbleWeed.moveBy(8,0);
      this.tumbleWeed.rotate(4);
      break;

      case 1:
      if(this.age > 47 && this.age <= 121){
        var y = ((this.age - 47) - (121-47)/2)/4
        this.tumbleWeed.moveBy(4,y);
        this.tumbleWeed.rotate(2);
      } else{
        this.tumbleWeed.moveBy(8,0);
        this.tumbleWeed.rotate(4);
      }
      break;

      case 2:
      if(this.age > 53 && this.age <= 105){
        var y = ((this.age - 53) - (105-53)/2)/3
        this.tumbleWeed.moveBy(6,y);
        this.tumbleWeed.rotate(3);
      } else{
        this.tumbleWeed.moveBy(8,0);
        this.tumbleWeed.rotate(4);
      }
      break;

      case 3:
      this.tumbleWeed.moveBy(14,0);
      this.tumbleWeed.rotate(8);
      break;
    }
  },

  ontouchstart: function(){
    if(this.lose){
      core.gameOverScene = new GameOverScene(this.score, this.round);
      core.replaceScene(core.gameOverScene);
    } else if(this.win){
      core.gameScene = new GameScene(this.score, this.round);
      core.replaceScene(core.gameScene);
    } else if(this.start && this.canWin){
      this.hero.frame = 1;
      this.enemy.frame = 5;
      this.removeChild(this.exclamation);
      delete this.exclamation;
      var win = new Win();
      this.addChild(win);
      this.win = true;
    }else if(this.start){
      this.enemy.frame = 4;
      this.hero.frame = 2;
      this.lose = true;
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.score = score;
    this.scoreLabel = new Label(this.score.toString() + "人");
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(980, 20);
    this.scoreLabel.font = "64px Serif";
    this.scoreLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.scoreLabel);
  },
  ontouchstart: function(){
    core.titleScene = new TitleScene();
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("chara.png");
  assets.push("win.png");
  assets.push("exclamation.png");
  assets.push("tumble_weed.png");
  assets.push("start.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("how.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
