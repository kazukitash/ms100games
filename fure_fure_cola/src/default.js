enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Timer = enchant.Class.create(Label, {
  initialize: function(startFrame){
    Label.call(this);
    this.startFrame = startFrame;
    this.remainingTime = 15.0;
    this.font = "80px serif";
    this.text = this.remainingTime.toString();
    this.moveTo(20,20);
  },

  onenterframe: function(){
    this.remainingTime -= 1.0 / core.fps;
    this.text = Math.floor(this.remainingTime).toString();
  }
});

var Cale = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 537, 449);
    this.moveTo((HQ_GAME_WIDTH - this.width) / 2, (HQ_GAME_HEIGHT - this.height) / 2)
    this.image = core.assets["cacocale.png"];
    this.previousPoint = [];
    this.pathLength = [0, 0];
  },

  ontouchstart: function(e){
    this.previousPoint = [e.x, e.y];
  },

  ontouchmove: function(e){
    this.x = e.x - (this.width) / 2;
    this.y = e.y - (this.height) / 2;
    this.pathLength[0] += Math.abs(Math.floor(e.x - this.previousPoint[0]));
    this.pathLength[1] += Math.abs(Math.floor(e.y - this.previousPoint[1]));
    this.previousPoint = [e.x, e.y];
  },

  distance: function(){
    var d2 = Math.pow(this.pathLength[0], 2) + Math.pow(this.pathLength[1], 2);
    var d  = Math.sqrt(d2);
    return d;
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["title.png"]
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
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["game.png"]
    this.addChild(this.bg);

    this.cale = new Cale();
    this.addChild(this.cale);

    this.timer = new Timer();
    this.addChild(this.timer);
  },

  onenterframe: function(){
    if(this.timer.remainingTime < 0){
      core.gameOverScene = new GameOverScene(this.cale.distance());
      core.replaceScene(core.gameOverScene);
    };
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(distance){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)

    this.addChild(this.bg);
    console.log(distance);

    if(distance > 45000){
      this.bg.image = core.assets["game_over3.png"];
    }else if(distance > 30000){
      this.bg.image = core.assets["game_over2.png"];
    }else{
      this.bg.image = core.assets["game_over.png"];
    }
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("cacocale.png");
  assets.push("game_over.png");
  assets.push("game_over2.png");
  assets.push("game_over3.png");
  assets.push("game.png");
  assets.push("title.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
