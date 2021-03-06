/* jshint undef: true, unused: true, asi: true */
/* globals ctx, Resources, document*/

var Enemy = function() {

  this.speedAdjustment = 50;
  this.ypositions = [61,144,227];
  this.xpositions = [-200,-150,-100,-50,0,50,100,150,200,250,300];
  this.sprite = 'images/enemy-bug.png';
  this.x = this.xpositions[Math.floor(Math.random()*this.xpositions.length)];
  this.y = this.ypositions[Math.floor(Math.random()*this.ypositions.length)];
  this.speed = Math.random() * 200 + this.speedAdjustment;
}

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

  this.x = this.x + this.speed*dt;
  if (this.x > 5 * 101){

    if (allEnemies.length === 1) {
      this.speedAdjustment = 50;
    }
    this.x = -100;
    if (this.speedAdjustment < 215) {
      this.speedAdjustment = this.speedAdjustment + 5;
    }

    this.y = this.ypositions[Math.floor(Math.random()*this.ypositions.length)];
    this.speed = Math.random() * 215 + this.speedAdjustment;
  }
  if (this.x > 0)
    this.render();
}

Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 403;
}

Player.prototype.resetPosition = function() {
  this.x = 200;
  this.y = 403;
}

Player.prototype.update = function(){}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key){
  var self;
  if (canMove === true) {
    switch(key){
      case "left":
      if (this.x > 0){
        this.x = this.x - 101;
        this.render();
      }
      break;
      case "right":
      if (this.x < 400){
        this.x = this.x + 101;
        this.render();
      }
      break;
      case "up":
      if (this.y > 60){
        this.y = this.y - 83;
        this.render();
      }
      if (this.y < 0) {
        if (allEnemies.length < 6) {
          allEnemies[allEnemies.length] = new Enemy();
        }
        this.render();
        self = this;
        setTimeout(function() {
          self.x = 200;
          self.y = 403;
          canMove = true;
        }, 1500)

      }
      break;
      case "down":
      if (this.y < 400){
        this.y = this.y +83;
        this.render();
      }
      break;
    }
  }
}

var Gem = function(url, i) {
  this.indexOf = i;
  this.gem = url;
  this.pickedUp = false;
}

Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.gem), this.x, this.y);

}

Gem.prototype.getLoc = function(indexOf){

  if (allGems[indexOf].indexOf === 0) {
    this.x = gemXLoc[Math.floor(Math.random()*gemXLoc.length)];
    this.y = gemYLoc[Math.floor(Math.random()*gemYLoc.length)];
  }

  if (allGems[indexOf].indexOf === 1) {
    do {
      this.x = gemXLoc[Math.floor(Math.random()*gemXLoc.length)];
      this.y = gemYLoc[Math.floor(Math.random()*gemYLoc.length)];
    }
    while (this.x == allGems[0].x && this.y == allGems[0].y);
  }

  if (allGems[indexOf].indexOf === 2) {
    do {
      this.x = gemXLoc[Math.floor(Math.random()*gemXLoc.length)];
      this.y = gemYLoc[Math.floor(Math.random()*gemYLoc.length)];
    }
    while ((this.x == allGems[0].x && this.y == allGems[0].y) || (this.x == allGems[1].x && this.y == allGems[1].y));
  }
}

var gemUrls = ['images/GemBlue.png','images/GemGreen.png','images/GemOrange.png']
var gemXLoc = [16, 117, 218, 319, 420];
var gemYLoc = [99,184,267];
var canMove = true;
var allEnemies = [];
var allGems  = [];
for (var i = 0;i < 1; i++){
  allEnemies[i] = new Enemy();
}
var player = new Player();
for (var i = 0; i < gemUrls.length; i++) {
  allGems[i] = new Gem(gemUrls[i], i);
  allGems[i].getLoc(i);
}

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  }

  player.handleInput(allowedKeys[e.keyCode]);
})
