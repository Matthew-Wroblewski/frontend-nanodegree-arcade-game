/* Engine.js
* This file provides the game loop functionality (update entities and render),
* draws the initial game board on the screen, and then calls the update and
* render methods on player and enemy objects (defined in app.js).
*/

var Engine = (function(global) {

  var doc = global.document,
  win = global.window,
  canvas = doc.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  gemPickupSound = new Audio('sounds/gempickup.wav'),
  initialize = true,
  winScore = 50,
  highScore = 0,
  score = 0,

  gemXLoc,
  gemYLoc,

  greenGemLoc,
  greenGemXLoc,
  greenGemYLoc,
  pickedUpGreen,

  blueGemLoc,
  blueGemXLoc,
  blueGemYLoc,
  pickedUpBlue,

  orangeGemLoc,
  orangeGemXLoc,
  orangeGemYLoc,
  pickedUpOrange,

  lifeCount,
  addedScore,
  level,
  lastTime;

  canvas.width = 505;
  canvas.height = 700; /* 606 */
  doc.body.appendChild(canvas);

  function main() {
    /* Get our time delta information which is required if your game
    * requires smooth animation. Because everyone's computer processes
    * instructions at different speeds we need a constant value that
    * would be the same for everyone. */

    var now = Date.now(),
    dt = (now - lastTime) / 1000.0;

    update(dt);
    render();
    lastTime = now;

    win.requestAnimationFrame(main);
  }

  function init() {
    lifeCount = 3;
    level = 1;
    allEnemies.splice(0,allEnemies.length-1 );

    ctx.font = 'italic 35pt Cursive';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'blue';
    ctx.strokeText("Crazed Beatles", 86, 37);
    ctx.fillText("Crazed Beatles", 86, 37);

    ctx.clearRect(30,640,175,575);
    ctx.font = 'italic 15pt Arial';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'blue';
    ctx.fillText("Level: "+level, 30, 660);

    if (score > highScore) {
      highScore = score;
      ctx.clearRect(351,630,300,50);
      ctx.font = 'italic 15pt Arial';
      ctx.fillStyle = 'red';
      ctx.fillText("High Score:" +highScore, 351, 655);
    }

    score = 0;
    ctx.clearRect(351,580,150,50);
    ctx.font = 'italic 15pt Arial';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'blue';
    ctx.fillText("Score:" +score, 351, 620);
    livesLeft = 3;

    ctx.fillStyle = 'red';
    ctx.fillText("High Score:" +highScore, 351, 655);

    reset();
    lastTime = Date.now();
    main();
  }

  function update(dt) {
    updateEntities(dt);
    checkCollisions();
  }

  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
  }

  function checkCollisions () {

    if (player.y == -12) {
      if(addedScore === false) {
        score = score + winScore;
        canMove = false;
        ctx.clearRect(351,580,150,50);
        ctx.font = 'italic 15pt Arial';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'blue';
        ctx.fillText("Score:" +score, 351, 620);
        fadeScore("+"+winScore);

        ctx.clearRect(30,640,175,575);
        level++;
        ctx.font = 'italic 15pt Arial';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'blue';
        ctx.fillText("Level: "+level, 30, 660);
      }
      reset();

    } else if (player.y >= 60 && player.y <= 237) {

      addedScore = false;

      allEnemies.forEach(function(enemy) {
        // is the bug on the same row as the player?
        if (enemy.y == player.y - 10) {
          // is the bug on the player?
          if (enemy.x >= player.x - 30 && enemy.x <= player.x + 30) {
            if (lifeCount === 3) {
              ctx.clearRect(100,580,35,75);
              --lifeCount;
            }
            else if (lifeCount === 2) {
              ctx.clearRect(66,580,35,50);
              --lifeCount;
            }
            else {
              ctx.clearRect(30,580,35,75);
              --lifeCount;
            }
            this.player.resetPosition();
            if (lifeCount === 0){
              init();
            }
          }
        }
      });
    }
    if (player.y >= 60 && player.y <= 237)
    {
      if ((greenGemXLoc - player.x >= -30 && greenGemXLoc - player.x <= 30) && (greenGemYLoc - player.y >= -30 && greenGemYLoc - player.y <= 30) && (pickedUpGreen === false)) {
        pickedUpGreen = true;
        gemPickupSound.play();
        score = score + winScore;
        ctx.clearRect(351,580,150,50);
        ctx.font = 'italic 15pt Arial';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'blue';
        ctx.fillText("Score:" +score, 351, 620);
        fadeScore("+"+winScore);
      }
      else if  ((blueGemXLoc - player.x >= -30 && blueGemXLoc - player.x <= 30) && (blueGemYLoc - player.y >= -30 && blueGemYLoc - player.y <= 30) && (pickedUpBlue === false)) {
        pickedUpBlue = true;
        gemPickupSound.play();
        score = score + winScore;
        ctx.clearRect(351,580,100,50);
        ctx.font = 'italic 15pt Arial';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'blue';
        ctx.fillText("Score:" +score, 351, 620);
        fadeScore("+"+winScore);
      }
      else if ((orangeGemXLoc - player.x >= -30 && orangeGemXLoc - player.x <= 30) && (orangeGemYLoc - player.y >= -30 && orangeGemYLoc - player.y <= 30) && (pickedUpOrange === false)) {
        pickedUpOrange = true;
        gemPickupSound.play();
        score = score + winScore;
        ctx.clearRect(351,580,100,50);
        ctx.font = 'italic 15pt Arial';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'blue';
        ctx.fillText("Score:" +score, 351, 620);
        fadeScore("+"+winScore);
      }

    }
  }

  function render() {

    var rowImages = [
      'images/water-block.png',   // Top row is water
      'images/stone-block.png',   // Row 1 of 3 of stone
      'images/stone-block.png',   // Row 2 of 3 of stone
      'images/stone-block.png',   // Row 3 of 3 of stone
      'images/grass-block.png',   // Row 1 of 2 of grass
      'images/grass-block.png'    // Row 2 of 2 of grass
    ],
    numRows = 6,
    numCols = 5,
    row, col;

    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* Resources helpers to refer to our images
        * so that we get the benefits of caching these images, since
        * we're using them over and over. */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }


  function renderEntities() {

    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
    if (pickedUpGreen === false) {
      ctx.drawImage(Resources.get('images/GemGreen.png'), greenGemLoc[0], greenGemLoc[1]);
    }
    if (pickedUpBlue === false)
      ctx.drawImage(Resources.get('images/GemBlue.png'), blueGemLoc[0], blueGemLoc[1]);
    if (pickedUpOrange === false)
      ctx.drawImage(Resources.get('images/GemOrange.png'), orangeGemLoc[0], orangeGemLoc[1]);
  }

  function reset() {

    pickedUpGreen = false;
    pickedUpBlue = false;
    pickedUpOrange = false;
    addedScore = false;
    gemXLoc = [16, 117, 218, 319, 420];
    gemYLoc = [99,184,267];

    greenGemXLoc = gemXLoc[Math.floor(Math.random()*gemXLoc.length)];
    greenGemYLoc = gemYLoc[Math.floor(Math.random()*gemYLoc.length)];
    greenGemLoc = [greenGemXLoc,greenGemYLoc];

    do {
      blueGemXLoc = gemXLoc[Math.floor(Math.random()*gemXLoc.length)];
      blueGemYLoc = gemYLoc[Math.floor(Math.random()*gemYLoc.length)];
      blueGemLoc  = [blueGemXLoc, blueGemYLoc];
    }
    while (blueGemXLoc == greenGemXLoc && blueGemYLoc == greenGemYLoc);

    do {
      orangeGemXLoc = gemXLoc[Math.floor(Math.random()*gemXLoc.length)];
      orangeGemYLoc = gemYLoc[Math.floor(Math.random()*gemYLoc.length)];
      orangeGemLoc  = [orangeGemXLoc, orangeGemYLoc];
    }
    while ((orangeGemXLoc == greenGemXLoc && orangeGemYLoc == greenGemYLoc) || (orangeGemXLoc == blueGemXLoc && orangeGemYLoc == blueGemYLoc));

    if(lifeCount ===0 || lifeCount ===3)
    {
      ctx.drawImage(Resources.get('images/smallHeart.png'), 30, 580);
      ctx.drawImage(Resources.get('images/smallHeart.png'), 65, 580);
      ctx.drawImage(Resources.get('images/smallHeart.png'), 100, 580);
    }

    addedScore = true;
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

  /* Set init as the callback method, so that when
  * all of these images are properly loaded our game will start. */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/smallHeart.png',
    'images/GemGreen.png',
    'images/GemBlue.png',
    'images/GemOrange.png'
  ]);
  Resources.onReady(init);

  global.ctx = ctx;
  global.score = score;
  global.highScore = highScore;
  global.winScore = winScore;
})(this);
