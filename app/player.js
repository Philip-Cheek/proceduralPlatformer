var Player = function(sprites){
	this.sprites = collectSprites(sprites);

	this.speed = 6;
	this.mapPos = [300, 400];
	this.face = 'right';
	this.prevFace;
	this.jump = {
		'velocity': 16,
		'gravity': .9,
		'rate': 16,
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
		'boost': false,
		'crouch': false
	}
}

Player.prototype.listenForMovement = function(){
	var moveKeys = {
		65: 'left',
		68: 'right',
		83: 'crouch',
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
	var self = this;

	this.keys.jump = true;
	this.jump.velocity = this.jump.rate;

	setTimeout(function(){
		self.keys.jump = false;
	}, 10);
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
		'face': this.face,
		'prev': this.prevFace
	}, move = determineMovement(moveAttrs);

	this.face = move.face;
	if (move.prev){
		this.prevFace = move.prev;
	}

	var sprite = this.sprites[this.face],
		fUpdate = checkCollision(this.mapPos, this.jump, floor, moveAttrs.keys, move),
		x = this.mapPos[0] - offset[0],
		y =  window.innerHeight - (this.mapPos[1] - offset[1] + sprite.height * .5),
		spScale = [sprite.width * .5, sprite.height * .5];

	ctx.drawImage(sprite, x, y, spScale[0], spScale[1]);

	this.mapPos[0] += move.update[0] + fUpdate.u[0];
	this.mapPos[1] += move.update[1] + fUpdate.u[1];

	if ('i' in fUpdate){
		return fUpdate.i;
	}
};

Player.prototype.dimen = function(){
	var sprite = this.sprites[this.face];

	return {
		'w': sprite.width * .5,
		'h': sprite.height * .5
	}
};

function determineMovement(m){
	var info = {
		'face': m.face,
	}, xVelocity = 0, 
	   yVelocity = 0;

	if (m.keys.left && !m.keys.right){
		xVelocity -= m.speed;
		info.face = 'left';
	}else if (m.keys.right){
		xVelocity += m.speed;
		info.face = 'right';
	}

	if (m.keys.crouch && m.jump.velocity == m.jump.rate){
		info.face = 'crouch';
		yVelocity = 0;
	}else{
		if (info.face == 'crouch'){
			info.face = m.prev;
		}

		yVelocity = determineJump(m.jump, m.keys.jump);

		if (Math.abs(yVelocity) > 0){
			if (info.face == 'right'){
				info.face = 'jumpRight';
				info.prev = 'right';
			}else if (info.face == 'left'){
				info.face = 'jumpLeft';
				info.prev = 'left';
			}
		}else if (info.face == 'jumpRight' || info.face == 'jumpLeft'){
			info.face = m.prev;
		}

	}

	if (m.face != 'crouch' && m.face != 'jumpRight' &&
		m.face != 'jumpLeft'){
		info.prev = m.face;
	}

	info.update = [xVelocity, yVelocity];
	return info;
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
		j.velocity = -j.gravity;
		j.press.j = false;
	}

	if (!floor || j.velocity != j.rate){
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

function collectSprites(sprites){
	var sp = {};

	for (var s in sprites){
		sp[s] = document.getElementById(sprites[s]);
	}

	return sp;
}