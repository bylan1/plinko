// Format variables
let borderSpacing = 25;

let boardBalls = [];
let ballBase = [];
let ball;
let dropped = false;
let score = 0;
let noBalls = 5;
let noBuckets = 9;    // Must be less than 13 (size of ball exceeds bucket size)

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
  for(let i=1; i<noBuckets; i++){
    stroke(0);
    strokeWeight(2);
    let lineX = i * (width / noBuckets);
    line(lineX, height - borderSpacing, lineX, height);
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
    let scoreEdge = width / noBuckets;
    
    // For loop adding score depending on which bucket landed in (within which y range)
    for(let i=0; i<ceil(noBuckets/2); i++){
      let lowerEdge1 = scoreEdge * i;
      let lowerEdge2 = lowerEdge1 + scoreEdge;
      let upperEdge1 = width - scoreEdge * i;
      let upperEdge2 = upperEdge1 - scoreEdge;
      if((ballX > lowerEdge1 && ballX < lowerEdge2) || (ballX > upperEdge2 && ballX < upperEdge1)){
        score += (10 * (2**i));
      }
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
function keyPressed(){
  // React to key press of 'r' to reset
  if(keyCode === 82 && noBalls >= 0){
    resetPlinko(ball);
    noBalls += 1;
  }

  // React to key press of 'space' to drop an undropped ball
  if(keyCode === 32 && !dropped && noBalls > 0){
    dropped = true;
    noBalls -= 1;
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
    let halfBuckets = ceil(noBuckets/2)
    for(let i=0; i<halfBuckets; i++){
      let lowerX = (2*width*i+width)/(noBuckets*2);
      let upperX = width - (2*width*i+width)/(noBuckets*2);
      text(`+${pow(2,i)*10}`, lowerX, height-borderSpacing);
      if(upperX != lowerX){
        text(`+${pow(2,i)*10}`, upperX, height-borderSpacing);
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
  ball.setY(borderSpacing * 2);
  ball.setDx(0);
  ball.setDy(0);
}

// Push ball elements (invisible separators, Plinko ball and board pegs) to their designated lists
function prepareBoard(){
  for(let i = 1; i < noBuckets; i++){
    ballBase.push(new Ball(i * (width / noBuckets), height-borderSpacing, 1, [0, 0, 0]));
    ballBase.push(new Ball(i * (width / noBuckets), height-floor(borderSpacing/2), 1, [0, 0, 0]));
  }
  
  ball = new PBall(width / 2, borderSpacing * 2, 15, [255, 0, 0]);
  
  let pegScale = 13;    // Must be odd
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