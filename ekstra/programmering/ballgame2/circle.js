class Circle {
    constructor(color, position, direction, radius, mass) {
        this.color = color;
        this.x = position.x;
        this.y = position.y;
        this.a = direction.a;
        this.b = direction.b;
        this.r = radius;
        this.m = mass;
    }
    render() {
        fill(this.color);
        circle(this.x, this.y, this.r * 2);

        if (showVelocity) {
            strokeWeight(5);
            stroke("green");
            line(this.x, this.y, this.x + this.a * 10, this.y + this.b * 10);
            stroke("black");
            strokeWeight(1);
        }
    }
    collisionCheck() {
        // Change direction if hitting a wall
        if (this.x > width - this.r || this.x < this.r) this.a *= -1;
        if (this.y > height - this.r || this.y < this.r) this.b *= -1;
        
        // Clamp x and y so ball is always within boundary
        this.x = clamp(this.x, this.r, width - this.r);
        this.y = clamp(this.y, this.r, height - this.r);
    }
    move() {
        this.x += this.a;
        this.y += this.b;
    }
    /**
     * @param {Circle} circle 
     */
    ballCollide(circle) {
        const minDist = circle.r + this.r;
        const pointDist = dist(circle.x, circle.y, this.x, this.y);
        
        if (pointDist < minDist) {
            const c1 = this;
            const c2 = circle;
    
            const v1 = createVector(c1.a, c1.b);
            const v2 = createVector(c2.a, c2.b);
            const x1 = createVector(c1.x, c1.y);
            const x2 = createVector(c2.x, c2.y);
    
            const m1 = (2 * c2.m) / (c1.m + c2.m);
            const m2 = (2 * c1.m) / (c1.m + c2.m);
    
            const dy1 = p5.Vector.dot(p5.Vector.sub(v1, v2), p5.Vector.sub(x1, x2));
            const dy2 = p5.Vector.dot(p5.Vector.sub(v2, v1), p5.Vector.sub(x2, x1));
            const dx1 = p5.Vector.sub(x1, x2).mag() * p5.Vector.sub(x1, x2).mag();
            const dx2 = p5.Vector.sub(x2, x1).mag() * p5.Vector.sub(x2, x1).mag();
            const d1 = dy1 / dx1;
            const d2 = dy2 / dx2;
    
            const fx1 = p5.Vector.sub(x1, x2);
            const fx2 = p5.Vector.sub(x2, x1);
            const f1 = fx1.mult(m1 * d1);
            const f2 = fx2.mult(m2 * d2);
    
            const v1new = p5.Vector.sub(v1, f1);
            const v2new = p5.Vector.sub(v2, f2);

            c1.a = v1new.x;
            c1.b = v1new.y;
            c2.a = v2new.x;
            c2.b = v2new.y;

            const posVect = p5.Vector.sub(x1, x2);
            posVect.normalize();
            posVect.mult(minDist);

            c1.x = c2.x + posVect.x;
            c1.y = c2.y + posVect.y;
        }
    }
}