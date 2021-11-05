//sprites
var alien, asteroid, bullet,
heart, meteor, ship, star;

//images
var alienImage, asteroidImage, bulletImage,
heartImage, meteorImage, shipImage, starImage;

//buttons
var back, gameOver, next, play, reset;
var backImage, gameOverImage, nextImage, playImage, resetImage;

//sounds
var laser, loop;

//groups
var alienGroup, asteroidGroup, bulletGroup,
heartGroup, meteorGroup, starGroup;

//game state
var gameState = "play";

//feedback
var score = 0;
var lives = 3;
var supply = "FULL";

function preload() {
  //sprites
  alienImage = loadImage("images/alien.jpg");
  asteroidImage = loadImage("images/asteroid.png");
  bulletImage = loadImage("images/bullet.png");
  heartImage = loadImage("images/heart.png");
  meteorImage = loadImage("images/meteor.png");
  shipImage = loadImage("images/ship.png");
  starImage = loadImage("images/star.png");

  //buttons
  backImage = loadImage("images/back.png");
  gameOverImage = loadImage("images/game over.png");
  nextImage = loadImage("images/next.png");
  playImage = loadImage("images/play.png");
  resetImage = loadImage("images/reset.png");

  //sounds
  laser = loadSound("sounds/laser.mp3");
  loop = loadSound("sounds/loop.mp3");
}

function setup() {
  createCanvas(400, 500);
  loop.loop()

  //sprites
  bullet = createSprite(400, 400, 10, 10);
  bullet.addImage(bulletImage);
  bullet.scale = 0.02;

  ship = createSprite(width/2, 470);
  ship.addImage(shipImage);
  ship.scale = 0.1;

  //buttons
  back = createSprite(20, width-20);
  back.addImage(backImage);
  back.scale = 0.5;
  back.visible = false;

  gameOver = createSprite(200, 200);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;

  play = createSprite(width/2, height/2);
  play.addImage(playImage);
  play.visible = false;
  //play.scale = 0.5;
  
  reset = createSprite(200, 300);
  reset.addImage(resetImage);
  reset.scale = 0.2;
  reset.visible = false;

  //edges
  leftEdge = createSprite(-5, 250, 5, 500);
  rightEdge = createSprite(405, 250, 5, 500);

  //groups
  alienGroup = new Group();
  asteroidGroup = new Group();
  bulletGroup = new Group();
  heartGroup = new Group();
  meteorGroup = new Group();
  starGroup = new Group();
}

function draw() {
  background(0);

  ship.bounceOff(leftEdge);
  ship.bounceOff(rightEdge);

  score = Math.round(score + frameCount/100);

  // if(gameState === "start") {
  //   alien.visible = false;
  //   asteroid.visible = false;
  //   back.visible = false;
  //   bullet.visible = false;
  //   gameOver.visible = false;
  //   alien.visible = false;
  //   heart.visible = false;
  //   meteor.visible = false;
  //   reset.visible = false;
  //   ship.visible = false;
  //   star.visible = false;
  //   play.visible = true;
  // }

  // if(mousePressed(play))

  if(gameState === "play") {

    if(keyDown("LEFT_ARROW")) {
      ship.x = ship.x - 5;
    }
    if(keyDown("RIGHT_ARROW")) {
      ship.x = ship.x + 5;
    }
    if(keyDown("SPACE") && supply != "EMPTY") {
      spawnBullets();
      laser.play();;
    }
 
    if(meteorGroup.isTouching(ship)) {
      lives--;
      meteorGroup.destroyEach();
    }
    if(alienGroup.isTouching(ship)) {
      lives--;
      alienGroup.destroyEach();
    }
    if(asteroidGroup.isTouching(ship)) {
      lives--;
      asteroidGroup.destroyEach();
    }

    if(meteorGroup.y > ship.y || alienGroup.y > ship.y || asteroidGroup.y > ship.y) {
      lives--;
      console.log(lives);
    }

    if(starGroup.isTouching(ship)) {
      score = score + 100;
      starGroup.destroyEach();
    }

    if(bulletGroup.isTouching(alienGroup)) {
      alienGroup.destroyEach();
      score = score + 100;
    }
    if(bulletGroup.isTouching(asteroidGroup)) {
      asteroidGroup.destroyEach();
      score = score + 100;
    }
    if(bulletGroup.isTouching(meteorGroup)) {
      meteorGroup.destroyEach();
      score = score + 100;
    }

    if(lives === 0) {
      gameState = "end";
    }

    spawnAliens();
    spawnAsteroids();
    spawnMeteors();
    spawnStars();
    spawnHearts();
  } else if(gameState === "end") {
    meteorGroup.setVelocityYEach(0);
    alienGroup.setVelocityYEach(0);
    asteroidGroup.setVelocityYEach(0);
    starGroup.setVelocityYEach(0);
    gameOver.visible = true;
    reset.visible = true;
    if(mousePressedOver(reset)){
      restart()
    }
  }

  drawSprites();

  fill("white");
  textSize(10);
  textFont("monospace");
  text("score: " + score, 10, 20);
  text("lives: " + lives, 10, 30);
  text("bullet supply: ", 10, 40);

  bulletSupplyText();
}

