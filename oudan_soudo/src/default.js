enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Car = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 133, 213);
  },

  lines: function(){
    return [200, 600, 1000];
  },
});

var EnemyCar = enchant.Class.create(Car, {
  initialize: function(v){
    Sprite.call(this, 91, 187);
    var random = function(n){ return Math.floor(Math.random() * n) };
    this.y = - this.height;
    this.x = this.lines()[random(3)];
    this.v = v;
    this.image = core.assets["car" + (random(3) + 2).toString() + ".png"];
  },

  onenterframe: function(){
    this.y += this.v;
  }
});

var PlayerCar = enchant.Class.create(Car, {
  initialize: function(){
    Car.call(this);
    this.image = core.assets["player.png"];
    this.x = this.lines()[1];
    this.y = HQ_GAME_HEIGHT - 250;
    this.line  = 1;
  },

  setLine: function(line){
    if(line >= 0 && line <= 2){
      this.line = line;
      this.x = this.lines()[line];
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
    this.v = 7;

    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.addChild(this.bg);
    this.bg.image = core.assets["game.png"];

    this.playerCar = new PlayerCar();
    this.addChild(this.playerCar);

    this.rightButton = new Sprite(200, 124);
    this.addChild(this.rightButton);
    this.rightButton.moveTo(HQ_GAME_WIDTH - 200, HQ_GAME_HEIGHT - 124);
    this.rightButton.image = core.assets["right-btn.png"];
    this.rightButton.opacity = 0.5;
    this.rightButton.addEventListener("touchstart", function(){
      _this.playerCar.moveRight();
    });

    this.leftButton = new Sprite(200, 124);
    this.addChild(this.leftButton);
    this.leftButton.moveTo(0, HQ_GAME_HEIGHT - 124);
    this.leftButton.image = core.assets["left-btn.png"];
    this.leftButton.opacity = 0.5;
    this.leftButton.addEventListener("touchstart", function(){
      _this.playerCar.moveLeft();
    });
  },

  onenterframe: function(){
    if(core.frame % (2 * 200 / 5) == 0){
      var _this = this;
      var enemyCar = new EnemyCar(this.v);
      enemyCar.addEventListener("enterframe", function(){
        if(this.intersect(_this.playerCar)){
          core.gameOverScene = new GameOverScene();
          core.replaceScene(core.gameOverScene);
        }
      });

      this.addChild(enemyCar);
      this.v ++;
    }

    if(core.input.left){
      this.playerCar.moveLeft();
    }else if(core.input.right){
      this.playerCar.moveRight();
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

  ontouchstart: function(){
    core.titleScene = new TitleScene();
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("player.png");
  assets.push("car2.png");
  assets.push("car3.png");
  assets.push("car4.png");
  assets.push("car5.png");
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
