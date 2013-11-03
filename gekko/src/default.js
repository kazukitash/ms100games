enchant();

var pointer = function(e){
  this.x = e.x;
  this.y = e.y;
}

var createPlayer = function(_this){
  _this.player = new Character(100, 400, 12, null, null, null, null);
  _this.player.player = true;
  _this.addChild(_this.player);

  _this.pLight = new Light(_this.player, 90, 30, 0, null);
  _this.addChild(_this.pLight);
  _this.pLight.rotation = -15;
}

var relativeAngle = function(self, other){
  var distanceX = other.x - self.cx;
  var distanceY = other.y - self.cy;
  var rad = Math.atan(Math.abs(distanceY)/Math.abs(distanceX));
  if(distanceX > 0 && distanceY > 0){
    return rad/(Math.PI / 180);
  } else if(distanceX <= 0 && distanceY > 0){
    return  180 - rad/(Math.PI / 180);
  } else if(distanceX <= 0 && distanceY <= 0){
    return  180 + rad/(Math.PI / 180);
  } else if(distanceX > 0 && distanceY <= 0){
    return  360 - rad/(Math.PI / 180);
  }
}

var LightSurface = enchant.Class.create(Surface, {
  initialize: function(options){
    var radius = options.radius || 6;
    var style  = options.style  || "#bee1ff";
    var angle  = options.angle  || 360;

    Surface.call(this, radius * 2, radius * 2);
    this.context.beginPath();
    this.context.moveTo(radius, radius);
    this.context.lineTo(radius * 2, radius);
    this.context.arc(radius, radius, radius, 0, angle / 180 * Math.PI, false);
    this.context.fillStyle = style;
    this.context.fill();
    this.context.closePath();
  }
});

var FlyingObject = enchant.Class.create(Sprite, {
  initialize: function(x, y, size, vx, vy, score, bonusTime){
    Sprite.call(this, size, size);
    this.image = new LightSurface({});
    this.moveTo(x+size/2, y+size/2);
    this.player = false;
    this.vx = vx;
    this.vy = vy;
    this.score = score;
    this.bonusTime = bonusTime;
  },

  coordinates: function(){
      this.cx = this.x+this.width/2;
      this.cy = this.y+this.height/2;
  },

  onenterframe: function(){
    if(!this.player){
      if(this.x < 0 || this.x > HQ_GAME_WIDTH){
        this.vx = -this.vx;
      }
      if(this.y < 0 || this.y > HQ_GAME_HEIGHT){
        this.vy = -this.vy;
      }
      this.moveBy(this.vx, this.vy);
    }
  }
});

var Character = enchant.Class.create(FlyingObject, {
});

var Light = enchant.Class.create(Sprite, {
  initialize: function(character, radius, angle, color, rotate){
    Sprite.call(this, radius*2, radius*2);

    this.image = new LightSurface({style: this.lightColor[color], radius: radius, angle: angle})
    this.chara = character;
    this.radius = radius;
    this.angle = angle;
    this.rot = rotate;
    this.chara.coordinates();
    this.moveTo(this.chara.cx-this.radius, this.chara.cy-this.radius);


  },

  coordinates: function(){
      this.cx = this.x+this.width/2;
      this.cy = this.y+this.height/2;
  },

  arcWithin: function(other, distance, angle){
    this.coordinates();
    var rot = relativeAngle(this, other);
    return (this.within(other, distance) && rot > this.rotation && rot < (this.rotation + angle));
  },

  lightColor: [
  "rgba(255, 255, 130, 0.4)",
  "rgba(255, 130, 255, 0.4)",
  "rgba(130, 255, 255, 0.4)",
  "rgba(170, 60, 255, 0.4)",
  "rgba(255, 170, 60, 0.4)",
  "rgba(60, 255, 170, 0.4)",
  ],

  onenterframe: function(){
    if(!this.chara.player){
      this.moveBy(this.chara.vx, this.chara.vy);
      this.rotate(this.rot);
    }
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["start.png"]
    this.addChild(this.bg);
  },

  ontouchstart: function(){
    core.howToScene = new HowToScene(this.score, this.round);
    core.pushScene(core.howToScene);
  }
});

