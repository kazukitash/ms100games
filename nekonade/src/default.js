enchant();

var How = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 1280, 720);
    this.image = core.assets["how.png"];
    this.moveTo(0, 0);
  },

  ontouchstart: function(){
    ev = new Event("start");
    this.dispatchEvent(ev);
  }
});

var BarShadow = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 51, 569);
    this.image = core.assets["bar_shadow.png"];
    this.moveTo(1143, 116);
  }
});

var ReStart = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 275, 77);
    this.image = core.assets["return.png"];
    this.moveTo(43 , 598);
  },

  ontouchstart: function(){
    core.titleScene = new TitleScene();
    core.pushScene(core.titleScene);
  }
});

var Bar = enchant.Class.create(Sprite, {
  initialize: function(option){
    Sprite.call(this, 40, 563)
    this.surface = new Surface(40, 563);
    this.surface.context.beginPath();
    this.surface.context.fillStyle = "#f0a25b";
    this.surface.context.fillRect(0, 563-option, 40, option);
    this.surface.context.fill();
    this.image = this.surface;
    this.moveTo(1149, 119);
  },

  up: function(option){
    this.surface.context.beginPath();
    this.surface.context.fillStyle = "#f0a25b";
    this.surface.context.fillRect(0, 563-option, 40, option);
    this.surface.context.fill();
    this.image = this.surface;
  },

  max: function(){
    this.tl.scaleTo(1.1, 1.1, 5).scaleTo(1, 1, 5);
  }
});

var Touch = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, 68, 68);
    this.image = core.assets["touch.png"];
    this.scale(0.9,0.9);
    this.moveTo(1135, 43);
  }
});

var Level2 = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.image = core.assets["level2.png"];
  }
});

var Level3 = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.image = core.assets["level3.png"];
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

    this.meter = 1;

    this.bar = new Bar(this.meter);
    this.addChild(this.bar);

    var barShadow = new BarShadow();
    this.addChild(barShadow);

    var how = new How();
    var _this = this;
    how.addEventListener("start", function(){
      _this.removeChild(this);
      core.resume();
    });
    this.addChild(how);
    core.pause();
  },

  ontouchstart: function(){
    if(this.meter == 200){
      this.bg.image = core.assets["level2.png"];
      this.bar.up(++this.meter);
      var touch = new Touch();
      this.addChild(touch);
      var _this = this;
      touch.tl.scaleTo(2,2,60).and().fadeOut(60).then(function(){
        _this.removeChild(touch);
      });
    } else if(this.meter == 400){
      this.bg.image = core.assets["level3.png"];
      this.bar.up(++this.meter);
      var touch = new Touch();
      this.addChild(touch);
      var _this = this;
      touch.tl.scaleTo(2,2,60).and().fadeOut(60).then(function(){
        _this.removeChild(touch);
      });
    } else if(this.meter < 563){
      this.bar.up(++this.meter);
      var touch = new Touch();
      this.addChild(touch);
      var _this = this;
      touch.tl.scaleTo(2,2,60).and().fadeOut(60).then(function(){
        _this.removeChild(touch);
      });
    } else if(this.meter == 563){
      this.meter++;
      this.bar.max();
      var reStart = new ReStart();
      this.addChild(reStart);
    } else if(this.meter > 563){
      this.bar.max();
      var touch = new Touch();
      this.addChild(touch);
      var _this = this;
      touch.tl.scaleTo(2,2,60).and().fadeOut(60).then(function(){
        _this.removeChild(touch);
      });
    }
  },

  ontouchmove: function(){
    if(this.meter == 200){
      this.bg.image = core.assets["level2.png"];
      this.bar.up(++this.meter);
      var touch = new Touch();
      this.addChild(touch);
      var _this = this;
      touch.tl.scaleTo(2,2,60).and().fadeOut(60).then(function(){
        _this.removeChild(touch);
      });
    } else if(this.meter == 400){
      this.bg.image = core.assets["level3.png"];
      this.bar.up(++this.meter);
      var touch = new Touch();
      this.addChild(touch);
      var _this = this;
      touch.tl.scaleTo(2,2,60).and().fadeOut(60).then(function(){
        _this.removeChild(touch);
      });
    } else if(this.meter < 563){
      this.bar.up(++this.meter);
    } else if(this.meter == 563){
      this.meter++;
      this.bar.max();
      var reStart = new ReStart();
      this.addChild(reStart);
    }
  }
});

window.onload = function(){
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("game.png");
  assets.push("bar_shadow.png");
  assets.push("bar.png");
  assets.push("touch.png");
  assets.push("level2.png");
  assets.push("level3.png");
  assets.push("return.png");
  assets.push("how.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};