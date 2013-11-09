enchant();

var charaMove = function(_this, event, gFCFL, gFCFR, sFCFL, sFCFR){
  this.groundFloor = 487;
  this.groundFloorLeftSide = 140;
  this.groundFloorRightSide = 780;
  this.groundFloorIn = 90;
  this.groundFloorStairsLeft = 360;
  this.groundFloorStairsRight = 380;
  this.secondFloor = 295;
  this.secondFloorLeftSide = 20;
  this.secondFloorRightSide = 650;
  this.secondFloorIn = 700;
  this.secondFloorStairsLeft = 480;
  this.secondFloorStairsRight = 500;
  if(_this.floor){
    if(_this.x < this.groundFloorIn){
      var e = new Event(event);
      _this.dispatchEvent(e);
    }else if(_this.x < this.groundFloorLeftSide && !_this.canLeftIn){
      _this.speed  = _this.speed * -1;
      _this.x = this.groundFloorLeftSide + 1;
      var e = new Event("levelup");
      _this.dispatchEvent(e);
      _this.frame -= gFCFL;
    }else if(_this.x > this.groundFloorStairsLeft && _this.x < this.groundFloorStairsRight){
      var rand = Math.floor(Math.random() * 20);
      if(rand < 1){
        _this.y = this.secondFloor;
        _this.floor = false;
      }
    }else if(_this.x > this.groundFloorRightSide){
      _this.speed  = _this.speed * -1;
      _this.frame += gFCFR;
    }
  }else if(!_this.floor){
    if(_this.x < this.secondFloorLeftSide){
      _this.speed  = _this.speed * -1;
      _this.frame -= sFCFL;
    }else if(_this.x > this.secondFloorStairsLeft && _this.x < this.secondFloorStairsRight){
      var rand = Math.floor(Math.random() * 20);
      if(rand < 1){
        _this.y = this.groundFloor;
        _this.floor = true;
      }
    }else if(_this.x > this.secondFloorRightSide && !_this.canRightIn){
      _this.speed = _this.speed * -1;
      _this.x = this.secondFloorRightSide - 1;
      var e = new Event("levelup");
      _this.dispatchEvent(e);
      _this.frame += sFCFR;
    }else if(_this.x > this.secondFloorIn){
      var e = new Event(event);
      _this.dispatchEvent(e);
    }
  }
  _this.x += _this.speed;
}

var Girl = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 50, 80);
    var rand = Math.floor(Math.random() * 12);
    var girl = this.girls[rand];
    this.image = core.assets["chara.png"];
    this.frame = girl.frame;
    this.speed = girl.speed;
    this.level = 0;
    this.canRightIn = false;
    this.canLeftIn = false;
    this.floor = girl.floor;
    if(girl.floor){
      this.moveTo(770, 487);
    }else if(!girl.floor){
      this.moveTo(30, 295);
    }

    this.addEventListener("levelup", function(){
      this.level ++;
    });
  },

  girls: [
  {frame: 3, speed: -2, floor: true},
  {frame: 9, speed: -3, floor: true},
  {frame: 15, speed: -4, floor: true},
  {frame: 21, speed: -5, floor: true},
  {frame: 27, speed: -6, floor: true},
  {frame: 33, speed: -7, floor: true},
  {frame: 0, speed: 4, floor: false},
  {frame: 6, speed: 3, floor: false},
  {frame: 12, speed: 2, floor: false},
  {frame: 18, speed: 6, floor: false},
  {frame: 24, speed: 7, floor: false},
  {frame: 30, speed: 5, floor: false}
  ],

  onenterframe: function(){
    charaMove(this, "in", 2, 3, 3, 4);

    if(this.level == 3){
      var e = new Event("end");
      this.dispatchEvent(e);
    }
  }
});

var Stranger = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 50, 80);
    this.image = core.assets["chara.png"];
    this.frame = 36;
    this.canRightIn = false;
    this.canLeftIn = false;
    this.floor = false;
    this.speed = 4;

    this.moveTo(300, 295);
  },

  onenterframe: function(){
    charaMove(this, "end", 1, 1, 1, 1);

    if(core.frame % 180 == 0){
      if(this.speed < 0){
        this.speed --;
      }else if(this.speed > 0){
        this.speed ++;
      }
      console.log(this.speed);
    }
  }
});

