var Map = function(floor){
	this.floor = floor
	this.platforms = [];
	this.enemies = [];
	this.difficulty = 0;
}

Map.prototype.draw = function(ctx, offset){
	for (var i = 0; i < this.platforms.length; i++){
		var p = this.platforms[i];
		if (p.coord[0] > window.innerWidth + offset[0]){
			break;
		}
		p.draw(ctx, offset);
	}

	for (var i = 0; i < this.enemies.length; i++){
		var e = this.enemies[i];
		e.draw(ctx, offset);
	}
}

Map.prototype.assemble = function(maxDiff, maxLen, start){
	start.color = randomColor();
	this.platforms.push(new Platform(start));
	var lastCoord = [
		start.coord[0] + start.length,
		start.coord[1]
	]

	for (var i = 0; i < 500; i ++){
		var m = this.getMultipliers(),
			diff = getDiff(maxDiff, m),
			length = getLen(maxLen, m),
			newCoord = [lastCoord[0] + diff.x, lastCoord[1] + diff.y],
			type = this.getType(),
			config = {
				'coord': newCoord,
				'color': randomColor(),
				'length': length,
				'thick': Math.random() * (20 - 4 + 1) + 4,
				'type': type.n
			}

		this.ifEnemy(diff.x, diff.y, lastCoord);
		lastCoord = [newCoord[0] + config.length, newCoord[1]];

		if (type.n == 'move'){
			config.speed = type.s;
			config.range = type.r;
			lastCoord[0] += type.r[0];
			lastCoord[1] += type.r[1];
		}

		this.platforms.push(new Platform(config));
		this.difficulty += .5;
	}
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

Map.prototype.ifEnemy = function(xDiff, yDiff, lastCoord){
	var d = this.difficulty,
		eChance;

	if (d > 5){
		eChance = 3;
	}else{
		eChance = Math.floor(8 - d);
		console.log("d", eChance);
	}

	var isEnemy = Math.floor(Math.random() * eChance) + 1 == eChance;

	if (isEnemy){
		xDiff *= (Math.random() * (12 - 3 + 1) + 3) * .1;
		yDiff *= (Math.random() * (12 - 3 + 1) + 3) * .1;

		if (d > 5){ d = 5 };

		var xSpeed = Math.random() * ((4 + d) - (1 + d)) + (1 + d),
			ySpeed = Math.random() * ((4 + d) - (1 + d)) + (1 + d);

		this.enemies.push(new Enemy({
			'coord': [xDiff + lastCoord[0], yDiff + lastCoord[1]],
			'left': 'eLeft',
			'right': 'eRight',
			'speed': [xSpeed, ySpeed]
		}));
	}
}

Map.prototype.checkEnemy = function(coord, width, height){
	var prune = [];

	for (var i = 0; i < this.enemies.length; i++){
		var e = this.enemies[i],
			collide = e.collide(coord, width, height);
			if (e.coord[0] > coord[0] + window.innerWidth){
				break;
			}

			if (e.coord[1] < coord[1] - window.innerHeight){
				prune.push(i);
			}

		if (collide){
			return collide;
		}
	}

	for (var x = 0; x < prune.length; x++){
		this.enemies.splice(prune[x], 1);
	}
}

Map.prototype.findFloor = function(x, y, width){
	var min = [];
	for (var i = 0; i < this.platforms.length; i++){
		var p = this.platforms[i];
		if (min.length == 0 || min[0] < x - window.innerWidth || min[1] > p.coord[1]){
			min = [p.coord[0], p.coord[1]];
		}

		if (y > p.coord[1] - p.thick){
			var lLeft = x > p.coord[0],
			lRight = x < p.coord[0] + p.length,
			rLeft = x + width > p.coord[0],
			rRight = x + width < p.coord[0] + p.length;

			if (lLeft && lRight || rLeft && rRight || !lLeft && !rRight){
				var fInfo = {'y': p.coord[1], "u": [0,0]}
				if (p.type == 'move'){
					fInfo.u[0] += p.move.update[0],
					fInfo.u[0] += p.move.update[1];
				}

				fInfo.i = i;
				return fInfo;
			}
		}
	}

	if (min.length > 0 && y < min[1] - 300){
		return {'g': true};
	}
}

Map.prototype.getType = function(){
	var type,
		d = this.difficulty,
		mChance;

	if (d > 5){
		mChance = 3;
	}else{
		mChance = 7 - d;
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
		console.log(maxLen, m);
		count ++;
	}
	var max = maxLen * m.lmax,
		min = (maxLen * m.lmin) + 3;

	return Math.random() * (max - min) + min;
}

function getDiff(maxDiff, m){
	var max = [maxDiff[0] * m.max, maxDiff[1] * m.max],
		min = [max[0] * m.min, max[1] * m.min];

	return {
		'x': Math.random() * (max[0] - min[0]) + min[0],
		'y': Math.random() * (max[1] - min[1]) + min[1]
	};
}

function randomColor() {
   	var color = "rgb("

   	for (var i = 0; i < 3; i++){
   		color += Math.floor(Math.random() * 255).toString();
   		if (i < 3 -1){
   			color += ','
   		}
   	}
   	
   	return color + ")"
}