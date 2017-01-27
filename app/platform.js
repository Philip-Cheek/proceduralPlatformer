
var Platform = function(pConfig){
	this.coord = pConfig.coord;
	this.length = pConfig.length;
	this.color = pConfig.color;
	this.thick = pConfig.thick;
	this.type = pConfig.type;
	this.tag = pConfig.tag;
	if (this.type == "move"){
		this.move = {
			'update': [pConfig.speed, pConfig.speed],
			'origin': [pConfig.coord[0], pConfig.coord[1]],
			'range': [
				pConfig.coord[0] + pConfig.range[0],
				pConfig.coord[1] + pConfig.range[1]
			]
		}
	}
}


Platform.prototype.draw = function(ctx, offset){
	var x = this.coord[0], y = this.coord[1];
	ctx.fillStyle = this.color
	ctx.fillRect(x - offset[0], window.innerHeight - (y - offset[1]), this.length, this.thick)

	if (this.type == "move"){
		var m = this.move
		for (var i = 0; i < 2; i++){
			if (this.coord[i] > m.range[i] || this.coord[i] < m.origin[i]){
				m.update[i] *= -1;
			}

			if (m.origin[i] != m.range[i]){
				this.coord[i] += m.update[i];
			}else if (m.update[i] != 0){
				m.update[i] = 0
			}
		}
	}
}

Platform.prototype.collide = function(pCoord, w, h){
	var c = [this.coord[0], this.coord[1]],
		x = pCoord[0],
		y = pCoord[1],
		len = this.length;

	if (y > c[1] - this.thick){
		var lLeft = x > c[0],
		lRight = x < c[0] + len,
		rLeft = x + w > c[0],
		rRight = x + w < c[0] + len;

		if (lLeft && lRight || rLeft && rRight || !lLeft && !rRight){
			var fInfo = {'y': c[1], "u": [0,0]}
			if (this.type == 'move'){
				fInfo.u[0] += this.move.update[0],
				fInfo.u[0] += this.move.update[1];
			}

			fInfo.i = this.tag;

			return {'status': true, 'info': fInfo};
		}
	}


	return {'status': false};
	
}