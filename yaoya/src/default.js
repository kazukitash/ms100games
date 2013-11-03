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

var Vegitable = enchant.Class.create(Sprite, {
  initialize: function(w, h){
    Sprite.call(this, w, h);
  },

  onenterframe: function(){
    this.y += 5
  }
});

var Carrot = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 87, 128);
    this.image = core.assets["ninjin.png"];
    this.score = 50;
  }
});

var Tomato = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 97, 95);
    this.image = core.assets["tomato.png"];
    this.score = 200;
  }
});

var Eggplantan = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 79, 144);
    this.image = core.assets["nasu.png"];
    this.score = 150;
  }
});

var Piment = enchant.Class.create(Vegitable, {
  initialize: function(){
    Vegitable.call(this, 79, 105);
    this.image = core.assets["pi-man.png"];
    this.score = 100;
  }
});

var Player = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 204, 352);
    this.image = core.assets["player.png"];
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

    this.player = new Player();
    this.addChild(this.player);
    this.unitCycle = 40;

    this.score = 0;

    this.units = []

    this.scoreLabel = new Label("3000円に近づけろ！");
    this.scoreLabel.width = 600;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.font = "64px Serif";
    this.scoreLabel.color = "rgb(54, 52, 56)";
    this.scoreLabel.moveTo(600,20);
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
      var vegitable, random;
      // vegitable = new Carrot();
      switch( Math.floor(Math.random() * 4)){
        case 0:
        vegitable = new Carrot();
        break;

        case 1:
        vegitable = new Piment();
        break;

        case 2:
        vegitable = new Tomato();
        break;

        case 3:
        vegitable = new Eggplantan();
        break;
      }
      random    = Math.floor(Math.random() * 900) + 100
      vegitable.x = random
      this.addChild(vegitable);
      this.units.push(vegitable);

      if(30 < this.unitCycle){
        this.unitCycle--;
      }
    }

    var i = this.units.length;
    while(i){
      var unit = this.units[--i];

      if(unit.intersect(this.player)){
        this.score += unit.score;
        this.units.splice(i, 1);
        this.removeChild(unit);
      }
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.label = new Label(score.toString());
    this.label.font = "80px Serif";
    this.label.color = "black";
    this.label.x = (HQ_GAME_WIDTH - this.label.width) / 2 + 100;
    this.label.y = (HQ_GAME_HEIGHT - this.label.height) / 2 + 100;
    this.addChild(this.label);
    console.log(score);
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
  assets.push("nasu.png");
  assets.push("ninjin.png");
  assets.push("pi-man.png");
  assets.push("player.png");
  assets.push("tomato.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};