function spawnMeteors() {
  if(frameCount % 180 === 0) {
    meteor = createSprite(Math.round(random(0, 400)), -50);
    meteor.addImage(meteorImage);
    meteor.velocityY = 3 + score/1000;
    meteor.scale = 0.05;
    meteor.lifetime = 800;
    meteorGroup.add(meteor);
  }
}

function spawnAliens() {
  if(frameCount % 150 === 0) {
    alien = createSprite(Math.round(random(0, 400)), -50);
    alien.addImage(alienImage);
    alien.velocityY = 4 + score/1000;
    alien.scale = 0.04;
    alien.lifetime = 800;
    alienGroup.add(alien);
  }
}

function spawnAsteroids() {
  if(frameCount % 150 === 0) {
    asteroid = createSprite(Math.round(random(100, 300)), -50);
    asteroid.addImage(asteroidImage);
    asteroid.velocityY = 2 + score/1000;
    asteroid.scale = 0.05;
    asteroid.lifetime = 800;
    asteroidGroup.add(asteroid);
  }
}

function spawnBullets(){
  if(frameCount % 5 === 0) {
    bullet = createSprite(ship.x, ship.y - 40, 5, 10);
    bullet.velocityY = -5;
    bullet.addImage(bulletImage);
    bullet.scale = 0.5;
    bullet.lifetime = 150;
    bulletGroup.add(bullet);
}
}

function spawnStars() {
  if(frameCount % 200 === 0) {
    star = createSprite(Math.round(random(0, 400)), 0);
    star.velocityY = 6 + score/1000;
    star.addImage(starImage);
    star.scale = 0.05;
    star.lifetime = 500;
    starGroup.add(star);
  }
}

function restart() {
  gameState = "play";
  gameOver.visible = false;
  reset.visible = false;
  score = 0;
  lives = 10;
  meteorGroup.destroyEach();
  alienGroup.destroyEach();
  asteroidGroup.destroyEach();
  starGroup.destroyEach();
}

function bulletSupplyText() {
  if(score >= 0 && score < 500 ||
    score >= 1000 && score < 1500 ||
    score >= 2000 && score < 2500 ||
    score >= 3000 && score < 3500 ||
    score >= 4000 && score < 4500 ||
    score >= 5000 && score < 5500 ||
    score >= 6000 && score < 6500 ||
    score >= 7000 && score < 7500 ||
    score >= 8000 && score < 8500 ||
    score >= 9000 && score < 9500 ||
    score >= 10000 && score < 10500 ||
    score > 11000) {
    text("full", 90, 40);
    supply = "FULL";
  }
  if(score >= 500 && score < 700 ||
    score >= 1500 && score < 1700 ||
    score >= 2500 && score < 2700 ||
    score >= 3500 && score < 3700 ||
    score >= 4500 && score < 4700 ||
    score >= 5500 && score < 5700 ||
    score >= 6500 && score < 6700 ||
    score >= 7500 && score < 7700 ||
    score >= 8500 && score < 8700 ||
    score >= 9500 && score < 9700 ||
    score >= 10500 && score < 10700) {
    text("low", 90, 40);
    supply = "LOW";
  }
  if(score >= 700 && score < 1000 ||
    score >= 1700 && score < 2000 ||
    score >= 2700 && score < 3000 ||
    score >= 3700 && score < 4000 ||
    score >= 4700 && score < 5000 ||
    score >= 5700 && score < 6000 ||
    score >= 6700 && score < 7000 ||
    score >= 7700 && score < 8000 ||
    score >= 8700 && score < 9000 ||
    score >= 9700 && score < 10000 ||
    score >= 10700 && score < 11000) {
    text("empty", 90, 40);
    text("replenishing stock...", 90, 50);
    supply = "EMPTY";
  }
}

function spawnHearts() {
  if(frameCount % 1000 === 0 && lives <= 2) {
    heart = createSprite(0, Math.round(random(0, 1000)));
    heart.scale = 0.5;
    heart.velocityY = 8 + score/1000;
    heart.addImage(heartImage);
    heart.lifetime = 500;
    heartGroup.add(heart);
  }
}