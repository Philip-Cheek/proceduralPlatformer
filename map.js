var Map = function(floor){
	this.floor = floor
	this.platforms = [];
	this.enemies = [];
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
	var minDiff = [
		maxDiff[0] * .1,
		maxDiff[1] * .1,
	], lastCoord = [
		start.coord[0] + start.length,
		start.coord[1]
	]

	for (var i = 0; i < 500; i ++){
		var xDiff = Math.random() * (maxDiff[0] - minDiff[0]) + minDiff[0],
			yDiff = Math.random() * (maxDiff[1] - minDiff[1]) + minDiff[1],
			length = Math.random() * (maxLen - 30) + 1,
			newCoord =  [lastCoord[0] + xDiff, lastCoord[1] + yDiff],
			type = getType(),
			config = {
				'coord': newCoord,
				'color': randomColor(),
				'length': length,
				'thick': Math.random() * (20 - 4 + 1) + 4,
				'type': type.n
			}

		this.ifEnemy(xDiff, yDiff, lastCoord);
		lastCoord = [newCoord[0] + config.length, newCoord[1]];

		if (type.n == 'move'){
			config.speed = type.s;
			config.range = type.r;
			lastCoord[0] += type.r[0];
			lastCoord[1] += type.r[1];
		}

		this.platforms.push(new Platform(config));
	}
}

Map.prototype.ifEnemy = function(xDiff, yDiff, lastCoord){
	if (Math.floor(Math.random() * 5) + 1 == 5){
		xDiff *= (Math.random() * (12 - 3 + 1) + 3) * .1;
		yDiff *= (Math.random() * (12 - 3 + 1) + 3) * .1;

		this.enemies.push(new Enemy({
			'coord': [xDiff + lastCoord[0], yDiff + lastCoord[1]],
			'left': 'eLeft',
			'right': 'eRight'
		}));
	}
}

Map.prototype.checkEnemy = function(coord, width, height){
	for (var i = 0; i < this.enemies.length; i++){
		var e = this.enemies[i],
			collide = e.collide(coord, width, height);

		if (collide){
			return collide;
		}
	}
}

Map.prototype.findFloor = function(x, y, width){
	var min = [];
	for (var i = 0; i < this.platforms.length; i++){
		var p = this.platforms[i];
		if (min.length == 0 || min[0] < x - window.innerWidth || min[1] > p.coord[1]){
			console.log("this min");
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
	console.log(min)
	if (min.length > 0 && y < min[1] - 300){
		return {'g': true};
	}
}

function getType(){
	var type;

	if (Math.floor(Math.random() * 4) + 1 == 4){
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