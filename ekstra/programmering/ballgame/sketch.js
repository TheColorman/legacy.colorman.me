const w = window.innerWidth;
const h = window.innerHeight;
let objects = [];
// world variables
let friction = 0.05;
let shoot_modifier = 10;

let held = -1;
let heldpos = {
    x: 0,
    y: 0
};
let released = false;
const spawn = {     // spawn functions
    golf_ball(x = 30, y = 30, d = 100, s = 10, vx = 1, vy = 1, m = 1) {
        let obj_golf_ball = {
            posx: x,
            posy: y,
            dia: d,
            speed: s,
            vectx: createVector(vx, vy).normalize().x,
            vecty: createVector(vx, vy).normalize().y,
            mass: m,
            stroke: "#000",
            fill: "#fff",
            type: "golf_ball"
        }
        objects.push(obj_golf_ball);
    },
    obstacle_ball(x = 30, y = 30, d = 100, s = 5, vx = 1, vy = 1, m = 1) {
        let obj_obstacle_ball = {
            posx: x,
            posy: y,
            dia: d,
            speed: s,
            vectx: createVector(vx, vy).normalize().x,
            vecty: createVector(vx, vy).normalize().y, 
            mass: m,
            stroke: "#000",
            fill: "#999",
            type: "obstacle_ball"
        }
        objects.push(obj_obstacle_ball);
    }
}
const render = {    // render functions
    golf_ball(object) {
        object = move.golf_ball(object);
        object = wall_collision.circle(object);
        object = object_collision.balls(object);
        strokeWeight(1);
        stroke(object.stroke);
        fill(object.fill);
        ellipse(object.posx, object.posy, object.dia);
        stroke(255, 0, 0);
        line(object.posx, object.posy, object.posx+object.vectx*object.speed*10, object.posy+object.vecty*object.speed*10);   
    },
    obstacle_ball(object) {
        object = move.obstacle_ball(object);
        object = wall_collision.circle(object);
        object = object_collision.balls(object);
        strokeWeight(1);
        stroke(object.stroke);
        fill(object.fill);
        ellipse(object.posx, object.posy, object.dia);
    }
}

const move = {      // move functions
    golf_ball(object) {
        object.speed = object.speed - friction;
        object.speed = object.speed < 0 ? 0 : object.speed;
        object.posx = object.posx + object.speed * object.vectx;
        object.posy = object.posy + object.speed * object.vecty;
        return object;
    },
    obstacle_ball(object) {
        object.speed = object.speed - friction;
        object.speed = object.speed < 0 ? 0 : object.speed;
        object.posx = object.posx + object.speed * object.vectx;
        object.posy = object.posy + object.speed * object.vecty;
        return object;
    }
}

const wall_collision = {
    circle(object) {
        if (object.posx + object.dia/2 > w || object.posx - object.dia/2 < 0) object.vectx *= -1;
        if (object.posy + object.dia/2 > h || object.posy - object.dia/2 < 0) object.vecty *= -1;
        if (object.posx + object.dia/2 > w) {object.posx = w - (object.dia/2 + 10)}
        if (object.posx - object.dia/2 < 0) object.posx = 0 + (object.dia/2 + 10)
        if (object.posy + object.dia/2 > h) object.posy = h - (object.dia/2 + 10)
        if (object.posy - object.dia/2 < 0) object.posy = 0 + (object.dia/2 + 10)
        return object;
    }
}