var HowToScene = enchant.Class.create(Scene, {
  initialize: function(score, round){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["how.png"];
    this.addChild(this.bg);

    this.score = score;
    this.round = round;
  },

  ontouchstart: function(){
    core.popScene();
    core.gameScene = new GameScene(this.score, this.round);
    core.replaceScene(core.gameScene);
  }
});

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["game.png"]
    this.addChild(this.bg);

    createPlayer(this);

    this.enemyList = [];
    this.eLightList = [];

    this.isTouch = false;
    this.level = 0;

    this.score = 0;
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(980, 20);
    this.scoreLabel.font = "64px Sans-serif";
    this.scoreLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.scoreLabel);

    this.limit = 30.00;
    this.limitLabel = new Label(this.limit.toString());
    this.limitLabel.width = 300;
    this.limitLabel.textAlign = "center";
    this.limitLabel.moveTo(0, 20);
    this.limitLabel.font = "64px Sans-serif";
    this.limitLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.limitLabel);
  },

  onenterframe: function(){
    if( core.frame % 300 == 0 && core.frame < 9000){
      this.level++;
    }
    if(core.frame % 60-this.level == 0){
      var eMotion = this.enemyMotion[Math.floor(Math.random()*13)];
      var enemy = new Character(Math.floor(Math.random()*HQ_GAME_WIDTH), Math.floor(Math.random()*HQ_GAME_HEIGHT), 12, eMotion.x, eMotion.y, eMotion.score, eMotion.bonusTime);
      this.enemyList.push(enemy);
      this.addChild(enemy);
      var eLight = new Light(enemy, eMotion.lightRadius, eMotion.lightAngle, eMotion.lightColor, eMotion.rotate);
      this.eLightList.push(eLight);
      this.addChild(eLight);
    }

    for (var i = 0 , len = this.enemyList.length; i < len; i++ ) {
        var enemy = this.enemyList[i];
        var eLight = this.eLightList[i];
        if (this.pLight.arcWithin(enemy, this.pLight.radius, this.pLight.angle)){
          this.removeChild(enemy);
          this.removeChild(eLight);
          this.limit += enemy.bonusTime;
          this.limitLabel.text = this.limit.toFixed(2).toString();
          this.score += enemy.score;
          this.scoreLabel.text = this.score.toString();
          this.enemyList.splice(i, 1);
          len--;
          this.eLightList.splice(i, 1);
        }
    }

    for (var i = 0 , len = this.enemyList.length; i < len; i++ ) {
        var enemy = this.enemyList[i];
        var eLight = this.eLightList[i];
        if (eLight.arcWithin(this.player, eLight.radius, eLight.angle) && eLight.age > 10){
          core.gameOverScene = new GameOverScene(this.score);
          core.replaceScene(core.gameOverScene);
        }
    }

    if(this.isTouch){
      this.player.coordinates();
      var distanceX = this.pointer.x - this.player.cx;
      var distanceY = this.pointer.y - this.player.cy;
      var vx = distanceX*0.03;
      var vy = distanceY*0.03;
      var rotPLight = this.pLight.rotation - this.player.rotation;
      this.player.rotation = relativeAngle(this.player, this.pointer);
      this.pLight.rotation = rotPLight + relativeAngle(this.player, this.pointer);
      this.player.moveBy(vx, vy);
      this.pLight.moveBy(vx, vy);
    }

    if(this.limit < 0){
      core.gameOverScene = new GameOverScene(this.score);
      core.replaceScene(core.gameOverScene);
    }
    this.limit -= 1/core.fps;
    this.limitLabel.text = this.limit.toFixed(2).toString();
  },

  ontouchstart: function(e){
    this.isTouch = true;
    this.pointer = new pointer(e);
  },

  ontouchend: function(){
    this.isTouch = false;
  },

  ontouchmove: function(e){
    this.pointer = new pointer(e);
  },

  enemyMotion: [
  {x: 1, y: 1, rotate: 3, lightAngle: 10, lightRadius: 330, lightRotation: 10, lightColor: 0, score: 100, bonusTime: 3},
  {x: 3, y: -3, rotate: -4, lightAngle: 15, lightRadius: 320, lightRotation: 220, lightColor: 1, score: 100, bonusTime: 2},
  {x: -2, y: 1, rotate: 1, lightAngle: 30, lightRadius: 290, lightRotation: 78, lightColor: 2, score: 300, bonusTime: 1},
  {x: 1, y: -2, rotate: -3, lightAngle: 40, lightRadius: 250, lightRotation: 25, lightColor: 3, score: 1100, bonusTime: 0},
  {x: 1, y: 2, rotate: 1, lightAngle: 60, lightRadius: 200, lightRotation: 152, lightColor: 4, score: 100, bonusTime: 0},
  {x: -1, y: 2, rotate: 2, lightAngle: 75, lightRadius: 190, lightRotation: 12, lightColor: 5, score: 200, bonusTime: 2},
  {x: 2, y: 3, rotate: -4, lightAngle: 90, lightRadius: 180, lightRotation: 78, lightColor: 0, score: 400, bonusTime: 0},
  {x: 3, y: 3, rotate: 3, lightAngle: 105, lightRadius: 160, lightRotation: 135, lightColor: 1, score: 600, bonusTime: 4},
  {x: -2, y: 2, rotate: -2, lightAngle: 135, lightRadius: 160, lightRotation: 330, lightColor: 2, score: 900, bonusTime: 1},
  {x: 2, y: 1, rotate: 1, lightAngle: 160, lightRadius: 130, lightRotation: 341, lightColor: 3, score: 600, bonusTime: 3},
  {x: 1, y: 2, rotate: -1, lightAngle: 180, lightRadius: 120, lightRotation: 35, lightColor: 4, score: 700, bonusTime: 4},
  {x: 1, y: -3, rotate: 1, lightAngle: 230, lightRadius: 110, lightRotation: 139, lightColor: 5, score: 800, bonusTime: 1},
  {x: 1, y: 2, rotate: 2, lightAngle: 270, lightRadius: 110, lightRotation: 280, lightColor: 0, score: 1500, bonusTime: 0},
  ]
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["game_over.png"]
    this.addChild(this.bg);

    this.score = score;
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(980, 20);
    this.scoreLabel.font = "64px Sans-serif";
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
  assets.push("start.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("how.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
