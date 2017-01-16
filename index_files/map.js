var Map = function(floor){
	this.floor = floor
	this.platforms = [];
}

Map.prototype.draw = function(ctx, offset){
	for (var i = 0; i < this.platforms.length; i++){
		var p = this.platforms[i];
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
		start[1]
	]


	for (var i = 0; i < 10; i ++){
		var xDiff = Math.random() * (maxDiff[0] - minDiff[0]) + minDiff[0],
			yDiff = Math.random() * (maxDiff[1] - minDiff[1]) + minDiff[1],
			length = Math.random() * (maxLen - 1) + 1,
			newCoord =  [lastCoord[0] + xDiff, lastCoord[1] - yDiff],
			config = {
				'coord': newCoord,
				'color': randomColor(),
				'length': Math.random() * (maxLen - 30) + 1,
				'thick': Math.random() * (20 - 4 + 1) + 4
			};

		this.platforms.push(new Platform(config));
		lastCoord = [newCoord[0] + config.length, newCoord[1]];
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
					return p.coord[1];
				}
			}
	}
}

function randomColor() {
   	var color = "rgb("

   	for (var i = 0; i < 3; i++){
   		color += (Math.random() * 255).toString();
   	}
   	
   	return color + ")"
}