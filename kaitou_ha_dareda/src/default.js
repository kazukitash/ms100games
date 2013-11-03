enchant();

Array.prototype.shuffle = function() {
  var i = this.length;
  while(i){
    var j = Math.floor(Math.random()*i);
    var t = this[--i];
    this[i] = this[j];
    this[j] = t;
  }
  return this;
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

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Curtain = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.backgroundColor = "rgb(0, 0, 0)";
    this.opacity = 0;
  }
});

var Light = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 318, 673);
    this.image = core.assets["light.png"];
  }
});

var StartLogo = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 924, 373);
    this.image = core.assets["start.png"];
  }
});

var Round = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 885, 426);
    this.image = core.assets["round.png"];
  }
});

var Character = enchant.Class.create(Sprite, {
  initialize: function(options){
    Sprite.call(this, 138, 310);
    this.image = core.assets["chara.png"];
    this.race  = options.frame;
    this.frame = this.race;

    this.isStart = false;
    this.isLose = false;

    this.revealedAt = core.frame;
    this.hideAt = core.frame - 1;
  },

  isRevealed: function(){
    return this.revealedAt > this.hideAt;
  },

  turn: function(){
    if(this.isRevealed()){
      this.hideAt = core.frame;
      this.tl.scaleTo(0, 1, 10, enchant.Easing.QUAD_EASEINOUT).then(function(){this.frame = 2;});
      this.tl.scaleTo(-1, 1, 10, enchant.Easing.QUAD_EASEINOUT);
    }else{
      this.revealedAt = core.frame;
      this.tl.scaleTo(0, 1, 10, enchant.Easing.QUAD_EASEINOUT).then(function(){this.frame = this.race;});
      this.tl.scaleTo(1, 1, 10, enchant.Easing.QUAD_EASEINOUT);
    }
  },

  move: function(position, round){
    var index = Math.floor(Math.random() * this.TimeTable.length);
    var timeTable = this.TimeTable[index].shuffle();
    var point = [];
    for(var i = 0; i < 2; i++){
      point.push(Math.floor(Math.random() * 880 + 200));
    }
    this.tl.moveTo(point[0], 270, timeTable[0]/(round * 0.2 + 1));
    this.tl.moveTo(point[1], 270, timeTable[1]/(round * 0.2 + 1));
    this.tl.moveTo(position, 270, timeTable[2]/(round * 0.2 + 1));
  },

  TimeTable: [
  [60, 50, 40],
  [50, 30, 70],
  [40, 20, 90],
  [20, 80, 50],
  [50, 50, 50]
  ]
});

var Thief = enchant.Class.create(Character, {
  initialize: function(options){
    options.frame = options.frame || 3;
    Character.call(this, options);
  },

  ontouchstart: function(){
    this.revealed();
  },

  revealed: function(){
    if(this.isStart){
      this.turn();
      var e = new Event("succeeded");
      this.scene.dispatchEvent(e);
      this.tl.moveBy(2, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-5, 0, 3).moveBy(5, 0, 3)
      .moveBy(-2, 0, 3)
      .scaleTo(0, 1, 5, enchant.Easing.QUAD_EASEINOUT);
    }
  },

  win: function(){
    this.tl.moveBy(0, 2, 3)
    .moveBy(0, -5, 3).moveBy(0, 5, 3)
    .moveBy(0, -5, 3).moveBy(0, 5, 3)
    .moveBy(0, -5, 3).moveBy(0, 5, 3)
    .moveBy(0, -2, 3)
  },

  onenterframe: function(){
    if(this.isLose){
      this.win();
    }
  }
});

