var Map = function(floor){
	this.floor = floor
	this.platforms = [];
	this.enemies = [];
	this.difficulty = 0;
	this.renderQueue = [];
	this.masterQueue = [];
	this.pruneHault = false;
}

Map.prototype.setBack = function(s){
	var self = this;
	this.pruneHault = true;

	var i = 0, r = s;

	if (r < 0){
		r = 0;
	}else{
		while (r - i > 0  && i < 4){
			r -= i;
			i++;
		}
	}

	var p = -1;

	for (var i = 0; i < this.masterQueue.length; i++){
		if (this.masterQueue[i].type == 'platform'){
			p++;
		}

		if (p == r){
			r = i;
		}

		if (p == s){
			s = i;
			break;
		}
	}

	this.setRender(r);

	return {
		'coord': [
			this.masterQueue[s].obj.coord[0], 
			this.masterQueue[s].obj.coord[1] + 500
		], 'callback': function(){
			setTimeout(function(){
				self.pruneHault = false;
			}, 100);
		}
	};
}

Map.prototype.draw = function(ctx, offset){
	var prune = [];
	if (this.pruneHault){
	}
	for (var i = 0; i < this.renderQueue.length; i++){
		var r = this.renderQueue[i].obj;
		if(r){
			if (r.coord[0] > offset[0] + (window.innerWidth * 1.5)){
				break;
			}else if (!this.pruneHault && 
				(r.coord[1] < offset[1] - (window.innerHeight * 2.5) ||
				r.coord[0] < offset[0] - (window.innerWidth * 2.5))){
				if (this.renderQueue[i].type == 'platform'){
					r.color = 'blue';
					prune.push(i);
				}
			}
			r.draw(ctx, offset);

		}
	}

	if (!this.pruneHault){
		this.prune(prune);
	}
}

Map.prototype.prune = function(prune){
	for (var x = 0; x < prune.length; x++){
		this.renderQueue.splice(prune[x], 1);
	}
}

Map.prototype.assemble = function(maxDiff, maxLen, start){
	start.color = randomColor();
	start.type = 'static';
	start.tag = 0;

	this.masterQueue.push({
		'type': 'platform', 
		'obj': new Platform(start)
	});

	var lastCoord = [
		start.coord[0] + start.length,
		start.coord[1]
	];

	for (var i = 0; i < 500; i ++){
		var m = this.getMultipliers(),
			diff = getDiff(maxDiff, m),
			length = getLen(maxLen, m),
			newCoord = [lastCoord[0] + diff.x, lastCoord[1] + diff.y],
			type = this.getType();
			var config = {
				'coord': newCoord,
				'color': randomColor(),
				'length': length,
				'thick': Math.random() * (20 - 4 + 1) + 4,
				'type': type.n,
				'tag': i + 1
			}

		this.ifEnemy(diff.x, diff.y, lastCoord);
		this.ifObstacle(diff.x, diff.y, lastCoord);
		this.ifHeart(newCoord, length);

		lastCoord = [newCoord[0] + config.length, newCoord[1]];

		if (type.n == 'move'){
			config.speed = type.s;
			config.range = type.r;
			lastCoord[0] += type.r[0];
			lastCoord[1] += type.r[1];
		}

		this.masterQueue.push({
			'type': 'platform',
			'obj': new Platform(config)
		});

		this.difficulty += .3;
	}

	this.setRender(0);
}

Map.prototype.setRender = function(idx){
	var q = [];

	while (idx >= 0 && idx < this.masterQueue.length){
		q.push(this.masterQueue[idx]);
		idx++;
	}

	this.renderQueue = q;
}
Map.prototype.getMultipliers = function(){
	var m = {};

	m.max = (50 + (this.difficulty * 4)) * .01;
	if (m.max > 1){ m.max = 1 };
	
	m.min = .05 + (this.difficulty * .1);
	if (m.min > .5){ m.min = .5};

	m.lmax = (100 - (this.difficulty * 5)) * .01;
	if (m.lmax < .2){ m.lmax = .2};

	m.lmin = (40 - (this.difficulty * 2)) * .01;
	if (m.lmin < .02){ m.lmin = .02};
	
	return m;
}

Map.prototype.ifHeart = function(newCoord, length){
	var roll = Math.floor(Math.random() * 3) + 1 == 3;

	if (roll){

		var config = {
			'x': newCoord[0],
			'y': newCoord[1],
			'len': length,
			'sprite': 'heart'
		}

		this.masterQueue.push({
			'type': 'heart',
			'obj': new Heart(config)
		});
	}
};

