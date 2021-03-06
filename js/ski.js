var MovingObject = require('./movingObject'),
    Utils = require('./utils'),
    Skier = require('./skier'),
    Obstacle = require('./obstacle'),
    Ramp = require('./ramp'),
    Yeti = require('./yeti');

var Ski = function (attr) {
  this.loadImages();
  this.speed = attr.speed;
  this.density = attr.density;
  this.monster = attr.monster;
  this.physics = attr.physics;
  this.friction = 15;
  this.obstacles = [];
  this.ramps = [];
  this.direction = 3;               // direction = clock position ( 3 right, 6 down, 9 left)
  this.god = false;
  this.over = false;
  this.isJumping = false;
  this.crashed = false;
  this.canCrash = true;
  this.distance = 0;
  this.timerStart = Date.now();
  this.objectId = 1;
  this.velocity = [0, 0];
  this.skier = new Skier({pos: [400, 300], game: this, img: this.skierImgs[3]});
  this.seedObjects();
}

Ski.prototype.setSpeed = function (s) {
  this.speed = s;
}

Ski.prototype.setDensity = function (d) {
  this.density = d;
}

Ski.prototype.setPhysics = function (p) {
  this.physics = p ? true : false;
}

Ski.prototype.setFriction = function (f) {
  this.friction = f;
}

Ski.prototype.seedObjects = function () {
  for (var i = 0; i < 10; i++) {
    this.addObject();
  }
  this.allObjects().forEach(function (obj) {  // object random position adjusted according
    var r = Math.random() * 200 + 100;        // to direction, this normalizes it for beginning of game
    obj.pos[1] -= r;
    obj.pos[0] -= 600;
  });
}

Ski.prototype.vels = function () {
  var s = this.speed;
  var vels = {
    3: [0,0],
    4: [-3 * s, -2 * s],
    5: [-2 * s, -3 * s],
    6: [0, -3.5 * s],
    7: [2 * s, -3 * s],
    8: [3 * s, -2 * s],
    9: [0,0],
    10: [0,0]
  };
    return vels;
}

Ski.prototype.remove = function (object) {
  if(object instanceof Obstacle){
    var i = this.obstacles.indexOf(object);
    this.obstacles.splice(i, 1);
  } else if (object instanceof Ramp) {
    var i = this.ramps.indexOf(object);
    this.ramps.splice(i, 1);
  } else if (object instanceof Yeti) {
    delete this.yeti;
  }
};

Ski.prototype.isMoving = function () {
  return this.direction > 3 && this.direction < 9;
}

Ski.prototype.restartTimer = function () {
  this.timerStart = Date.now();
}

Ski.prototype.getTimer = function () {
  if (this.isMoving()) {
    this.timerNow = Math.floor((Date.now() - this.timerStart)/1000) + "s";
  } else {
    this.restartTimer();
  }
  return this.timerNow;
}

Ski.prototype.loadImages = function () {
  // there has to be a better way to do this
  var ski3 = new Image();
  var ski4 = new Image();
  var ski5 = new Image();
  var ski6 = new Image();
  var ski7 = new Image();
  var ski8 = new Image();
  var ski9 = new Image();
  var ski10 = new Image();
  var skiCrash = new Image();
  var skiJump = new Image();
  var tree1 = new Image();
  var tree2 = new Image();
  var tree3 = new Image();
  var rock = new Image();
  var ramp = new Image();
  var banner = new Image();
  var yeti = new Image();
  var eat = new Image();

  yeti.src = 'img/yeti.png';
  ski3.src = 'img/skier3.png';
  ski4.src = 'img/skier4.png';
  ski5.src = 'img/skier5.png';
  ski6.src = 'img/skier6.png';
  ski7.src = 'img/skier7.png';
  ski8.src = 'img/skier8.png';
  ski9.src = 'img/skier9.png';
  ski10.src = 'img/skier10.png';
  skiCrash.src = 'img/skicrash.png';
  skiJump.src = 'img/skijump.png';
  tree1.src = 'img/tree1.png';
  tree2.src = 'img/tree2.png';
  tree3.src = 'img/tree3.png';
  rock.src = 'img/rock.png';
  ramp.src = 'img/ramp.png';
  banner.src = 'img/banner.png';
  eat.src = 'img/eat.png';
  this.skierImgs = {3: ski3, 4: ski4, 5: ski5, 6: ski6, 7: ski7, 8: ski8, 9: ski9, 10: ski10, crash: skiCrash, jump: skiJump, eat: eat};
  this.obstacleImgs = {0: tree1, 1: tree2, 2: tree3, 3: rock};
  this.rampImg = ramp;
  this.banner = banner;
  this.yetiImg = yeti;
}

