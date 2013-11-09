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

var MySprite = enchant.Class.create(Sprite, {
  initialize: function () {
    Sprite.call(this);
  }
});

var Card = enchant.Class.create(Sprite, {
  initialize: function (options) {
    Sprite.call(this, 144, 144);
    this.image = core.assets["card1.png"];
    this.frame = options.frame;
    this.scaleX = - 1;

    this.faceUpAt = core.frame;
    this.faceDownAt = core.frame + 1;

    this.isTurning = false;
  },

  isFacingUp: function(){
    return this.faceUpAt > this.faceDownAt;
  },

  turn: function(){
    this.isTurning = true;
  },

  turning: function(){
    if(this.isTurning){
      if(this.isFacingUp()){
        if(this.scaleX - 0.1 < - 1.0){
          this.faceDownAt = core.frame;
          this.isTurning = false;
        }else if(this.scaleX - 0.1 < 0){
          this.image = core.assets["card1.png"];
          this.scaleX -= 0.1;
        }else{
          this.scaleX -= 0.1;
        }
      }else{
        if(this.scaleX + 0.1 > 1.0){
          this.faceUpAt = core.frame;
          this.isTurning = false;
        }else if(this.scaleX + 0.1 > 0){
          this.image = core.assets["card2.png"];
          this.scaleX += 0.1;
        }else{
          this.scaleX += 0.1;
        }
      }
    }
  },

  faceUp: function(){
    if(!this.isFacingUp()){
      this.turn();
    }
  },

  faceDown: function(){
    if(this.isFacingUp()){
      this.turn();
    }
  },

  onenterframe: function(){
    this.turning();
  },

  ontouchstart: function(){
    if(this.scene.canTurn()){
      this.faceUp();
    }
  }
});

var CardGroup = enchant.Class.create(Group, {
  initialize: function(){
    Group.call(this);
    this.cards = [];

    var lineFromNumber, colmFromNumber;

    lineFromNumber = function(i){
      return i % 4;
    }

    colmFromNumber = function(i){
      return Math.floor(i / 4);
    }

    for(i = 0; i < 8; i++){
      var cardA = new Card(i);
      var cardB = new Card(i);

      cardA.frame = i;
      cardB.frame = i;

      this.cards.push(cardA);
      this.cards.push(cardB);
    }

    this.cards.shuffle();

    var _this = this;

    this.cards.forEach(function(card, i, cards){
      _this.addChild(card);
      card.moveTo(colmFromNumber(i) * 154 + 335, lineFromNumber(i) * 154 + 55);
    });
  },

  faceUp: function(){
    this.cards.forEach(function(card, index, cards){
      card.faceUp();
    })
  },

  faceDown: function(){
    this.cards.forEach(function(card, index, cards){
      card.faceDown();
    })
  },

  facingUps: function(){
    return this.cards.filter(function(card){
      return card.isFacingUp();
    });
  }
});

var TitleScene = enchant.Class.create(Scene, {
  initialize: function () {
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
  initialize: function () {
    Scene.call(this);
    this.bg = new Sprite(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
    this.bg.image = core.assets["game.png"];
    this.addChild(this.bg);

    this.cards = new CardGroup();
    this.addChild(this.cards);

    this.touchCount = 0;
    this.score = 0;

    this.cards.faceUp()
    this.tl.delay(150).then(function(){
      this.cards.faceDown()
    });
  },

  canTurn: function(){
    if(this.cards.facingUps().length < 2){
      return true;
    }else{
      return false;
    }
  },

  onenterframe: function(){
    var _this = this;
    var isThereTurningCards = this.cards.cards.some(function(card){
      return card.isTurning;
    });

    var lastFaceUpAt = this.cards.cards.reduce(function(tmp, card, index, array){
      if(tmp < card.faceUpAt){
        tmp = card.faceUpAt;
      }

      return tmp;
    }, 0);

    var hasPassed1secFromLastFaceUpAt = lastFaceUpAt + 1 * core.fps == core.frame;

    var facingUps = this.cards.facingUps();

    if(!isThereTurningCards && hasPassed1secFromLastFaceUpAt && facingUps.length >= 2){
      if(facingUps[0].frame == facingUps[1].frame){
        facingUps.forEach(function(card, index, cards){
          _this.cards.cards.splice(_this.cards.cards.indexOf(card), 1);
          _this.cards.removeChild(card);
        });
      }
      this.cards.faceDown();
    }
    if(this.cards.cards.length == 0){
      core.gameOverScene = new GameOverScene();
      core.replaceScene(core.gameOverScene);
    }
  }
});

var GameOverScene = enchant.Class.create(Scene, {
  initialize: function () {
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

window.onload = function () {
  core = new Core(HQ_GAME_WIDTH, HQ_GAME_HEIGHT);
  var assets = [];
  assets.push("title.png");
  assets.push("game.png");
  assets.push("game_over.png");
  assets.push("card1.png");
  assets.push("card2.png");
  core.preload(assets);

  core.onload = function () {
    this.titleScene = new TitleScene();
    this.pushScene(this.titleScene);
  };

  core.start();
};