var VillagePeople = enchant.Class.create(Character, {
  initialize: function(options){
    options.frame = options.frame || Math.floor(Math.random() * 2);
    Character.call(this, options);
  },

  ontouchstart: function(){
    this.revealed();
  },

  revealed: function(){
    if(this.isStart){
      this.turn();
      var e = new Event("failed");
      this.scene.dispatchEvent(e);
    }
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["title.png"];
    this.addChild(this.bg);

    this.score = 1;
  },

  ontouchstart:  function(){
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
  initialize: function(score){
    Scene.call(this);
    var _this = this;
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.curtain = new Curtain();
    this.addChild(this.curtain);

    this.charaPosition = [150, 434, 711, 995];
    this.characters = [];

    this.lights = [];
    for(var i = 0; i < 4; i++){
      var light = new Light();
      this.lights.push(light);
      light.moveTo(this.charaPosition[i] - 88, 0);
      this.addChild(light);
    }

    thief = new Thief({});
    this.characters.push(thief);
    for(var i = 0; i < 3; i++){
      var villagePeople = new VillagePeople({});
      this.characters.push(villagePeople);
    }

    this.characters.shuffle();

    this.characters.forEach(function(character, index, characters){
      character.moveTo(_this.charaPosition[index], 270);
      _this.addChild(character);
    });

    this.round = new Round();
    this.round.moveTo((HQ_GAME_WIDTH-this.round.width)/2, (HQ_GAME_HEIGHT-this.round.height)/2);
    this.addChild(this.round);

    this.startLogo = new StartLogo();
    this.startLogo.moveTo((HQ_GAME_WIDTH-this.startLogo.width)/2, (HQ_GAME_HEIGHT-this.startLogo.height)/2);
    this.startLogo.opacity = 0;

    this.score = score;
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 600;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(140, 180);
    this.scoreLabel.font = "256px Sans-serif";
    this.scoreLabel.color = "rgb(255, 255, 255)";
    this.addChild(this.scoreLabel);

    this.isWin = false;
    this.isLose = false;

    this.addEventListener("succeeded", function(){
      this.score++;
      _this.isWin = true;
    });
    this.addEventListener("failed", function(){
      _this.isLose = true;
      this.characters.forEach(function(character, index, characters){
        character.isLose = true;
      });
    });

    this.timer = new CountDownTimer(5);
    this.timer.width = 300;
    this.timer.textAlign = "center";
    this.timer.moveTo((HQ_GAME_WIDTH-this.timer.width)/2, 100);
    this.timer.font = "128px Sans-serif";
    this.timer.color = "rgb(244, 244, 244)";
    this.timer.addEventListener("over", function(){
      core.gameOverScene = new GameOverScene(_this.score);
      core.replaceScene(core.gameOverScene);
    });

    this.start();
  },

  start: function(){
    this.tl.delay(30)
    .then(function(){
      this.round.tl.scaleTo(0, 0, 10);
      this.scoreLabel.tl.moveTo((HQ_GAME_WIDTH-this.scoreLabel.width)/2, (HQ_GAME_HEIGHT-this.scoreLabel.height)/2, 10).and().scaleTo(0, 0, 10);
    }).delay(10)
    .then(function(){ this.removeChild(this.round); this.removeChild(this.scoreLabel); })
    .then(function(){ this.offLight(0); }).delay(30).then(function(){ this.curtain.tl.fadeTo(0.2, 5); }).delay(5)
    .then(function(){ this.offLight(1); }).delay(30).then(function(){ this.curtain.tl.fadeTo(0.4, 5); }).delay(5)
    .then(function(){ this.offLight(2); }).delay(30).then(function(){ this.curtain.tl.fadeTo(0.6, 5); }).delay(5)
    .then(function(){ this.offLight(3); }).delay(30).then(function(){ this.curtain.tl.fadeTo(0.8, 5); }).delay(5)
    .then(function(){
      this.charaPosition.shuffle();
      var _this = this;
      this.characters.forEach(function(character, index, characters){
        var position = _this.charaPosition[index];
        _this.lights[index].x = position - 88;
        character.move(position, _this.score);
      });
    }).delay(150/(this.score * 0.2 + 1) + 10)
    .then(function(){
      this.addChild(this.startLogo);
      this.startLogo.tl.fadeIn(5).delay(25).scaleTo(0, 0, 10);
    }).delay(40)
    .then(function(){
      this.removeChild(this.startLogo);
      this.characters.forEach(function(character, index, characters){
        character.isStart = true;
      });
    })
    .then(function(){
      this.timer.start();
      this.addChild(this.timer);
    });
  },

  win: function(){
    this.timer.stop();
    this.endCurtain = new Curtain();
    this.addChild(this.endCurtain);
    this.tl.then(function(){
      this.onLight();
    }).delay(60)
    .then(function(){
      this.endCurtain.tl.fadeTo(1, 15);
    }).delay(15)
    .then(function(){
      core.gameScene = new GameScene(this.score);
      core.replaceScene(core.gameScene);
    });
  },

  lose: function(){
    this.onLight();
    this.timer.stop();
    this.endCurtain = new Curtain();
    this.addChild(this.endCurtain);
    this.tl.delay(60)
    .then(function(){
      this.endCurtain.tl.fadeTo(1, 15);
    }).delay(15)
    .then(function(){
      core.gameOverScene = new GameOverScene(this.score);
      core.replaceScene(core.gameOverScene);
    });
  },

  offLight: function(index){
    var light = this.lights[index];
    var character = this.characters[index];
    var _this = this;
    light.tl.delay(20).hide().delay(2).show().delay(3)
    .then(function(){ character.turn(); }).delay(5).fadeOut(5).delay(5)
    .then(function(){ _this.removeChild(light); });
  },

  onLight: function(index){
    this.onlights = [];
    var _this = this;
    for(var i = 0; i < 4; i++){
      if(this.characters[i].isRevealed()){
        this.addChild(this.lights[i]);
        this.onlights.push(this.lights[i]);
      }
    }
    for(var i = 0; i < this.onlights.length; i++){
      this.onlights[i].tl.show().delay(2).hide().delay(3).fadeIn(5)
    }
    this.curtain.tl.delay(5).fadeTo(0.8 - 0.2 * (this.onLight.length + 1), 5);
  },

  onenterframe: function(){
    if(this.isWin){
      this.win();
    }
    if(this.isLose){
      this.lose();
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.score = score - 1;
    this.scoreLabel = new Label(this.score.toString() + "勝");
    this.scoreLabel.width = 600;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo((HQ_GAME_WIDTH-this.scoreLabel.width)/2, 150);
    this.scoreLabel.font = "256px Sans-serif";
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
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("light.png");
  assets.push("chara.png");
  assets.push("start.png");
  assets.push("round.png");
  assets.push("how.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};