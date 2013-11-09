enchant();

var Kugi = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 95, 369);
    this.image = core.assets["kugida2_2.png"];
    this.moveTo(GAME_WIDTH / 2 - 45, 18);
  },

  hit: function(){
    var head = this.height - this.hitDepth()

    if(head > 0){
      this.y     += this.hitDepth();
      this.height = head;
    }
  },

  isHittable: function(){
    return this.height - this.hitDepth() > 0;
  },

  hitDepth: function(){
    return 8;
  }
});

var Timer = enchant.Class.create(Label, {
  initialize: function(){
    Label.call(this);
    this.startAt = core.frame / core.fps;
    this.sec     = 15.0;
    this.font    = "32px Serif"
    this.color   = "rgb(220, 220, 190)"
    this.text    = this.sec.toString();
    this.moveTo(60, 35);
  },

  onenterframe: function(){
    this.sec -= 1 / core.fps;
    this.text = Math.floor(this.sec) + "." + Math.floor(this.sec * 100) % 100
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    var bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    bg.image = core.assets["title.png"];
    this.addChild(bg);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);

    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["kugida2_1.png"];
    this.addChild(this.bg);

    this.wood = new Sprite(842, 250);
    this.wood.image = core.assets["kugida2_4.png"];
    this.wood.moveTo(GAME_WIDTH - this.wood.width, GAME_HEIGHT - this.wood.height + 37)
    this.addChild(this.wood)

    this.timer = new Timer();
    this.addChild(this.timer);

    this.kugi = new Kugi();
    this.addChild(this.kugi);
  },

  ontouchstart: function(){
    this.kugi.hit();

    if(! this.kugi.isHittable()){
      core.gameOverScene.frame = core.frame;
      core.replaceScene(core.gameOverScene);
    }
  },

  onenterframe: function(){
    if(this.timer.sec < 0){
      core.gameOverScene.frame = core.frame;
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["kugida3.png"];
    this.addChild(this.bg);

    this.frame = core.frame;
  }
});

window.onload = function(){
  core = new Core(GAME_WIDTH, GAME_HEIGHT);
  var assets = []
  assets.push("kugida2_1.png");
  assets.push("kugida2_2.png");
  assets.push("kugida2_4.png");
  assets.push("title.png");
  assets.push("kugida3.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene    = new TitleScene();
    this.gameScene     = new GameScene();
    this.gameOverScene = new GameOverScene();
    this.pushScene(this.titleScene);

    this.titleScene.addEventListener("touchstart", function(){
      core.replaceScene(core.gameScene);
    });

    this.gameOverScene.addEventListener("touchstart", function(){
      if(this.frame + 30 < core.frame){
        core.gameScene = new GameScene();
        core.replaceScene(core.titleScene);
      }
    });
  };

  core.start();
};
