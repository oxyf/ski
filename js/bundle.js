/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Ski = __webpack_require__(1),
	    SkiView = __webpack_require__(7);
	
	document.addEventListener('DOMContentLoaded', function () {
	  var canvas = document.getElementById('ski');
	  var ctx = canvas.getContext("2d");
	  canvas.height = 600;
	  canvas.width = 800;
	  var game = new Ski();
	  window.ski = game;
	  var view = new SkiView(game, ctx);
	  view.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2),
	    Utils = __webpack_require__(3),
	    Skier = __webpack_require__(4),
	    Obstacle = __webpack_require__(5),
	    Ramp = __webpack_require__(6);
	
	var Ski = function () {
	  this.loadImages();
	  this.obstacles = [];
	  this.god = false;
	  this.ramps = [];
	  this.crashed = false;
	  this.canCrash = true;
	  this.direction = 3;
	  this.speed = 1;
	  this.density = 1;
	  this.isJumping = false;
	  this.timerStart = Date.now();
	  // skiImg.onload = function () {
	  this.skier = new Skier({pos: [400, 300], game: this, img: this.skierImgs[3]});
	  // }.bind(this);
	  this.startObjectInterval();
	}
	
	Ski.prototype.setSpeed = function (s) {
	  this.stopObjectInterval();
	  this.speed = s;
	  this.updateVelocities();
	  this.startObjectInterval();
	}
	
	Ski.prototype.setDensity = function (d) {
	  this.stopObjectInterval();
	  this.density = d;
	  this.startObjectInterval()
	}
	
	Ski.prototype.vels = function () {
	  var s = this.speed;
	  var vels = {
	    3: [0,0],
	    4: [-8 * s, -6 * s],
	    5: [-4 * s, -8 * s],
	    6: [0, -13 * s],
	    7: [4 * s, -8 * s],
	    8: [8 * s, -6 * s],
	    9: [0,0],
	    10: [0,0]
	  };
	    return vels;
	}
	
	Ski.prototype.remove = function (object) {
	  if(object instanceof Obstacle){
	    var i = this.obstacles.indexOf(object);
	    this.obstacles.splice(i, 1);
	  } else if (false) {
	
	  }
	};
	
	Ski.prototype.isMoving = function () {
	  var moving = this.direction > 3 && this.direction < 9;
	  if (!moving) { this.restartTimer(); }
	  return moving;
	}
	
	Ski.prototype.restartTimer = function () {
	  this.timerStart = Date.now();
	}
	
	Ski.prototype.getTimer = function () {
	  if (this.isMoving()) {
	    this.timerNow = Math.floor((Date.now() - this.timerStart)/1000) + "s";
	  }
	  return this.timerNow;
	}
	
	
	Ski.prototype.loadImages = function () {
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
	  this.skierImgs = {3: ski3, 4: ski4, 5: ski5, 6: ski6, 7: ski7, 8: ski8, 9: ski9, 10: ski10, crash: skiCrash, jump: skiJump};
	  this.obstacleImgs = {0: tree1, 1: tree2, 2: tree3, 3: rock};
	  this.rampImg = ramp;
	}
	
	Ski.prototype.allObjects = function () {
	  var obj = this.obstacles.concat(this.ramps);
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
	
	Ski.prototype.draw = function (ctx) {
	  ctx.clearRect(0,0,800,600);
	  ctx.font="20px Helvetica";
	  var timer = this.getTimer() || "0s";
	  ctx.fillText(timer,750,25);
	  if (!this.isJumping) { this.skier.draw(ctx); }
	  this.allObjects().forEach(function (obj) {
	    obj.draw(ctx);
	  });
	  if (this.isJumping) { this.skier.draw(ctx); }
	}
	
	Ski.prototype.moveObjects = function () {
	  this.allObjects().forEach(function (obj) {
	    obj.move();
	  });
	}
	
	Ski.prototype.shiftObjects = function (n) {
	  this.allObjects().forEach(function (obj) {
	    obj.shift(n);
	  });
	}
	
	Ski.prototype.enableGodMode = function () {
	  this.god = true;
	}
	
	Ski.prototype.disableGodMode = function () {
	  this.god = false;
	}
	
	Ski.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
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
	  if (i > 2) {
	    var j = Math.floor(Math.random() * 4);
	    var obstacle = new Obstacle({
	      pos: this.randomPosition(),
	      vel: this.vels()[this.direction],
	      game: this,
	      img: this.obstacleImgs[j],
	      style: j
	    });
	    this.obstacles.push(obstacle);
	  } else {
	    var ramp = new Ramp({
	      pos: this.randomPosition(),
	      vel: this.vels()[this.direction],
	      game: this,
	      img: this.rampImg
	    });
	    this.ramps.push(ramp);
	  }
	}
	
	Ski.prototype.updateVelocities = function () {
	  this.allObjects().forEach(function (obj) {
	    obj.vel = this.vels()[this.direction];
	  }.bind(this));
	}
	
	Ski.prototype.changeDirection = function (keyCode) {  //37 left   39 right
	  if (!this.crashed && !this.isJumping) {
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
	  this.canCrash = false;
	  this.allObjects().forEach(function (obj) {
	    obj.vel = [0, 0];
	  });
	  setTimeout(function () {
	    this.crashed = false;
	    this.skier.img = this.skierImgs[this.direction];
	    this.updateVelocities();
	    this.startObjectInterval();
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
	
	
	module.exports = Ski;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	
	var MovingObject = function (attr) {
	  this.pos = attr.pos;
	  this.vel = attr.vel;
	  this.game = attr.game;
	  this.img = attr.img;
	}
	
	MovingObject.prototype.move = function () {
	  if (!this.vel) { debugger; }
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  if (this.pos[1] < -40) {
	    this.game.remove(this);
	  }
	}
	
	MovingObject.prototype.shift = function (n) {
	  this.pos[0] += n;
	}
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.drawImage(this.img, this.pos[0], this.pos[1]);
	}
	
	
	module.exports = MovingObject;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Utils = {};
	
	Utils.inherits = function (subclass, parentClass) {
	  var Surrogate = function () {};
	  Surrogate.prototype = parentClass.prototype;
	  subclass.prototype = new Surrogate();
	  subclass.prototype.constructor = subclass;
	}
	
	Utils.arrayEquals = function (arr1, arr2) {
	  if (!arr1 || !arr2) {
	    return false;
	  }
	  return arr1[0] === arr2[0] && arr1[1] === arr2[1];
	}
	
	Utils.overlap = function (r1, r2) {
	  return !(r2.left > r1.right ||
	           r2.right < r1.left ||
	           r2.top > r1.bottom ||
	           r2.bottom < r1.top);
	}
	
	
	
	module.exports = Utils;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2),
	    Utils = __webpack_require__(3),
	    Obstacle = __webpack_require__(5),
	    Ramp = __webpack_require__(6);
	
	var Skier = function (attr) {
	  var pos = attr.pos;
	  var game = attr.game;
	  var img = attr.img;
	  this.animationDir = -1;
	  MovingObject.call(this, {pos: pos, vel: [0, 0], game: game, img: img});
	}
	Utils.inherits(Skier, MovingObject);
	
	
	Skier.prototype.getHitBox = function () {
	  var pos = this.pos;
	  return {top: pos[1] + 10, bottom: pos[1] + 30, left: pos[0], right: pos[0] + 15};
	}
	
	Skier.prototype.isCollidedWith = function (otherObject) {
	  if (this.game.god) { return false; }
	  return Utils.overlap(this.getHitBox(), otherObject.getHitBox());
	};
	
	
	Skier.prototype.collideWith = function (otherObject) {
	  if (otherObject instanceof Obstacle && this.game.canCrash  && !this.game.isJumping) {
	    this.game.skiCrash();
	  } else if (otherObject instanceof Ramp && !this.game.isJumping) {
	    this.game.skiJump();
	  }
	}
	
	Skier.prototype.draw = function (ctx) {
	  if (this.game.isJumping) {
	    this.pos[1] += 5*this.animationDir;
	    if (this.pos[1] < 200) {
	      this.animationDir = 1;
	    }
	  }
	    ctx.drawImage(this.img, this.pos[0], this.pos[1]);
	}
	
	
	module.exports = Skier;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2),
	    Utils = __webpack_require__(3);
	
	var Obstacle = function (attr) {
	  this.style = attr.style;
	  MovingObject.call(this, attr);
	}
	Utils.inherits(Obstacle, MovingObject);
	
	Obstacle.prototype.getHitBox = function () {
	  var pos = this.pos;
	  if (this.style === 0) {
	    return {top: pos[1] + 20, bottom: pos[1] + 60, left: pos[0] + 10, right: pos[0] + 25};
	  } else if (this.style === 1) {
	    return {top: pos[1] + 12, bottom: pos[1] + 30, left: pos[0], right: pos[0] + 15};
	  } else if (this.style === 2) {
	    return {top: pos[1] + 10, bottom: pos[1] + 30, left: pos[0], right: pos[0] + 15};
	  } else {
	    return {top: pos[1] + 5, bottom: pos[1] + 12, left: pos[0], right: pos[0] + 15};
	  }
	}
	
	
	
	module.exports = Obstacle;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(2),
	    Utils = __webpack_require__(3);
	
	var Ramp = function (attr) {
	  MovingObject.call(this,attr);
	}
	
	Utils.inherits(Ramp, MovingObject);
	
	Ramp.prototype.getHitBox = function () {
	  var pos = this.pos;
	  return {top: pos[1], bottom: pos[1] + 5, left: pos[0], right: pos[0] + 25};
	}
	
	module.exports = Ramp;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Ski = __webpack_require__(1);
	
	var SkiView = function (game, ctx) {
	  this.game = game;
	  this.ctx = ctx;
	}
	
	SkiView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.bindSettingsHandler();
	  var callback = function () {
	    this.game.draw(this.ctx);
	    this.game.step();
	  }
	  this.gameInterval = setInterval(callback.bind(this), 50);
	}
	
	SkiView.prototype.bindKeyHandlers = function () {
	  var key;
	  $(document).on('keydown', function (e) {
	    key = e.keyCode;
	    if (key > 36 && key < 41) {
	      e.preventDefault();
	      this.unbindSettingsHandler();
	      this.game.changeDirection(e.keyCode);
	    }
	  }.bind(this));
	}
	
	SkiView.prototype.unbindKeyHandlers = function () {
	  $(document).off('keydown');
	}
	
	SkiView.prototype.bindSettingsHandler = function () {
	  $('.speed').on('click', function (e) {
	    var s = parseInt(e.target.id.substring(5,6));
	    $('.speed').children().each(function (i, el) {
	      $(el).removeClass();
	    });
	    $(e.target).addClass('selected');
	    this.game.setSpeed(s);
	  }.bind(this));
	  $('.density').on('click', function (e) {
	    var d = parseInt(e.target.id.substring(3,4));
	    $('.density').children().each(function (i, el) {
	      $(el).removeClass();
	    });
	    $(e.target).addClass('selected');
	    this.game.setDensity(d);
	  }.bind(this));
	}
	
	SkiView.prototype.unbindSettingsHandler = function () {
	  $('.speed').off('click');
	  $('.density').off('click');
	  $('.options').css('display', 'none');
	  $('.newgame').css('display', 'block');
	  $('.newgame').on('click', function (e) {
	    e.preventDefault();
	    this.unbindKeyHandlers();
	    clearInterval(this.gameInterval);
	    delete this.game;
	    this.game = new Ski();
	    $('.newgame').css('display', 'none');
	    $('.options').css('display', 'block');
	    this.start();
	  }.bind(this));
	
	}
	module.exports = SkiView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map