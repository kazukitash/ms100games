enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var CountDownTimer = enchant.Class.create(Label, {
  initialize: function(sec) {
    Label.call(this);

    this.frame   = sec * core.fps;
    this.startAt = Infinity;
    this.stopAt  = Infinity;
  },

  start: function(){
    this.startAt = core.frame;
  },

  stop: function(){
    this.stopAt = core.frame;
  },

  isStarted: function(){
    return this.startAt < core.frame;
  },

  isStopped: function(){
    return this.stopAt < core.frame;
  },

  remainingFrame: function(){
    return this.frame - core.frame + this.startAt;
  },

  remainingSec: function(){
    return this.remainingFrame() / core.fps;
  },

  onenterframe: function(){
    if(!this.isStopped()){
      this.text = this.remainingSec().toFixed(2);
    }

    if(this.remainingFrame() == 0){
      this.stop();

      var e = new Event("over");
      this.dispatchEvent(e);
    }
  }
});

var Mol = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 151, 169);
    this.image = core.assets["mol.png"];
    this.moveTo(HQ_GAME_WIDTH / 2 - this.width, 500);
  },

  moveCenterTo: function(x){
    if(this.x + this.width / 2 < x){
      this.frame = 0;
    }else{
      this.frame = 1;
    }

    this.x = x - this.width / 2;
  }
});

var Paper = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 95, 100);
    this.image = core.assets["print.png"];
  },

  onenterframe: function(){
    this.y += 4;
  }
});

var PaperScore = enchant.Class.create(Label, {
  initialize: function(score){
    Label.call(this, score.toString());
    this.score = score;
    this.font = "48px Serif";
  },

  onenterframe: function(){
    this.y += 4;
  }
});

var Unit = enchant.Class.create(Group, {
  initialize: function(){
    Group.call(this);
    var x, score;

    x = HQ_GAME_WIDTH / 2 + (2 * Math.random() - 1) * 400;
    score = Math.floor(2 * (2 * Math.random() - 1));
    if(score == 0){
      score = 2;
    }

    this.paper = new Paper();
    this.addChild(this.paper);

    this.score = new PaperScore(score);
    this.addChild(this.score);

    this.moveTo(x, - this.paper.height);
  },

  moveTo: function(x, y){
    this.paper.moveTo(x, y);
    this.score.moveTo(x + 30, y + 30);
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
  },
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    var _this = this;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.timer = new CountDownTimer(30);
    this.timer.start();
    this.timer.moveTo(50, 60);
    this.timer.font = "48px Serif";
    this.timer.color = "white";
    this.timer.addEventListener("over", function(){
      core.gameOverScene = new GameOverScene(_this.score);
      core.replaceScene(core.gameOverScene);
    });

    this.addChild(this.timer);

    this.player = new Mol();
    this.addChild(this.player);
    this.unitCycle = 40;

    this.score = 0;

    this.units = []

    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 600;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.font = "80px Serif";
    this.scoreLabel.color = "white";
    this.scoreLabel.moveTo(325,250);
    this.addChild(this.scoreLabel);
  },

  ontouchstart: function(e){
    this.player.moveCenterTo(e.x);
  },

  ontouchmove: function(e){
    this.player.moveCenterTo(e.x);
  },

  onenterframe: function(){
    if(core.frame % this.unitCycle == 0){
      var unit;
      unit = new Unit();
      this.addChild(unit);
      this.units.push(unit);

      if(30 < this.unitCycle){
        this.unitCycle--;
      }
    }

    var i = this.units.length;
    while(i){
      var unit = this.units[--i];

      if(unit.paper.intersect(this.player)){
        this.score += unit.score.score;
        this.units.splice(i, 1);
        this.removeChild(unit);

        this.scoreLabel.text = this.score.toString();
      }
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);

    if(score < 12){
      this.bg.image = core.assets["game_over1.png"];
    }else{
      this.bg.image = core.assets["game_over2.png"];
    }

    this.addChild(this.bg);
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
  assets.push("game_over1.png");
  assets.push("game_over2.png");
  assets.push("mol.png");
  assets.push("print.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};