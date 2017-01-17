var Player = function(sprites){
	this.sprites = {
		'left': document.getElementById(sprites.left),
		'right': document.getElementById(sprites.right)
	}
	this.width = this.sprites.left.width;
	this.speed = 6;
	this.mapPos = [300, 400];
	this.face = 'right';
	this.jump = {
		'velocity': 20,
		'gravity': .9,
		'rate': 20,
		'press': {
			'j': false,
			'r': false,
			'l': false 
		}
	}

	this.keys = {
		'left': false,
		'right': false,
		'jump': false,
		'boost': false
	}
}

Player.prototype.listenForMovement = function(){
	var moveKeys = {
		65: 'left',
		68: 'right',
		16: 'boost',
		32: 'jump'
	}, keyDown, self = this;

	document.addEventListener('keydown', function(e){
		if (!keyDown || keyDown != e.keyCode){
			keyDown = e.keyCode;

			if (keyDown in moveKeys){
				var keyPress = moveKeys[keyDown];
				self.keys[keyPress] = true;
			}
		}
	});

	document.addEventListener('keyup', function(e){
		if (e.keyCode in moveKeys){
			var keyPress = moveKeys[e.keyCode];
			self.keys[keyPress] = false;
			keyDown = undefined;
		}
	});
}

Player.prototype.forceJump = function(){
	this.keys.jump = true;
	this.jump.velocity = this.jump.rate;
}

Player.prototype.forceFall = function(){
	this.jump.velocity = -j.gravity;
	this.jump.press.j = false;
}

Player.prototype.update = function(ctx, floor, offset){
	var moveAttrs = {
		'keys': this.keys,
		'speed': this.speed,
		'jump': this.jump,
		'face': this.face
	}, move = determineMovement(moveAttrs);
	this.face = move.face;
	var sprite = this.sprites.right,
		fUpdate = checkCollision(this.mapPos, this.jump, floor, moveAttrs.keys, move);

	ctx.drawImage(sprite, this.mapPos[0] - offset[0], window.innerHeight - (this.mapPos[1] - offset[1] + sprite.height * .5), sprite.width * .5, sprite.height * .5);
	this.mapPos[0] += move.update[0] + fUpdate.u[0];
	this.mapPos[1] += move.update[1] + fUpdate.u[1];

	if ('i' in fUpdate){
		return fUpdate.i;
	}
}


function determineMovement(m){
	var xVelocity = 0, face = m.face;

	if (m.keys.left && !m.keys.right){
		xVelocity -= m.speed;
		face = 'left'
	}else if (m.keys.right){
		xVelocity += m.speed
		face = 'right'
	}

	var yVelocity = determineJump(m.jump, m.keys.jump);

	return {
		'update': [xVelocity, yVelocity],
		'face': face
	};
}

function determineJump(j, jPress){
	var yVel = 0;

	if (j.velocity != j.rate || jPress){
		if (j.velocity == j.rate){
			j.press.j = true;
		}
		var g = j.gravity;

		if (j.press.j && jPress){
			g *= .5;
		}else if (j.press.j){
			j.press.j = false
		}

		yVel = j.velocity;

		if (j.velocity > j.rate * -1){
			j.velocity -= g;
		}

	}

	return yVel;
}

function checkCollision(pos, j, floor, keys, move){
	var cInfo = {'u': [0,0]}
	if (floor && pos[1] + move.update[1] < floor.y && j.velocity <= 0){
		pos[1] = floor.y;
		stopJump(j, keys, move);
		cInfo.i = floor.i;
	}

	if (!floor && j.velocity == j.rate ||
		floor && pos[1] > floor.y && move.update[1] == 0){
		console.log("GO");
		j.velocity = -j.gravity;
		j.press.j = false;
	}

	if (!floor){
		return cInfo;
	}else{
		cInfo.u = floor.u
		return cInfo;
	}
}

function stopJump(j, keys, move){
	j.velocity = j.rate;
	keys.jump = false;
	move.update = [0, 0];
}