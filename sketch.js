let boardBalls = [];
let ballBase = [];
let ball;
let dropped = false;
let score = 0;
let noBalls = 3;

// Standard setup and board preparation (pushing pegs and boundary lines)
function setup() {
  createCanvas(450, 800);
  prepareBoard();
}

function draw() {
  background(200);
  
  // Draw Plinko ball or display "Game over" message
  if(noBalls >= 0){
    ball.drawCircle();
  }
  
  // Display bucket separators (8 score buckets of equal size)
  for(let i=1; i<9; i++){
    stroke(0);
    strokeWeight(2);
    let lineX = i * (width / 9);
    line(lineX, height - 25, lineX, height);
  }

  // Display board pegs
  for(let i=0; i<boardBalls.length; i++){
    boardBalls[i].drawCircle();
  }
  
  // Display the score
  display(noBalls, score);
  
  // Drop the ball
  if(dropped && noBalls >= 0){
    ball.moveCircle();
    ball.checkBoundaries();
  }

  // React to collisions with Plinko ball and bucket separators (invisible balls at lines)
  for(let i=0; i<ballBase.length; i++){
    bounceEnv = new CollisionEnv(ball, ballBase[i]);
    
    if(bounceEnv.collisionDetection()){
      bounceEnv.collisionReaction();
    }
  }
  
  // React to collisions with Plinko ball and board pegs
  for(let i=0; i<boardBalls.length; i++){
    env = new CollisionEnv(ball, boardBalls[i]);
    
    if(env.collisionDetection()){
      env.collisionReaction();
    }
  }
  
  // Complete Plinko section, add to score and reset Plinko ball
  if(ball.getY() >= height){
    let ballX = ball.getX();
    let scoreEdge = width / 9;
    
    // Switch statement adding score based on the landing bucket
    switch(true){
      case (ballX < scoreEdge || ballX > 8 * scoreEdge):
        score += 10;
        break;
      case ((ballX > scoreEdge && ballX < 2 * scoreEdge) || (ballX > 7 * scoreEdge && ballX < 8 * scoreEdge)):
        score += 20;
        break;
      case ((ballX > 2 * scoreEdge && ballX < 3 * scoreEdge) || (ballX > 6 * scoreEdge && ballX < 7 * scoreEdge)):
        score += 40;
        break;
      case ((ballX > 3 * scoreEdge && ballX < 4 * scoreEdge) || (ballX > 5 * scoreEdge && ballX < 6 * scoreEdge)):
        score += 80;
        break;
      case (ballX > 4 * scoreEdge && ballX < 5 * scoreEdge):
        score += 160;
        break;
    }
    
    // Set status to undropped and reset location of the Plinko ball
    if(noBalls => 0){
      resetPlinko(ball);
      if(noBalls == 0){
        noBalls -= 1;
      }
    }
  }
}

/*
    Section of keyboard and mouse reactive functions
*/
// React to key press of 'r'
function keyPressed(){
  if(keyCode === 82 && noBalls >= 0){
    resetPlinko(ball);
    noBalls += 1;
  }
}

// Show undropped Plinko ball following the X value of the mouse in boundaries
function mouseMoved(){
  if(!dropped && noBalls > 0 && ball){
    ball.setX(mouseX);
    ball.drawCircle();
    ball.checkBoundaries();
  }
}

// Drop the undropped ball
function mouseClicked(){
  if(!dropped && noBalls > 0){
    dropped = true;
    noBalls -= 1;
  }
}

/*
    Functions used in specifically in sketch
*/
// Display score and bucket scores;
function display(noBalls, score){
  if(noBalls >= 0){
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(20);
    fill([0, 0, 0]);
    let scoreLiteral = 
        `Number of balls left: ${noBalls}
Your score: ${score}`
    text(scoreLiteral, 10, 50);

    // Display bucket scores
    textAlign(CENTER);
    textSize(15);
    fill([255, 0, 0]);
    for(let i=0; i<5; i++){
      text(`+${pow(2,i)*10}`, (2*width*i+width)/18, 775);
      if(i<4){
        text(`+${pow(2,i)*10}`, width - (2*width*i+width)/18, 775);
      }
    }
  } else if (noBalls < 0){
    stroke('black');
    textAlign(CENTER, CENTER);
    textSize(35);
    fill([255, 255, 255]);
    text(`Game over!
Your final score was: ${score}`, width/2, height/2);
  }
}

// Reset Plinko ball to top of the board
function resetPlinko(ball){
  dropped = false;
  ball.setX(width/2);
  ball.setY(50);
  ball.setDx(0);
  ball.setDy(0);
}

// Push ball elements (invisible separators, Plinko ball and board pegs) to their designated lists
function prepareBoard(){
  for(let i = 1; i < 9; i++){
    ballBase.push(new Ball(i * (width / 9), height-25, 1, [0, 0, 0]));
    ballBase.push(new Ball(i * (width / 9), height-12, 1, [0, 0, 0]));
  }
  
  ball = new PBall(width / 2, 50, 15, [255, 0, 0]);
  
  let pegScale = 13;// Must be odd
  let pegRad = 10;
  let levelSpace = 50;
  let startLevel = 150;
  
  for (let i=0; i<pegScale; i++){
    if(i%2 == 1){
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (1 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (3 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (5 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (7 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (9 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (11 * levelSpace), pegRad, [0, 0, 0]));
    } else if(i%2 == 0){
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel, pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (2 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (4 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (6 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (8 * levelSpace), pegRad, [0, 0, 0]));
      boardBalls.push(new Ball((width/(pegScale - 1)) * i, startLevel + (10 * levelSpace), pegRad, [0, 0, 0]));
    }
  }
}