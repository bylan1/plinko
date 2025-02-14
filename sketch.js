// Format variables
const borderSpacing = 25;
const startSpace = 150;

// Base variables
let balance = 100;
let index = 0;
const noBuckets = 15;
let incrementer = 10;
let ballPrice = incrementer;

// Accelerate or decelerate +/- operations
// let baseInterval = 30;
// let speedUpFactor = 0.95;

// Arrays of elements
let boardPegs = [];
let ballBase = [];
let balls = [];
let tempBall;
let dropped = [];
let prices = [];

// Standard setup and board preparation (pushing pegs and boundary lines)
function setup() {
  createCanvas(960, 960);
  prepareBoard();
}

function draw() {
  background(200);

  // Display bucket separators (8 multiplier buckets of equal size)
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

  // Work on in the future
  // if (keyIsDown(187) && noBalls > 0 && ballPrice < balance){
  //   let interval = baseInterval * pow(speedUpFactor, frameCount / 60);

  //   // Perform the action only at certain intervals
  //   if (frameCount % int(interval) === 0) {
  //     ballPrice += 10;
  //     prices[index] += 10;
  //   }
  // }
  
  for (const [ind, ball] of balls.entries()){
    // Draw Plinko ball or display "Game over" message
    if(balance >= 0){
      ball.drawCircle();
    }
    
    // Drop the ball
    if(dropped[ind] && balance >= 0){
      ball.setGrav(true);
      ball.moveCircle();
      ball.checkBoundaries();
    } else if (balance >= 0){
      ball.setGrav(false);
      ball.moveCircle();
      ball.checkBoundaries();
    }

    // React to collisions with Plinko ball and board pegs
    for(let i=0; i<boardPegs.length; i++){
      env = new CollisionEnv(ball, boardPegs[i]);
      
      if(env.collisionDetection()){
        env.collisionReaction();
      }
    }

    // React to collisions with Plinko ball and bucket separators (invisible balls at lines)
    for(let i=0; i<ballBase.length; i++){
      bounceEnv = new CollisionEnv(ball, ballBase[i]);
      
      if(bounceEnv.collisionDetection()){
        bounceEnv.collisionReaction();
      }
    }
    
    // Complete Plinko section, add multiplier to balance and reset Plinko ball
    if(ball.getY() >= height){
      let ballX = ball.getX();
      let bucketEdge = width / noBuckets;
      
      // For loop adding profit depending on which bucket landed in (within which x range)
      for(let i=0; i<ceil(noBuckets/2); i++){
        let lowerEdge1 = bucketEdge * i;
        let lowerEdge2 = lowerEdge1 + bucketEdge;
        let upperEdge1 = width - bucketEdge * i;
        let upperEdge2 = upperEdge1 - bucketEdge;
        let lowExp = floor(noBuckets/3) - 1;
        if((ballX > lowerEdge1 && ballX < lowerEdge2) || (ballX > upperEdge2 && ballX < upperEdge1)){
          balance += (prices[ind] * 2**(i-lowExp));
          balls.splice(ind, 1);
          dropped.splice(ind, 1);
          prices.splice(ind, 1);
          break;
        }
      }

      index -= 1;
    }
  }

  // Readjust the ballPrice to less than the balance
  if(balance < ballPrice){
    ballPrice = floor(balance / incrementer) * incrementer;
    prices.pop();
    prices.push(ballPrice);
  }

  // Display the balance (display GUI after due to balls array)
  display(index, balance);

  if(balance < 10 && index == 0){
    index -= 1;
    balls.splice(0, balls.length);
    dropped.splice(0, dropped.length);
    prices.splice(0, prices.length);
  }
}

/*
    Section of keyboard and mouse reactive functions
*/
function keyPressed(){
  // React to key press of 'r' to reset
  if(keyCode === 82 && balance >= 0){
    resetPlinko(balls[index]);
  }

  // React to key press of 'space' to drop an undropped ball
  if(keyCode === 32 && !dropped[index] && balance >= incrementer && ballPrice != 0){
    let direction = balls[index].getDx();
    balls[index].setDx(0);
    dropped[index] = true;
    index += 1;
    balance -= ballPrice;
    
    addBall(direction);
  }

  if(keyCode === 187 && ballPrice <= (balance-incrementer)){
    ballPrice += incrementer;
    prices.pop();
    prices.push(ballPrice);
  }

  if(keyCode === 189 && ballPrice > incrementer){
    ballPrice -= incrementer;
    prices.pop();
    prices.push(ballPrice);
  }
}

// Show undropped Plinko ball following the X value of the mouse in boundaries
// function mouseMoved(){
//   if(!dropped[index] && balls[index]){
//     balls[index].setX(mouseX);
//     balls[index].drawCircle();
//     balls[index].checkBoundaries();
//   }
// }

/*
    Functions used in specifically in sketch
*/
function addBall(direction){
  dropped.push(false);
  prices.push(ballPrice);
  tempBall = new PBall(balls[index-1].getX(), borderSpacing * 2, 15, [255, 0, 0], undefined, direction);
  balls.push(tempBall);
  tempBall = 0;
}

// Reset Plinko ball to top of the board
function resetPlinko(ball){
  dropped[index] = false;
  ball.setX(width/2);
  ball.setY(borderSpacing * 2);
  ball.setDx(0);
  ball.setDy(0);
}

// Display balance and bucket multipliers;
function display(index, balance){
  if(index >= 0){
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(20);
    fill([0, 0, 0]);
    let GUILiteral = 
        `Number of balls in action: ${index}
Your balance: $${balance}
Price: $${ballPrice}`
    text(GUILiteral, 10, borderSpacing * 3);

    // Display bucket multipliers
    textAlign(CENTER);
    textSize(15);
    fill([255, 0, 0]);
    let halfBuckets = ceil(noBuckets/2)
    let lowExp = floor(noBuckets/3) - 1;
    for(let i=0; i<halfBuckets; i++){
      let lowerX = (2*width*i+width)/(noBuckets*2);
      let upperX = width - (2*width*i+width)/(noBuckets*2);
      text(`${(2**(i-lowExp))}x`, lowerX, height-borderSpacing);
      if(upperX != lowerX){
        text(`${(2**(i-lowExp))}x`, upperX, height-borderSpacing);
      }
    }
  } else if (balance < incrementer && index < 0){
    stroke('black');
    textAlign(CENTER, CENTER);
    textSize(35);
    fill([255, 255, 255]);
    text(`Game over!
You ran out of money`, width/2, height/2);
  }
}

// Push ball elements (invisible separators, Plinko ball and board pegs) to their designated lists
function prepareBoard(){
  // For loop to push all invisible separators of the multiplier buckets
  for(let i = 1; i < noBuckets; i++){
    ballBase.push(new Ball(i * (width / noBuckets), height-borderSpacing, 1, [0, 0, 0]));
    ballBase.push(new Ball(i * (width / noBuckets), height-floor(borderSpacing/2), 1, [0, 0, 0]));
  }
  
  // Create the single playable ball
  tempBall = new PBall(width / 2, borderSpacing * 2, 15, [255, 0, 0], undefined, 5);
  balls.push(tempBall);
  tempBall = 0;
  dropped.push(false);
  prices.push(ballPrice);
  
  // Define the space and parameters for the Plinko board pegs and push all pegs to the boardPegs array
  const lowerX = startSpace;
  const upperX = (2/3) * height + startSpace;
  const noLayers = 11;
  const noPegs = 13;
  const pegRad = 10;
  const colour = [0, 0, 0];
  
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