var Door = enchant.Class.create(Sprite, {
  initialize: function(closeDoor, openDoor){
    Sprite.call(this, 31, 123);
    this.image = core.assets["door.png"];
    this.closeDoor = closeDoor;
    this.openDoor = openDoor;
    this.frame = this.closeDoor;
    this.isOpen = false;
  },

  open: function(){
    this.frame = this.openDoor;
    this.isOpen = true;
  },

  close: function(){
    this.frame = this.closeDoor;
    this.isOpen = false;
  },

  switch: function(){
    if(!this.isOpen){
      this.open();
    }else if(this.isOpen){
      this.close();
    }
  },

  ontouchstart: function(){
    this.switch();
  },

  onenterframe: function(){
    if(this.isOpen){
      var e = new Event("open");
      this.dispatchEvent(e);
    }else if(!this.isOpen){
      var e = new Event("close");
      this.dispatchEvent(e);
    }
  }
});

var RightDoor = enchant.Class.create(Door, {
  initialize: function(){
    Door.call(this, 0, 1);
    this.moveTo(685, 267);
  }
});

var LeftDoor = enchant.Class.create(Door, {
  initialize: function(){
    Door.call(this, 2, 3);
    this.moveTo(122, 455);
  }
});

var ScoreBg = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
    Sprite.call(this, 137, 104);
    this.image = core.assets["score_bg.png"];

    this.moveTo(680,30);
  }
});

var TitleScene = enchant.Class.create(Scene, {
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

var GameScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.rightDoor = new RightDoor();
    this.addChild(this.rightDoor);
    this.leftDoor = new LeftDoor();
    this.addChild(this.leftDoor);

    this.stranger = new Stranger();
    this.addChild(this.stranger);

    this.scoreaBg = new ScoreBg();
    this.addChild(this.scoreaBg);

    this.score = 0;
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.moveTo(730, 75);
    this.scoreLabel.font = "32px Serif"
    this.scoreLabel.color = "rgb(90, 100, 50)";
    this.addChild(this.scoreLabel);

    var _this = this;
    this.stranger.addEventListener("end", function(){
      core.gameOverScene = new GameOverScene(_this.score);
      core.replaceScene(core.gameOverScene);
    });
  },

  onenterframe: function(){
    if(core.frame % 60 == 0){
      var girl = new Girl();
      this.addChild(girl);

      var _this = this;
      girl.addEventListener("in", function(){
        _this.removeChild(girl);
        delete girl;
        _this.score ++;
        _this.scoreLabel.text = _this.score.toString();
      });

      girl.addEventListener("end", function(){
        core.gameOverScene = new GameOverScene(_this.score);
        core.replaceScene(core.gameOverScene);
      });

      this.rightDoor.addEventListener("close", function(){
        girl.canRightIn = false;
        _this.stranger.canRightIn = false;
      });

      this.rightDoor.addEventListener("open", function(){
        girl.canRightIn = true;
        _this.stranger.canRightIn = true;
      });

      this.leftDoor.addEventListener("close", function(){
        girl.canLeftIn = false;
        _this.stranger.canLeftIn = false;
      });

      this.leftDoor.addEventListener("open", function(){
        girl.canLeftIn = true;
        _this.stranger.canLeftIn = true;
      });
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(score){
    Scene.call(this);
    this.bg = new Sprite(GAME_WIDTH, GAME_HEIGHT);
    this.bg.image = core.assets["game_over.png"];
    this.addChild(this.bg);

    this.scoreaBg = new ScoreBg();
    this.addChild(this.scoreaBg);

    this.score = new Label(score.toString());
    this.score.font = "32px Serif"
    this.score.color = "rgb(90, 100, 50)";
    this.score.moveTo(730, 75);
    this.addChild(this.score);
  },

  ontouchstart: function(){
    core.titleScene = new TitleScene();
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(GAME_WIDTH, GAME_HEIGHT);
  var assets = [];
  assets.push("door.png");
  assets.push("chara.png");
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("score_bg.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
