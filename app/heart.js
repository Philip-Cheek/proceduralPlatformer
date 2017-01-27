var Heart = function(config){
	this.active = true;
	this.sprite = document.getElementById(config.sprite);

	this.coord = [
		config.x + (config.len/2) - (this.sprite.width/2),
		config.y + 50
	];

	this.bob = {
		'max': 14,
		'origin': this.coord[1],
		'speed': 2,
		'dir': 1
	}
}

Heart.prototype.draw = function(ctx, offset){
	if (this.active){
		var h = this.sprite.height,
			x = this.coord[0] - offset[0],
			y =  window.innerHeight - (this.coord[1] - offset[1] + h);
		
		ctx.save();
		ctx.globalAlpha = 0.4;
		ctx.drawImage(this.sprite, x, y);
		ctx.restore();

		this.update();
	}
}

Heart.prototype.update = function(){
	var y = this.coord[1],
		b = this.bob,
		c = Math.abs(y - b.origin),
		s = b.speed * ((b.max - c)/b.max),
		max = b.origin + b.max,
		min = b.origin - b.max;

	if (s < 1){
		s = 1;
	}

	s *= b.dir;
	this.coord[1] += s;
	
	if (this.coord[1] >= max || this.coord[1] <= min){
		this.bob.dir *= -1;
	}
}

Heart.prototype.collide = function(pCoord, w, h){
	if (this.active){
		var sW = this.sprite.width,
			sH = this.sprite.height,
			c = this.coord,
			x = pCoord[0],
			y = pCoord[1],
			lLeft = x > c[0],
			lRight = x < c[0] + sW
			rLeft = x + w > c[0] ,
			rRight = x + w < c[0] + sW;

		if (lLeft && lRight || rLeft && rRight || !lLeft && !rRight){
			if (y + h < c[1] + sH && y + h > c[1] ||
			 y > c[1] && y < c[1] + sH || y < c[1] && y + h > c[1] + sH){
				this.active = false;

				return {'status': true};
			}
		}
	}

	return {'status': false}
}