Ski.prototype.allObjects = function () {
  var obj = this.obstacles.concat(this.ramps);
  if (this.yeti) { obj = obj.concat(this.yeti); }
  return obj;
}

Ski.prototype.startObjectInterval = function () {
  this.objInterval = setInterval(function () {
    if ( this.direction > 3 && this.direction < 9 ) {
      this.addObject();
    }
  }.bind(this), (250/this.speed)/this.density);
}

Ski.prototype.stopObjectInterval = function () {
  clearInterval(this.objInterval);
  this.objInterval = 0;
}

Ski.prototype.randomPosition = function () {
  var x = Math.floor(Math.random() * 1000) - 100;
  x += (6 - this.direction) * 200;
  return [x, 600];
}

Ski.prototype.draw = function (ctx, timeDelta) {
  ctx.clearRect(0,0,800,600);
  ctx.font="20px Helvetica";
  var timer = this.getTimer() || "0s";
  var distance = Math.floor(this.distance) + "ft";
  if (!this.isJumping) { this.skier.draw(ctx, timeDelta); }
  this.allObjects().forEach(function (obj) {
    obj.draw(ctx);
  });
  if (this.isJumping || this.over) { this.skier.draw(ctx, timeDelta); }
  ctx.drawImage(this.banner, 0, 0);
  ctx.fillText(timer + " / " + distance,680,55);
}

Ski.prototype.moveObjects = function (timeDelta) {
  this.allObjects().forEach(function (obj) {
    obj.move(timeDelta);
  });
}

Ski.prototype.shiftObjects = function (n) {
  this.allObjects().forEach(function (obj) {
    obj.shift(n);
  });
}

Ski.prototype.setMonster = function (mon) {
  this.monster = !!mon;
}

Ski.prototype.step = function (timeDelta) {
  if (!this.over) {
    var vel = this.vels()[this.direction];
    this.distance -= vel[1] / 13;
    if (this.distance > 750 && !this.yeti && this.monster) {   // MAKE 2500
      var r = Math.floor(Math.random() * 1000);
      if (r === 666) {
        this.bringOutTheYeti();
      }
    }
    this.updateCurrentVelocity();
    this.updateVelocities();
    this.moveObjects(timeDelta);
    this.checkCollisions();
  }
}

Ski.prototype.bringOutTheYeti = function () {
  var vel = [0,0];
  var randX = Math.floor(Math.random() * 2) === 0 ? -40 : 800;
  var randY = (Math.random() * 400) + 200;
  this.yeti = new Yeti({pos: [randX, randY], vel: vel, game: this, img: this.yetiImg});
}

Ski.prototype.checkCollisions = function () {
  var obj = this.allObjects();
  for (var i = 0; i < obj.length; i++) {
    if (this.skier.isCollidedWith(obj[i])) {
      this.skier.collideWith(obj[i]);
    }
  }
}

Ski.prototype.addObject = function () {
  var i = Math.floor(Math.random() * 10);
  var randomPos = this.randomPosition();
  var vel = this.velocity;
  while (this.overlappingObject(randomPos)) {
    randomPos = this.randomPosition();
  }
  if (i > 1) {
    var j = Math.floor(Math.random() * 4);
    var obstacle = new Obstacle({
      pos: randomPos,
      vel: vel,
      game: this,
      img: this.obstacleImgs[j],
      style: j,
      id: this.objectId
    });
    this.obstacles.push(obstacle);
  } else {
    var ramp = new Ramp({
      pos: randomPos,
      vel: vel,
      game: this,
      img: this.rampImg
    });
    this.ramps.push(ramp);
  }
  this.objectId += 1;
}

