var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bg,bg1;
var score=0;

var gameOver, restart;



function preload(){
  trex_running =   loadAnimation("dora1.png","dora2.png","dora3.png","dora4.png");
  
  trex_collided = loadAnimation("trex_collided.png");
  
  
  bg=loadAnimation("2Ct5-0.png","2Ct5-1.png","2Ct5-2.png","2Ct5-3.png","2Ct5-4.png","2Ct5-5.png","2Ct5-6.png","2Ct5-7.png","2Ct5-8.png","2Ct5-9.png","2Ct5-10.png","2Ct5-11.png",
  "2Ct5-12.png","2Ct5-13.png","2Ct5-14.png","2Ct5-15.png","2Ct5-16.png","2Ct5-17.png","2Ct5-18.png","2Ct5-19.png","2Ct5-20.png","2Ct5-21.png","2Ct5-22.png","2Ct5-23.png",
  "2Ct5-24.png","2Ct5-25.png","2Ct5-26.png","2Ct5-27.png","2Ct5-28.png","2Ct5-29.png","2Ct5-30.png","2Ct5-31.png","2Ct5-32.png","2Ct5-33.png","2Ct5-34.png","2Ct5-35.png",
  "2Ct5-36.png","2Ct5-37.png","2Ct5-38.png","2Ct5-39.png","2Ct5-40.png","2Ct5-41.png","2Ct5-42.png","2Ct5-43.png","2Ct5-44.png","2Ct5-45.png","2Ct5-46.png","2Ct5-47.png",
  "2Ct5-48.png","2Ct5-49.png","2Ct5-50.png","2Ct5-51.png","2Ct5-52.png","2Ct5-53.png","2Ct5-54.png","2Ct5-55.png","2Ct5-56.png","2Ct5-57.png","2Ct5-58.png","2Ct5-59.png",
  "2Ct5-60.png","2Ct5-61.png","2Ct5-62.png","2Ct5-63.png","2Ct5-64.png","2Ct5-65.png")
   
 
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("game.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(70,170,20,50);
 
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.4;
  trex.debug=true
 
  trex.setCollider("circle",0,  0,40)
  bg1 = createSprite(300,100);
 
  bg1.addAnimation("bg1", bg);
  bg1.scale=1.2
  trex.depth=bg1.depth;
  trex.depth=trex.depth + 1;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("running", trex_running);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,170,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  
  background("white");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}