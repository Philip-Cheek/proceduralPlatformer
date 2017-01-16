var Map = function(floor){
	this.floor = floor
	this.platforms = [];
}

Map.prototype.draw = function(ctx, offset){
	for (var i = 0; i < this.platforms.length; i++){
		var p = this.platforms[i];
		if (p.coord[0] > window.innerWidth + offset[0]){
			break;
		}
		p.draw(ctx, offset);
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


Map.prototype.findFloor = function(x, y, width){
	for (var i = 0; i < this.platforms.length; i++){
		var p = this.platforms[i];
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