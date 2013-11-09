enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var BaseMan = enchant.Class.create(Sprite, {
  initialize: function(width, height){
    Sprite.call(this, width, height);
    this.isDying = false;
    this.isDead = false;
    this.isTouched = false;
    this.isPoint = false;
  },

  onenterframe: function(){
    this.timeCount++;
    this.warming();
    this.vibrate();
    this.dying();

    if(this.timeCount == 15 * 4 * this.durability()){
      this.die();
    }
  },

  warming: function(){
    if(this.timeCount == 15 * this.durability()){
      this.isVibrating = true;
      this.y -= 13;
      this.frame = 1;
    }else if(this.timeCount == 15 * 2 * this.durability()){
      this.isPoint = true;
      this.y -= 13;
      this.frame = 2;
    }
  },

  durability: function(){
    return 6;
  },

  vibrate: function(){
    if(this.isVibrating){
      this.x += 3 * Math.sin(2.0 * core.frame + this.phase());
    }
  },

  die: function(){
    this.isDying = true;
  },

  dying: function(){
    if(this.isDying){
      this.y -= 4;
      this.opacity -= 0.02;

      if(this.opacity < 0){
        this.isDying = false;
        this.isDead = true;
        this.opacity = 0;
      }
    }
  },

  ontouchstart: function(){
    if(this.isPoint){
      core.score++;
      this.scene.scoreLabel.text = core.score.toString();
    }
  },

  phase: function(){
    return 0;
  },

  isWarmed: function(){
    return 15 * 2 * this.durability < this.timeCount && this.timeCount < 15 * 2 * this.durability();
  }
});

var Man1 = enchant.Class.create(BaseMan, {
  initialize: function(){
    BaseMan.call(this, 231, 209);
    this.moveTo(150, 270);
    this.image = core.assets["hito1.png"];
    this.timeCount = 0;
    this.isVibrating = false;
  },

  durability: function(){
    return 5;
  },

  phase: function(){
    return 20;
  }
});

var Man2 = enchant.Class.create(BaseMan, {
  initialize: function(){
    BaseMan.call(this, 230, 209);
    this.moveTo(450, 150);
    this.image = core.assets["hito2.png"];
    this.timeCount = 0;
    this.isVibrating = false;
  },

  durability: function(){
    return 7;
  },

  phase: function(){
    return 0;
  }
});

var Man3 = enchant.Class.create(BaseMan, {
  initialize: function(){
    BaseMan.call(this, 229, 209);
    this.moveTo(750, 200);
    this.image = core.assets["hito3.png"];
    this.timeCount = 0;
    this.isVibrating = false;
  },

  durability: function(){
    return 6;
  },

  phase: function(){
    return 40;
  }
});

var Man4 = enchant.Class.create(BaseMan, {
  initialize: function(){
    BaseMan.call(this, 230, 217);
    this.moveTo(100, 400);
    this.image = core.assets["hito4.png"];
    this.timeCount = 0;
    this.isVibrating = false;
  },

  durability: function(){
    return 10;
  },

  phase: function(){
    return 50;
  }
});

var Man5 = enchant.Class.create(BaseMan, {
  initialize: function(){
    BaseMan.call(this, 231, 209);
    this.moveTo(400, 400);
    this.image = core.assets["hito1.png"];
    this.timeCount = 0;
    this.isVibrating = false;
  },

  durability: function(){
    return 12;
  },

  phase: function(){
    return 80;
  }
});

var Man6 = enchant.Class.create(BaseMan, {
  initialize: function(){
    BaseMan.call(this, 230, 209);
    this.moveTo(900, 420);
    this.image = core.assets["hito2.png"];
    this.timeCount = 0;
    this.isVibrating = false;
  },

  durability: function(){
    return 4;
  },

  phase: function(){
    return 20;
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["title.png"];
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
    var _this = this;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["play.png"];
    this.addChild(this.bg);
    core.score = 0;

    this.scoreLabel = new Label(core.score.toString());
    this.scoreLabel.width = 200;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(10, 50);
    this.scoreLabel.font = "96px Sans-serif";
    this.scoreLabel.color = "rgb(24, 24, 24)";
    this.addChild(this.scoreLabel);

    var isAlive = function(){
      if(this.isDead){
        core.gameOverScene = new GameOverScene();
        core.replaceScene(core.gameOverScene);
      }
    };

    var isTouched = function(){
      if(!this.isTouched){
        this.isTouched = true;
        _this.removeChild(this);
        _this.number++;
      }
    };

    this.number = 0;

    var man = new Man1();
    man.addEventListener("enterframe", isAlive);
    man.addEventListener("touchstart", isTouched);
    this.addChild(man);

    var man = new Man2();
    man.addEventListener("enterframe", isAlive);
    man.addEventListener("touchstart", isTouched);
    this.addChild(man);

    var man = new Man3();
    man.addEventListener("enterframe", isAlive);
    man.addEventListener("touchstart", isTouched);
    this.addChild(man);

    var man = new Man4();
    man.addEventListener("enterframe", isAlive);
    man.addEventListener("touchstart", isTouched);
    this.addChild(man);

    var man = new Man5();
    man.addEventListener("enterframe", isAlive);
    man.addEventListener("touchstart", isTouched);
    this.addChild(man);

    var man = new Man6();
    man.addEventListener("enterframe", isAlive);
    man.addEventListener("touchstart", isTouched);
    this.addChild(man);
  },

  onenterframe: function(){
    if(this.number > 5){
      core.gameOverScene = new GameOverScene();
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["gameover.png"];
    this.addChild(this.bg);

    this.label = new Label(core.score.toString());
    this.label.font = "120px Serif";
    this.label.color = "#fff"
    this.label.moveTo(400, 300);
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("play.png");
  assets.push("gameover.png");
  assets.push("hito1.png");
  assets.push("hito2.png");
  assets.push("hito3.png");
  assets.push("hito4.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
