enchant();

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

var PlayerCar = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 303, 395);
    this.image = core.assets["player.png"];
    this.x = this.lines()[0];
    this.y = HQ_GAME_HEIGHT - 500;
    this.line  = 0;
    this.count = 0;
    this.isRight = false;
  },

  lines: function(){
    return [150, 550, 950];
  },

  setLine: function(line){
    if(line >= 0 && line <= 2){
      this.line = line;
      this.x = this.lines()[line];
      if(line == 0 && this.isRight){
        this.count += 2;
        this.isRight = false;
      } else if(line == 2 && !this.isRight){
        this.count += 2;
        this.isRight = true;
      }
    };
  },

  moveRight: function(){
    this.setLine(this.line + 1);
  },

  moveLeft: function(){
    this.setLine(this.line - 1);
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
    this.addChild(this.bg);
    this.bg.image = core.assets["game.png"];

    this.playerCar = new PlayerCar();
    this.addChild(this.playerCar);

    this.rightButton = new Sprite(161, 101);
    this.addChild(this.rightButton);
    this.rightButton.moveTo(HQ_GAME_WIDTH - 161, HQ_GAME_HEIGHT - 101);
    this.rightButton.image = core.assets["right-btn.png"];
    this.rightButton.opacity = 0.5;
    this.rightButton.addEventListener("touchstart", function(){
      _this.playerCar.moveRight();
    });

    this.leftButton = new Sprite(161, 101);
    this.addChild(this.leftButton);
    this.leftButton.moveTo(0, HQ_GAME_HEIGHT - 101);
    this.leftButton.image = core.assets["left-btn.png"];
    this.leftButton.opacity = 0.5;
    this.leftButton.addEventListener("touchstart", function(){
      _this.playerCar.moveLeft();
    });

    this.timer = new CountDownTimer(30);
    this.timer.start();
    this.timer.font = "40px Serif";
    this.timer.color = "red";
    this.timer.moveTo(100, 100);
    this.addChild(this.timer);
    this.timer.addEventListener("over", function() {
      if(_this.playerCar.line == 1){
        _this.playerCar.count++;
      }
      core.GameOverScene = new GameOverScene(_this.playerCar.count);
      return core.replaceScene(core.GameOverScene);
    });
  },

  onenterframe: function(){
    if(core.input.left){
      this.playerCar.moveLeft();
    }else if(core.input.right){
      this.playerCar.moveRight();
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
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 600;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo((HQ_GAME_WIDTH - this.scoreLabel.width) / 2, 400);
    this.scoreLabel.font = "128px Sans-serif";
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
  assets.push("player.png");
  assets.push("game_over.png");
  assets.push("game.png");
  assets.push("title.png");
  assets.push("left-btn.png");
  assets.push("right-btn.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.replaceScene(this.titleScene);
  };

  core.start();
};
