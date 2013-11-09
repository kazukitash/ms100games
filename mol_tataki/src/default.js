enchant();

var Mol = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 130, 0);
    this.image       = core.assets["moltataki2_2.png"];
    this.hitImage    = core.assets["moltataki2_3.png"];
    this.isHit       = false;
    this.isFadingIn  = true;
    this.isFadingOut = false;
    this.startAt     = core.frame;

    var rand = Math.floor(Math.random() * 7);
    var pos  = this.positions[rand];
    this.moveTo(pos.x, pos.y);
  },

  positions: [
  { x: 210, y: 129 },
  { x: 210, y: 390 },
  { x: 490, y: 129 },
  { x: 490, y: 390 },
  { x: 45, y: 250 },
  { x: 350, y: 250 },
  { x: 665, y: 250 },
  ],

  hit: function(){
    this.image       = this.hitImage;
    this.isHit       = true;
    this.isFadingOut = true;
    var e = new Event("hit");
    this.dispatchEvent(e);
  },

  fadeEnd: function(){
    this.opacity = 0;
    var e = new Event("stop");
    this.dispatchEvent(e);
  },

  ontouchstart: function(){
    if(!this.isHit){
      this.hit();
    }
  },

  onenterframe: function(){
    if(this.isFadingIn && this.height < 180){
      this.height += 36;
    }else if(this.isFadingIn){
      this.isFadingIn = false;
      // this.fadeEnd();
    }

    if(this.isFadingOut && this.opacity > 0.1){
      this.opacity -= 0.1;
    }else if(this.isFadingOut){
    }

    if(core.frame - this.startAt > 180){
      this.fadeEnd();
    }

    if(this.scene.score > 25){
      if(core.frame - this.startAt > 20){
        this.fadeEnd();
      }
    } else if(this.scene.score > 20){
      if(core.frame - this.startAt > 40){
        this.fadeEnd();
      }
    } else if(this.scene.score > 15){
      if(core.frame - this.startAt > 60){
        this.fadeEnd();
      }
    } else if(this.scene.score > 10){
      if(core.frame - this.startAt > 80){
        this.fadeEnd();
      }
    } else {
      if(core.frame - this.startAt > 100){
        this.fadeEnd();
      }
    }
  }
});

var Timer = enchant.Class.create(Label, {
  initialize: function(){
    Label.call(this);
    this.startAt = core.frame / core.fps;
    this.sec     = 30.0;
    this.font    = "32px Serif"
    this.color   = "rgb(255, 255, 255)"
    this.text    = this.sec.toString();
    this.moveTo(90, 120);
  },

  onenterframe: function(){
    this.sec -= 1 / core.fps;
    this.text = Math.floor(this.sec) + "." + Math.floor(this.sec * 100) % 100
  }
});

var TitleScene = enchant.Class.create(enchant.Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["title.png"];
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(enchant.Scene, {
  initialize: function(){
    enchant.Scene.call(this);

    this.score = 0;

    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["moltataki2_1.png"];
    this.addChild(this.bg);

    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.moveTo(720, 120);
    this.scoreLabel.font = "32px Serif"
    this.scoreLabel.color = "rgb(230, 230, 80)";
    this.addChild(this.scoreLabel);

    this.timer = new Timer();
    this.addChild(this.timer);
  },

  molon: function(){
    var mol = new Mol();

    var _this = this;
    mol.addEventListener("stop", function(){
      _this.removeChild(mol);
      delete mol;
    });

    mol.addEventListener("hit", function(){
      _this.score ++;
      _this.scoreLabel.text = _this.score.toString();
    });

    this.addChild(mol);
  },

  onenterframe: function(){
    if(this.score > 25){
      if(core.frame % 10 == 0){
        this.molon();
      }
    } else if(this.score > 20){
      if(core.frame % 15 == 0){
        this.molon();
      }
    } else if(this.score > 15){
      if(core.frame % 20 == 0){
        this.molon();
      }
    } else if(this.score > 10){
      if(core.frame % 25 == 0){
        this.molon();
      }
    } else {
      if(core.frame % 30 == 0){
        this.molon();
      }
    }

    if(this.timer.sec < 0){
      core.gameOverScene = new GameOverScene(this.score);
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(enchant.Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["moltataki3.png"];
    this.addChild(this.bg);

    this.score = new Label(score.toString());
    this.score.font = "48px Serif"
    this.score.color = "rgb(230, 230, 80)";
    this.score.moveTo(290, 150);
    this.addChild(this.score);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(GAME_WIDTH, GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("moltataki2_1.png");
  assets.push("moltataki2_2.png");
  assets.push("moltataki2_3.png");
  assets.push("moltataki3.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene    = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