Map.prototype.ifObstacle = function(xDiff, yDiff, lastCoord){
	var d = this.difficulty;

	if (d > 5){
		eChance = 3;
	}else{
		eChance = Math.floor(9 - d);
	}

	var chance = Math.floor(Math.random() * eChance) + 1 == eChance,
		allow = xDiff > 50;

	if (chance && allow){
		var sMin = 15;

		if (d < 10){
			sMin += d;
		}

		var speed = Math.floor(Math.random() * (38 - sMin) + sMin),
			xMax = (xDiff/3) * 1.02,
			xMin = (xDiff/3) * .8,
			yMin = window.innerHeight * .3,
			yMax = window.innerHeight * .5,
			coord = [
				lastCoord[0] + Math.floor(Math.random() * (xMax - xMin) + xMin),
				lastCoord[1] - Math.floor(Math.random() * (yMax - yMin) + yMin)
			];

		this.masterQueue.push({
			'type': 'obstacle',
			'obj': new SpinSpike(coord, 'spike', speed)
		});
	}

};

Map.prototype.ifEnemy = function(xDiff, yDiff, lastCoord){
	var d = this.difficulty,
		eChance;

	if (d > 5){
		eChance = 3;
	}else{
		eChance = Math.floor(8 - d);
	}

	var isEnemy = Math.floor(Math.random() * eChance) + 1 == eChance;

	if (isEnemy){
		xDiff *= (Math.random() * (12 - 3 + 1) + 3) * .1;
		yDiff *= (Math.random() * (12 - 3 + 1) + 3) * .1;

		if (d > 2){ d = 2 };

		var xSpeed = Math.random() * ((3 + d) - (1 + d)) + (1 + d),
			ySpeed = Math.random() * ((3 + d) - (1 + d)) + (1 + d);

		this.masterQueue.push({
			'type': 'enemy',
			'obj': new Enemy({
				'coord': [xDiff + lastCoord[0], yDiff + lastCoord[1]],
				'left': 'eLeft',
				'right': 'eRight',
				'speed': [xSpeed, ySpeed]
			})
		});
	}
}


Map.prototype.collide = function(coord, width, height){
	var info = {}, min;

	for (var i = 0; i < this.renderQueue.length; i++){
		var render = this.renderQueue[i],
			type = render.type,
			rX = render.obj.coord[0],
			rY = render.obj.coord[1],
			stop = coord[0] + window.innerWidth;

		if ((type != 'enemy' && rX > stop) ||
			(type == 'enemy' && render.obj.update && render.obj.update.origin[0] > stop)){
			break;
		}

		if (type == 'heart'){
			if (!('heart' in info)){
				var heart = render.obj,
					health = heart.collide(coord, width, height);

				if (health.status){
					info.health = true;
				}
			}
		}else if (type != 'platform'){
			var collide = render.obj.collide(coord, width, height);
			if (collide.status){
				info.incident = collide.info;
				break;
			}
		}else{
			var platform = render.obj;

			var floor = platform.collide(coord, width, height);
			if (floor.status){
				info.floor = floor.info;
			}

			if (!min || min > rY){
				min = rY;
			}
		}

		if (min && coord[1] < min - 500){
			info.incident = 'kill';
			break;
		}
	}

	return info
}


Map.prototype.getType = function(){
	var type,
		d = this.difficulty,
		mChance;

	if (d > 5){
		mChance = 2;
	}else{
		mChance = Math.floor(7 - d);
	}

	var isMove = Math.floor(Math.random() * mChance) + 1 == mChance;

	if (isMove){
		type = 'move'
	}else{
		type = 'static'
	}

	if (type == "move"){
		var speed = (Math.random() * 3) + 1,
			range = [
				Math.random() * (300 - 100) + 100,
				0
			];
		return {'n': type, 's': speed, 'r': range}
	}
	return {'n': type}
}

var count = 1;

function getLen(maxLen, m){
	if (count < 2){
		count ++;
	}
	var max = maxLen * m.lmax,
		min = (maxLen * m.lmin) + 3;

	return Math.random() * (max - min) + min;
}

function getDiff(maxDiff, m){
	var max = [maxDiff[0] * m.max, maxDiff[1] * m.max],
		min = [max[0] * m.min, max[1] * m.min],
		y = Math.random() * (max[1] - min[1]) + min[1],
		x = Math.random() * (max[0] - min[0]) + min[0]

	if (y > maxDiff[1] * .5){
		if (x > maxDiff[0] * .5){
			var nDiff = ((maxDiff[1] - y)/(maxDiff[1] * .5)) * .5,
				nMin = nDiff * .8;

			x *= Math.random() * (nDiff - nMin) + nMin;
		}
	}

	return {'x': x, 'y': y};
}

function randomColor() {
   	var color = "rgb("

   	for (var i = 0; i < 3; i++){
   		color += Math.floor(Math.random() * 255).toString();
   		if (i < 3 -1){
   			color += ','
   		}
   	}

   	if (color == "rgb(255, 255, 255)"){
   		return randomColor();
   	}
   	
   	return color + ")"
}