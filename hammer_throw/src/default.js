enchant();

var II = {
  Hammer: {
    Width: 242,
    Height: 242
  },
  Player: {
    Width: 242,
    Height: 242
  }
}

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

  bonus: function(bonus){
    this.frame += bonus * core.fps;
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

var Rotor = enchant.Class.create(Group, {
  initialize: function(){
    Group.call(this);

    this.player = new Player();
    this.addChild(this.player);

    this.hammer = new Hammer();
    this.addChild(this.hammer);

    this.moveTo((HQ_GAME_WIDTH - this.player.width)/2, 470)

    this.isUpperLeft = false;
    this.isUpperRight  = false;
    this.isLowerLeft = false;
    this.isLowerRight = false;

    this.CF = 1;
    this.rot = 0;

    this.isTurn = true;

    var _this = this;
    this.addEventListener("UpperLeft", function(){
      _this.isUpperLeft = true;
    });
    this.addEventListener("UpperRight", function(){
      _this.isUpperRight = true;
    });
    this.addEventListener("LowerLeft", function(){
      _this.isLowerLeft = true;
    });
    this.addEventListener("LowerRight", function(){
      _this.isLowerRight = true;
    });
    this.addEventListener("Throw", function(){
      _this.isTurn = false;
      _this.hammer.CF = this.CF;
      if(!this.hammer.hasBeenThrown){
        _this.hammer.rot = this.hammer.rotation;
      }
      _this.hammer.hasBeenThrown = true;
    })
  },

  onenterframe: function(){
    if(this.isUpperLeft  && this.isUpperRight){
      this.CF++;
      this.isUpperRight = false;
      this.isLowerRight = false;
    } else if(this.isLowerLeft && this.isUpperLeft){
      this.CF++;
      this.isUpperLeft = false;
      this.isUpperRight = false;
    } else if(this.isLowerRight && this.isLowerLeft){
      this.CF++;
      this.isLowerLeft = false;
      this.isUpperLeft = false;
    } else if(this.isUpperRight && this.isLowerRight){
      this.CF++;
      this.isLowerRight = false;
      this.isLowerLeft = false;
    }
    if(this.CF % 10 == 0 && !this.hammer.hasBeenThrown){
      this.rot += 2;
    }
    if(this.isTurn){
      this.player.rotation += this.rot;
    }
    this.hammer.rotation += this.rot;
    this.hammer.rotation = this.hammer.rotation % 360
  }
});

var Hammer = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Hammer.Width, II.Hammer.Height);
    this.image = core.assets["hammer.png"];

    this.hasBeenThrown = false;
    this.CF = 0;
    this.rot = 0;
  },

  onenterframe: function(){
    if(this.hasBeenThrown){
      if(0 <= this.rot && this.rot < 90){
        this.moveBy(-this.CF * Math.cos(this.rot)/2, this.CF * Math.sin(this.rot)/2);
      } else if(90 <= this.rot && this.rot < 180){
        this.moveBy(-this.CF * Math.cos(this.rot)/2, -this.CF * Math.sin(this.rot)/2);
      } else if(180 <= this.rot && this.rot < 270){
        this.moveBy(-this.CF * Math.cos(this.rot)/2, -this.CF * Math.sin(this.rot)/2);
      } else if(270 <= this.rot && this.rot < 360){
        this.moveBy(this.CF * Math.cos(this.rot)/2, this.CF * Math.sin(this.rot)/2);
      }
    }
    if(this.y < -500){
      core.gameOverScene = new GameOverScene(this.CF * Math.sin(this.rot));
      core.replaceScene(core.gameOverScene);
    } else if(this.x > HQ_GAME_WIDTH/2 || this.x < -HQ_GAME_WIDTH/2 || this.y > HQ_GAME_HEIGHT - 500){
      core.gameOverScene = new GameOverScene(0);
      core.replaceScene(core.gameOverScene);
    }
  }
});

var Player = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Player.Width, II.Player.Height);
    this.image = core.assets["player.png"];
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
    core.howToScene = new HowToScene();
    core.pushScene(core.howToScene);
  }
});

var HowToScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["how.png"];
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.popScene();
    core.gameScene = new GameScene();
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.rotor = new Rotor();
    this.addChild(this.rotor);

    this.pointer = {x: 0, y: 0};

    var _this = this;
    this.timer = new CountDownTimer(10);
    this.timer.width = 300;
    this.timer.textAlign = "center";
    this.timer.moveTo(0, 30);
    this.timer.font = "64px Sans-serif";
    this.timer.color = "rgb(34, 42, 46)";
    this.timer.addEventListener("over", function(){
      core.gameOverScene = new GameOverScene(0);
      core.replaceScene(core.gameOverScene);
    });
    this.timer.start();
    this.addChild(this.timer);
  },

  ontouchstart: function(e){
    this.pointer.x = e.x;
    this.pointer.y = e.y;
  },

  ontouchmove: function(e){
    if(e.x - this.pointer.x < 0 &&  e.y - this.pointer.y < 0){
      var ev = new Event("UpperLeft");
      this.rotor.dispatchEvent(ev);
    } else if(e.x - this.pointer.x > 0 && e.y - this.pointer.y < 0){
      var ev = new Event("UpperRight");
      this.rotor.dispatchEvent(ev);
    } else if(e.x - this.pointer.x < 0 && e.y - this.pointer.y > 0){
      var ev = new Event("LowerLeft");
      this.rotor.dispatchEvent(ev);
    } else if(e.x - this.pointer.x > 0 && e.y - this.pointer.y > 0){
      var ev = new Event("LowerRight");
      this.rotor.dispatchEvent(ev);
    }
    this.pointer.x = e.x;
    this.pointer.y = e.y;
  },

  ontouchend: function(){
    this.timer.stop();
    var e = new Event("Throw");
    this.rotor.dispatchEvent(e);
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.score = Math.sqrt(score * score);
    if(this.score != 0){
      this.scoreLabel = new Label(this.score.toFixed(1).toString() + "m");
    } else if(this.score == 0){
      this.scoreLabel = new Label("記録なし");
    }
    this.scoreLabel.width = 600;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo((HQ_GAME_WIDTH-this.scoreLabel.width)/2 + 20, 250);
    this.scoreLabel.rotate(-11);
    this.scoreLabel.font = "96px Sans-serif";
    this.scoreLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.scoreLabel);
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
  assets.push("hammer.png");
  assets.push("player.png");
  assets.push("how.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};