const object_collision = {
    balls(object) {
        let object2;                    // second colliding object
        let returned_object = object;   // object returned to previous function

        // start collision detection
        for (let i = 0; i < objects.length; i++) {
            object2 = objects[i];       // objects[i] is the original 2nd object
            if (object != object2) {
                if (dist(object.posx, object.posy, object2.posx, object2.posy) <= object.dia/2 + object2.dia/2) {
                    // after collision calculation. this is a pain in the ass.
                    // thanks wikipedia https://en.wikipedia.org/wiki/Elastic_collision
                    // i've written this shit like 8 times
                    // 9th time's the charm - apparently not;
                    // 10th time actually kinda worked, yay

                    let vector1 = createVector(object.vectx, object.vecty);
                    let vector2 = createVector(object2.vectx, object2.vecty);
                    let v1 = p5.Vector.mult(vector1, object.speed);
                    let v2 = p5.Vector.mult(vector2, object2.speed);
                    let m1 = object.mass;
                    let m2 = object2.mass;
                    let x1 = createVector(object.posx, object.posy);
                    let x2 = createVector(object2.posx, object2.posy);
                    
                    let tm1 = 2*m2;
                    let tm2 = 2*m1;

                    let admass = m1+m2;

                    let massdiv1 = -(tm1/admass);
                    let massdiv2 = -(tm2/admass);

                    let dot1sub1 = p5.Vector.sub(v1, v2);
                    let dot1sub2 = p5.Vector.sub(x1, x2);
                    let dot1 = p5.Vector.dot(dot1sub1, dot1sub2);
                    let dot2sub1 = p5.Vector.sub(v2, v1);
                    let dot2sub2 = p5.Vector.sub(x2, x1);
                    let dot2 = p5.Vector.dot(dot2sub1, dot2sub2);

                    let xmag1 = p5.Vector.mag(dot1sub2);
                    let xmag2 = p5.Vector.mag(dot2sub2);
                    let sqr1 = xmag1*xmag1;
                    let sqr2 = xmag2*xmag2;

                    let dotdiv1 = dot1/sqr1;
                    let dotdiv2 = dot2/sqr2;

                    let massdot1 = massdiv1*dotdiv1;
                    let massdot2 = massdiv2*dotdiv2;

                    let massdotcoord1 = p5.Vector.mult(dot1sub2, massdot1);
                    let massdotcoord2 = p5.Vector.mult(dot2sub2, massdot2);

                    let final1 = p5.Vector.add(v1, massdotcoord1);
                    let final2 = p5.Vector.add(v2, massdotcoord2);
                    let speed1 = p5.Vector.mag(final1);
                    let speed2 = p5.Vector.mag(final2);
                    let finalnormal1 = final1.copy().normalize();
                    let finalnormal2 = final2.copy().normalize();
                    returned_object.speed = speed1;
                    returned_object.vectx = finalnormal1.x;
                    returned_object.vecty = finalnormal1.y;
                    objects[i].speed = speed2;
                    objects[i].vectx = finalnormal2.x;
                    objects[i].vecty = finalnormal2.y;
                }
            }
        }
        return returned_object;
    }
}

function setup() {      // initiate
    createCanvas(w, h);
    background(200);
    spawn.golf_ball(w/5, h/2, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2, h/2, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 45, h/2 + 26, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 45, h/2 - 26, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 90, h/2, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 90, h/2 + 52, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 90, h/2 - 52, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 135, h/2 + 26, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 135, h/2 + 78, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 135, h/2 - 26, 50, 0, 0, 1, 1);
    spawn.obstacle_ball(w/3*2 + 135, h/2 - 78, 50, 0, 0, 1, 1);
}

function draw() {
    background(200);
    for (let i = 0; objects.length > i; i++) {  //go through each object and render it, passing the object
        let type = objects[i].type
        render[type](objects[i]);
    }
    if (!released && held != -1) {
        //if (objects[held].speed != 0) return;         REMOVE COMMENT: Shoot moving ball
        strokeWeight(5);
        line(mouseX, mouseY, objects[held].posx, objects[held].posy);
        stroke(255, 0, 0);
        let trajectory = createVector(objects[held].posx - mouseX, objects[held].posy - mouseY);
        strokeWeight(5);
        line(objects[held].posx, objects[held].posy, objects[held].posx + trajectory.x, objects[held].posy + trajectory.y);
        trajectory.mult(w);
        strokeWeight(1);
        line(objects[held].posx, objects[held].posy, objects[held].posx + trajectory.x, objects[held].posy + trajectory.y);
    }
}

// begin shooting if mouse is over white ball
function mousePressed() {
    released = false;
    for (let i in objects) {                    // test for clicking in a golf ball
        if (objects[i].type == "golf_ball" && dist(objects[i].posx, objects[i].posy, mouseX, mouseY) < objects[i].dia/2 + 5) {
            //if (objects[i].speed != 0) return;        REMOVE COMMENT: Shoot moving ball
            held = i;
            heldpos.x = mouseX;
            heldpos.y = mouseY;
        }
    }
}

// shoot ball
function mouseReleased() {
    if (held != -1) {
        //if (objects[held].speed != 0) return;         REMOVE COMMENT: Shoot moving ball
        let direction = createVector(objects[held].posx - mouseX, objects[held].posy - mouseY).normalize();
        let distance = dist(heldpos.x, heldpos.y, mouseX, mouseY) - objects[held].dia/2;
        objects[held].vectx = direction.x;
        objects[held].vecty = direction.y;
        objects[held].speed = distance / shoot_modifier;
    }
    held = -1;
    released = true;
}

function keyTyped() {
    if (key === 'p') {
        spawn.golf_ball(mouseX, mouseY, 100, 0, 1, 1, 100);
    }
}