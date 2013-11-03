enchant();

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Car = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 183, 242);
  },

  lines: function(){
    return [200, 600, 1000];
  },

  onenterframe: function(){
    if(core.frame % 10 < 5){
      this.frame = 0;
    }else{
      this.frame = 1;
    }
  }
});

var EnemyCar = enchant.Class.create(Car, {
  initialize: function(v){
    Sprite.call(this, 183, 242);
    var random = function(n){ return Math.floor(Math.random() * n) };
    this.y = - this.height;
    this.x = this.lines()[random(3)];
    this.v = v;
    this.image = core.assets["player" + (random(2) + 2).toString() + ".png"];

    this.addEventListener("enterframe", function(){
      this.y += this.v;
    });
  }
});

var Player = enchant.Class.create(Car, {
  initialize: function(){
    Car.call(this);
    this.image = core.assets["player1.png"];
    this.x = this.lines()[1];
    this.y = HQ_GAME_HEIGHT - 200;
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
    this.score = 0;

    this.bg = new Sprite(HQ_GAME_WIDTH, 2 * HQ_GAME_HEIGHT);
    this.addChild(this.bg);
    this.bg.image = core.assets["game.png"];
    this.moveTo(0, - 2 * HQ_GAME_HEIGHT);
    this.bg.addEventListener("enterframe", function(){
      this.y += _this.v;
      if(this.y >= 0){
        this.y = - HQ_GAME_HEIGHT;
      }
    })

    this.playerCar = new Player();
    this.addChild(this.playerCar);

    this.rightButton = new Sprite(153, 155);
    this.addChild(this.rightButton);
    this.rightButton.moveTo(HQ_GAME_WIDTH - 100, HQ_GAME_HEIGHT - 124);
    this.rightButton.image = core.assets["right.png"];
    this.rightButton.opacity = 0.5;
    this.rightButton.addEventListener("touchstart", function(){
      _this.playerCar.moveRight();
    });

    this.leftButton = new Sprite(153, 155);
    this.addChild(this.leftButton);
    this.leftButton.moveTo(0, HQ_GAME_HEIGHT - 124);
    this.leftButton.image = core.assets["left.png"];
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
        if(HQ_GAME_HEIGHT < this.y){
          _this.removeChild(this);
          _this.score++;
        }

        if(this.intersect(_this.playerCar)){
          core.gameOverScene = new GameOverScene(_this.score);
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
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.label = new Label(score.toString());
    this.label.x = (HQ_GAME_WIDTH - this.label.width) / 2 + 150;
    this.label.y = (HQ_GAME_HEIGHT + this.label.height) / 2;
    this.label.font = "80px Serif";
    this.label.color = "black";
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.titleScene = new TitleScene();
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("right.png");
  assets.push("left.png");
  assets.push("player1.png");
  assets.push("player2.png");
  assets.push("player3.png");
  assets.push("game.png");
  assets.push("game_over.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.replaceScene(this.titleScene);
  };

  core.start();
};
