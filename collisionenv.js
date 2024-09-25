class CollisionEnv {
  constructor(ball1, ball2) {
    this.ball1 = ball1;
    this.ball2 = ball2;
    this.dampingFactor = 0.8;
  }

  collisionReaction() {
    this.resolveOverlap();
    this.vectorCalculation();
  }

  resolveOverlap() {
    let deltaX = this.ball2.getX() - this.ball1.getX();
    let deltaY = this.ball2.getY() - this.ball1.getY();
    let distance = sqrt(sq(deltaX) + sq(deltaY));

    // Calculate the overlap distance
    let overlap = this.ball1.getRad() + this.ball2.getRad() - distance;

    // Normalize the normal vector (direction of collision)
    let normalX = deltaX / distance;
    let normalY = deltaY / distance;

    // Move ball1 back along the normal vector by the overlap amount to prevent sticking
    this.ball1.setX(this.ball1.getX() - overlap * normalX);
    this.ball1.setY(this.ball1.getY() - overlap * normalY);
  }
  
  vectorCalculation() {
    // Step 1: Calculate the normal and tangent vectors
    let deltaX = this.ball2.getX() - this.ball1.getX();
    let deltaY = this.ball2.getY() - this.ball1.getY();
    let distance = sqrt(sq(deltaX) + sq(deltaY));

    // Normalize the normal vector
    let normalX = deltaX / distance;
    let normalY = deltaY / distance;

    // Tangent vector is perpendicular to the normal vector
    let tangentX = -normalY;
    let tangentY = normalX;

    // Step 2: Resolve the velocities into normal and tangent components
    // Ball 1
    let v1n = this.ball1.getDx() * normalX + this.ball1.getDy() * normalY; // Normal component
    let v1t = this.ball1.getDx() * tangentX + this.ball1.getDy() * tangentY; // Tangential component

    // Ball 2
    let v2n = 0; // Normal component
    let v2t = 0; // Tangential component

    // Step 3: Use conservation of momentum to update the normal velocities
    let newV1n = -v1n;
    
    newV1n *= this.dampingFactor;
    v1t *= this.dampingFactor;
    
    this.ball1.setDx(newV1n * normalX + v1t * tangentX);
    // + newV2n * normalX + v2t * tangentX
    this.ball1.setDy(newV1n * normalY + v1t * tangentY);
    // + newV2n * normalY + v2t * tangentY
    
  }

  collisionDetection() {
    let distX = this.ball2.getX() - this.ball1.getX();
    let distY = this.ball2.getY() - this.ball1.getY();
    let distance = sqrt(sq(distX) + sq(distY));

    return distance < this.ball1.getRad() + this.ball2.getRad();
  }
}
