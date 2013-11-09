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

var CountUpTimer = enchant.Class.create(Label, {
  initialize: function(){
    Label.call(this);
    this.fps = core.fps;
    this.isStarted = false;
    this.innerFrame = 0;
    this.text = "0";
  },

  start: function(frame){
    if(!this.isStarted){
      this.isStarted = true;
    }
  },

  second: function(){
    return this.innerFrame / this.fps;
  },

  onenterframe: function(){
    if(this.isStarted){
      this.innerFrame++;
      this.text = this.second().toFixed(2);
    }
  }
});

var MySprite = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this);
  }
});

var Panel = enchant.Class.create(Label, {
  initialize: function(number){
    Label.call(this);
    this.number = number;
    this.text   = (this.number + 1).toString();
    this.font   = "100px Serif";
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function(){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
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
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["play.png"];
    this.addChild(this.bg);
    this.panels = [];
    this.lastPanelNumber = -1;

    this.timer = new CountUpTimer(0);
    this.timer.moveTo(60, 100);
    this.timer.start(core.frame);
    this.timer.font = "60px Serif";
    this.addChild(this.timer);

    var PANEL_TOP    = 60;
    var PANEL_BOTTOM = 540;
    var PANEL_LEFT   = 280;
    var PANEL_RIGHT  = 880;

    var PANEL_WIDTH  = (PANEL_RIGHT - PANEL_LEFT) / 5;
    var PANEL_HEIGHT  = (PANEL_BOTTOM - PANEL_TOP) / 4;

    var getLineFromNumber = function(number){
      return number % 5;
    };

    var getColFromNumber = function(number){
      return Math.floor(number / 5);
    };

    var _this = this;

    var panelontouchstart = function(){
      if(_this.lastPanelNumber + 1 == this.number){
        _this.lastPanelNumber ++;
        _this.removeChild(this);
      }
    };

    var randomArray = [];

    for(i = 0; i < 30; i++){
      randomArray.push(i);
    }

    randomArray = randomArray.shuffle();

    for(i = 0; i < 30; i++){
      var lin   = getLineFromNumber(i);
      var col   = getColFromNumber(i);
      var panel = new Panel(randomArray[i]);

      panel.moveTo(PANEL_LEFT + col * PANEL_WIDTH, PANEL_TOP + lin * PANEL_HEIGHT);
      panel.addEventListener("touchstart", panelontouchstart);

      this.panels.push(panel);
      this.addChild(panel);
    }
  },

  onenterframe: function(){
    if(this.lastPanelNumber == 29){
      core.gameOverScene = new GameOverScene(this.timer.second());
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function(second){
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT)
    this.bg.image = core.assets["gameover.png"];
    this.addChild(this.bg);

    this.label = new Label();
    this.label.font = "120px Serif";
    this.label.text = second.toFixed(2);
    this.label.moveTo((HQ_GAME_WIDTH - this.label.width) / 2, (HQ_GAME_HEIGHT - this.label.height) / 2);
    this.addChild(this.label);
  },

  ontouchstart: function(){
    core.replaceScene(core.titleScene);
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("play.png");
  assets.push("gameover.png");
  assets.push("start.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};
