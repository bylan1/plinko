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
  print(`Number of balls left: ${noBalls}`);
}

function draw() {
  background(200);
  
  // Draw Plinko ball or display "Game over" message
  if(noBalls > 0){
    ball.drawCircle();
  } else if(noBalls == 0) {
    print(`Game over. Your final score was: ${score}`);
    noBalls -= 1;
  }
  
  // Display bucket separators (8 score buckets of equal size)
  for(let i=1; i<9; i++){
    stroke(0);
    strokeWeight(2);
    let lineX = i * (width / 9);
    line(lineX, height - 25, lineX, height);
  }
  
  // Display bucket scores
  for(let i=0; i<5; i++){
    noStroke();
    textAlign(CENTER);
    text(`+${pow(2,i)*10}`, (2*width*i+width)/18, 775);
    if(i<4){
      textAlign(CENTER);
      text(`+${pow(2,i)*10}`, width - (2*width*i+width)/18, 775);
    }
  }

  // Display board pegs
  for(let i=0; i<boardBalls.length; i++){
    boardBalls[i].drawCircle();
  }
  
  // Drop the ball
  if(dropped && noBalls > 0){
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
    resetPlinko(ball);
    
    print(`Your score: ${score}`);
  }
}

// React to key press of 'r'
function keyPressed(){
  if(keyCode === 82){
    resetPlinko(ball);
    noBalls += 1;
    print(`Number of balls left: ${noBalls}`);
  }
}

// Show undropped Plinko ball following the X value of the mouse in boundaries
function mouseMoved(){
  if(!dropped && noBalls > 0){
    ball.setX(mouseX);
    ball.drawCircle();
    ball.checkBoundaries();
  }
}

// Reset Plinko ball to top of the board
function resetPlinko(ball){
  noBalls -= 1;
  dropped = false;
  ball.setX(width/2);
  ball.setY(50);
  ball.setDx(0);
  ball.setDy(0);
}

// Drop the undropped ball
function mouseClicked(){
  if(!dropped && noBalls > 0){
    print(`Number of balls left: ${noBalls-1}`);
    dropped = true;
  }
}

// Push ball elements (invisible separators, Plinko ball and board pegs) to their designated lists
function prepareBoard(){
  for(let i = 1; i < 9; i++){
    ballBase.push(new Ball(i * (width / 9), height-25, 1, [0, 0, 0]));
    ballBase.push(new Ball(i * (width / 9), height-12, 1, [0, 0, 0]));
  }
  
  ball = new PBall(width / 2, 50, 15, [255, 0, 0]);
  
  for (let i=0; i<17; i++){
    if(i%2 == 1){
      boardBalls.push(new Ball((width/16) * i, 200, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 300, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 400, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 500, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 600, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 700, 10, [0, 0, 0]));
    } else if(i%2 == 0){
      boardBalls.push(new Ball((width/16) * i, 150, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 250, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 350, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 450, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 550, 10, [0, 0, 0]));
      boardBalls.push(new Ball((width/16) * i, 650, 10, [0, 0, 0]));
    }
  }
}