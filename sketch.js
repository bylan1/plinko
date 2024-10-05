// Format variables
let borderSpacing = 25;

// Base variables
let dropped = false;
let score = 0;
let noBalls = 5;
let noBuckets = 9;    // Must be less than 13 (size of ball exceeds bucket size)

// Arrays of elements
let boardPegs = [];
let ballBase = [];
let ball;

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
  for(let i=0; i<boardPegs.length; i++){
    boardPegs[i].drawCircle();
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
  for(let i=0; i<boardPegs.length; i++){
    env = new CollisionEnv(ball, boardPegs[i]);
    
    if(env.collisionDetection()){
      env.collisionReaction();
    }
  }
  
  // Complete Plinko section, add to score and reset Plinko ball
  if(ball.getY() >= height){
    let ballX = ball.getX();
    let scoreEdge = width / noBuckets;
    
    // For loop adding score depending on which bucket landed in (within which x range)
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
    if(noBalls >= 0){
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
    text(scoreLiteral, 10, borderSpacing * 2);

    // Display bucket scores
    textAlign(CENTER);
    textSize(15);
    fill([255, 0, 0]);
    let halfBuckets = ceil(noBuckets/2)
    for(let i=0; i<halfBuckets; i++){
      let lowerX = (2*width*i+width)/(noBuckets*2);
      let upperX = width - (2*width*i+width)/(noBuckets*2);
      text(`+${10 * (2**i)}`, lowerX, height-borderSpacing);
      if(upperX != lowerX){
        text(`+${10 * (2**i)}`, upperX, height-borderSpacing);
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
  // For loop to push all invisible separators of the score buckets
  for(let i = 1; i < noBuckets; i++){
    ballBase.push(new Ball(i * (width / noBuckets), height-borderSpacing, 1, [0, 0, 0]));
    ballBase.push(new Ball(i * (width / noBuckets), height-floor(borderSpacing/2), 1, [0, 0, 0]));
  }
  
  // Create the single playable ball
  ball = new PBall(width / 2, borderSpacing * 2, 15, [255, 0, 0]);
  
  // Define the space and parameters for the Plinko board pegs and push all pegs to the boardPegs array
  let lowerX = 150;
  let upperX = 700;
  let noLayers = 10;
  let noPegs = 7;
  let pegRad = 10;
  let colour = [0, 0, 0];
  
  let ySpacing = (upperX - lowerX)/noLayers;
  let xSpacing = width/(noPegs-1);

  for (let i=0; i<noLayers; i++){
    for (let j=0; j<noPegs; j++){
      let x = xSpacing * j;
      let y = lowerX + (i * ySpacing);

      if (i % 2 === 1) {
        x += xSpacing / 2;
      }

      boardPegs.push(new Ball(x, y, pegRad, colour));
    }
  }
}