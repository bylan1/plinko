class PBall {
  constructor(x, y, rad, colour, gravity = 0.5, dx = 0, dy = 0){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.rad = rad;
    this.mass = PI * sq(rad);
    this.colour = colour;
    this.gravity = gravity;
  }
  
  drawCircle(){
    noStroke();
    fill(this.colour[0], this.colour[1], this.colour[2]);
    circle(this.x, this.y, this.rad*2);
  }
  
  moveCircle(){
    this.dy += this.gravity;
    this.x += this.dx;
    this.y += this.dy;
  }
  
  checkBoundaries(){
    if (this.x >= width - this.rad || this.x <= this.rad){
      this.dx *= -1;
      if (this.x >= width - this.rad){
        this.x = width - this.rad;
      } else {
        this.x = this.rad;
      }
    }
    
    // No bottom boundary
    if (this.y <= this.rad){
      this.dy *= -1;
      this.y = this.rad;
    }
  }
  
  getRad(){
    return this.rad;
  }
  
  getMass(){
    return this.mass;
  }
  
  getColour(){
    return this.colour;
  }
  
  setColour(colour){
    this.colour = colour;
  }
  
  getMomentum(){
    return sqrt(sq(this.dx) + sq(this.dy)) * this.mass;
  }
  
  getX(){
    return this.x;
  }
  
  getY(){
    return this.y;
  }
  
  setX(x){
    this.x = x;
  }
  
  setY(y){
    this.y = y;
  }
  
  getDx(){
    return this.dx;
  }
  
  getDy(){
    return this.dy;
  }
  
  setDx(dx){
    this.dx = dx;
  }
  
  setDy(dy){
    this.dy = dy;
  }
}