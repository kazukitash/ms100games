enchant();

var II = {
  Head: {
    Width: 280,
    Height: 282,
    Y: 365
  },
  HeadSound: {
    Width: 156,
    Height: 169,
    X:20,
    Y:20
  },
  Hand: {
    Width: 256,
    Height: 279,
    Y: 30
  },
  HandSound: {
    Width: 156,
    Height: 169,
    X:20,
    Y:20
  },
  Hit: {
    Left: 130,
    Right: 180
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

    if(this.remainingFrame() < 0){
      this.stop();

      var e = new Event("over");
      this.dispatchEvent(e);
    }
  }
});

var Head = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Head.Width, II.Head.Height);
    this.image = core.assets["head.png"];
    this.moveTo(1280, II.Head.Y);

    this.speed = - 5;
  },

  onenterframe: function(){
    if(core.frame % 130 == 0){
      this.speed--;
    }
    this.moveBy(this.speed, 0);
    if(this.x < 0){
      var e = new Event("frame_out");
      this.dispatchEvent(e);
    }
  }
});

var HeadSound = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.HeadSound.Width, II.HeadSound.Height);
    this.image = core.assets["head_sound.png"];
    this.moveTo(II.HeadSound.X, II.HeadSound.Y);
  }
});

var Hand = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.Hand.Width, II.Hand.Height);
    this.image = core.assets["hand.png"];
    this.moveTo(1280, II.Hand.Y);

    this.speed = - 4;
  },

  onenterframe: function(){
    if(core.frame % 110 == 0){
      this.speed--;
    }
    this.moveBy(this.speed, 0);
    if(this.x < 0){
      var e = new Event("frame_out");
      this.dispatchEvent(e);
    }
  }
});

var HandSound = enchant.Class.create(Sprite, {
  initialize: function(){
    Sprite.call(this, II.HeadSound.Width, II.HeadSound.Height);
    this.image = core.assets["hand_sound.png"];
    this.moveTo(II.HandSound.X, II.HandSound.Y);
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

    this.headCount = 0;
    this.handCount = 0;

    this.headDelay = 60;
    this.handDelay = 80;

    this.headList = [];
    this.handList = [];

    this.score = 0;
    this.scoreLabel = new Label(this.score.toString());
    this.scoreLabel.width = 300;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(980, 20);
    this.scoreLabel.font = "64px Sans-serif";
    this.scoreLabel.color = "rgb(244, 244, 244)";
    this.addChild(this.scoreLabel);

    this.timer = new CountDownTimer(60);
    this.timer.start();
  },

  ontouchstart: function(e){
    this.beat(e);
  },

  onenterframe: function(){
    var _this = this;
    if(this.timer.remainingFrame() == 0){
      core.gameOverScene = new GameOverScene(_this.score);
      core.replaceScene(core.gameOverScene);
    }
    if(this.age == this.headDelay && this.age < 1600){
      this.headDelay += Math.floor(Math.random() * 60 + 60);
      var head = new Head();
      this.addChild(head);
      this.headList.push(head);
      var _this = this;
      head.addEventListener("beat", function(){
        _this.removeChild(this);
      });
      head.addEventListener("hit", function(){
        this.tl.scaleTo(2,2,5).then(function(){
          _this.removeChild(this);
        });
      });
      head.addEventListener("frame_out", function(){
        _this.removeChild(this);
        _this.headCount++;
      });
    }
    if(this.age == this.handDelay && this.age < 1600){
      this.handDelay += Math.floor(Math.random() * 60 + 60);
      var hand = new Hand();
      this.addChild(hand);
      this.handList.push(hand);
      var _this = this;
      hand.addEventListener("beat", function(){
        _this.removeChild(this);
      });
      hand.addEventListener("hit", function(){
        this.tl.scaleTo(2,2,5).then(function(){
          _this.removeChild(this);
        });
      });
      hand.addEventListener("frame_out", function(){
        _this.removeChild(this);
        _this.handCount++;
      });
    }
  },

  beat: function(e){
    if(e.y > this.height/2 && this.headCount < this.headList.length){
      var head = this.headList[this.headCount];
      if(head.x < II.Hit.Right && head.x > II.Hit.Left){
        this.score += 100;
        this.scoreLabel.text = this.score.toString();
        var e = new Event("hit");
        head.dispatchEvent(e);
      } else {
        var e = new Event("beat");
        head.dispatchEvent(e);
      }
      var headSound = new HeadSound();
      headSound.moveTo(head.x + II.HeadSound.X, head.y + II.HeadSound.Y);
      headSound.scale(0, 0);
      this.addChild(headSound);
      headSound.tl.scaleTo(1,1,5).fadeOut(10);
      this.headCount++;
    } else if(e.y < this.height/2 && this.handCount < this.handList.length){
      var hand = this.handList[this.handCount];
      if(hand.x < II.Hit.Right && hand.x > II.Hit.Left){
        this.score += 50;
          this.scoreLabel.text = this.score.toString();
        var e = new Event("hit");
        hand.dispatchEvent(e);
      } else {
        var e = new Event("beat");
        hand.dispatchEvent(e);
      }
      var handSound = new HandSound();
      handSound.moveTo(hand.x + II.HandSound.X, hand.y + II.HandSound.Y);
      handSound.scale(0, 0);
      this.addChild(handSound);
      handSound.tl.scaleTo(1,1,5).fadeOut(10);
      this.handCount++;
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
    this.scoreLabel = new Label(this.score.toString() + "点");
    this.scoreLabel.width = 600;
    this.scoreLabel.textAlign = "center";
    this.scoreLabel.moveTo(HQ_GAME_WIDTH/2 - 300, 200);
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
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("head.png");
  assets.push("head_sound.png");
  assets.push("hand.png");
  assets.push("hand_sound.png");
  assets.push("how.png");
  core.preload(assets);

  core.onload = function(){
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};