Ski.prototype.overlappingObject = function (testPosition) {
  var testHitbox = { top: testPosition[1] - 20, left: testPosition[0] - 20, right: testPosition[0] + 40, bottom: testPosition[1] + 60};
  var test = false;
  var hitbox;
  this.allObjects().forEach(function (obj) {
    hitbox = obj.getHitBox();
    if (Utils.overlap(hitbox, testHitbox)) { test = true; }
  });
  return test;
}

Ski.prototype.updateVelocities = function () {
  var velPhysics = this.velocity;
  var velNoPhysics = this.vels()[this.direction];
  this.allObjects().forEach(function (obj) {
    if (this.physics) {
      obj.vel = velPhysics;
    } else {
      obj.vel = velNoPhysics;
    }
  }.bind(this));
}

Ski.prototype.updateCurrentVelocity = function () {
    var target = this.vels()[this.direction];
    var v = this.velocity;
    if (this.direction === 10) {
      this.velocity = [0, 0];
      return;
    }
    var f = this.friction;
    if (target[0] === 0) { f /= 2; }
    if (v[0] > target[0]) { this.velocity[0] -= (v[0]-target[0])/(f); }
    else if (v[0] < target[0]) { this.velocity[0] += (target[0]-v[0])/(f); }
    if (v[1] > target[1]) { this.velocity[1] -= (v[1]-target[1])/(f*2); }
    else if (v[1] < target[1]) { this.velocity[1] += (target[1]-v[1])/(f*2); }
    if (target[1] === 0) { this.velocity[1] = 0; }
    if (this.isJumping) { this.velocity = target; }
}

Ski.prototype.changeDirection = function (keyCode) {  //37 left   39 right
  if (!this.crashed && !this.isJumping && !this.over) {
    var dir = this.direction;
    if (dir === 10) {
      setTimeout(function () {
        this.canCrash = true;
      }.bind(this), 1000)
    }
    if (keyCode === 37 && dir === 3) {
      this.direction = 9;
    } else if (keyCode === 37 && dir > 3 && dir < 9) {
      this.direction += 1;
    } else if (keyCode === 39 && dir === 9) {
      this.direction = 3;
    } else if (keyCode === 39 && dir > 3 && dir < 9) {
      this.direction -= 1;
    } else if (keyCode === 40) {
      if (!this.objInterval) {
        this.startObjectInterval();
      }
      this.direction = 6;
    } else if (keyCode === 37 && dir === 9) {
      this.shiftObjects(10);
    } else if (keyCode === 39 && dir === 3) {
      this.shiftObjects(-10);
    } else {
      return;
    }
    this.skier.img = this.skierImgs[this.direction];
    this.updateVelocities();
  }
}

Ski.prototype.skiCrash = function () {
  this.stopObjectInterval();
  this.direction = 10;
  this.skier.img = this.skierImgs["crash"];
  this.crashed = true;
  this.allObjects().forEach(function (obj) {
    obj.vel = [0, 0];
  });
  setTimeout(function () {
    if (!this.over) {
      this.crashed = false;
      this.skier.img = this.skierImgs[this.direction];
      this.updateVelocities();
    }
  }.bind(this), 1000);
}

Ski.prototype.skiJump = function () {
  this.isJumping = true;
  this.direction = 6;
  this.updateVelocities();
  this.canCrash = false;
  this.skier.img = this.skierImgs["jump"];
  setTimeout(function () {
    this.isJumping = false;
    this.canCrash = true;
    this.direction = 6;
    this.skier.img = this.skierImgs[this.direction];
    this.skier.animationDir = -1;
    this.skier.pos = [400, 300];
  }.bind(this), 2000);
}

Ski.prototype.killSkier = function () {
  this.over = true;
  this.yeti = null;
  this.skier.img = this.skierImgs["eat"];
  this.direction = 10;
}


module.exports = Ski;
