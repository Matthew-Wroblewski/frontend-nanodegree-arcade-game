/* jshint undef: true, unused: true, asi: true */
/* globals ctx, Resources, document, winScore */

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  // 227, 144,62 center y
  this.ypositions = [61,144,227];
  this.xpositions = [-200,-150,-100,-50,0,50,100,150,200,250,300];
  this.sprite = 'images/enemy-bug.png';
  this.x = this.xpositions[Math.floor(Math.random()*this.xpositions.length)];
  this.y = this.ypositions[Math.floor(Math.random()*this.ypositions.length)];
  this.speed = Math.random() * 200 + 85;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  this.x = this.x + this.speed*dt;
  if (this.x > 5 * 101){
    this.x = -100;
    // Returns a random integer between min (included) and max (included)
    // Using Math.round() will give you a non-uniform distribution!
    this.y = this.ypositions[Math.floor(Math.random()*this.ypositions.length)];
    // speed range from 25-75
    this.speed = Math.random() * 300 + 85;

  }
  if (this.x > 0)
  this.render();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 403;

}

Player.prototype.resetPosition = function() {
  this.x = 200;
  this.y = 403;
}
// This class requires an update(), render() and
// a handleInput() method.

Player.prototype.update = function(){

}


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
        winScore = winScore +50;
      this.render();
      self = this;
      canMove = false;

      setTimeout(function() {
        self.x = 200;
        self.y = 403;
        canMove = true;
      }, 1500)
      ctx.font = '23pt Arial';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'blue';
      fadeScore("+"+winScore);
      /*
      ctx.fillText("You win!", 200, 615);
      setTimeout(function() {
        ctx.clearRect(200,585,200,100);
      }, 2000) */

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

function fadeScore(text) {
    var alpha = 1.0,   // full opacity
       interval = setInterval(function () {
            ctx.clearRect(200,580,130,100); // Clears the canvas
            ctx.fillStyle = "rgba(50, 205, 50, " + alpha + ")";
            ctx.font = "italic 23pt Arial";
            ctx.fillText(text, 225, 615);
            alpha = alpha - 0.05; // decrease opacity (fade out)
            if (alpha < 0) {
                ctx.clearRect(200,580,130,100);
                clearInterval(interval);
            }
        }, 65);
}

var player = new Player();
var canMove = true;
var allEnemies = [];
for (var i = 0;i < 1; i++){
  allEnemies[i] = new Enemy();
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  }

  player.handleInput(allowedKeys[e.keyCode]);
})
