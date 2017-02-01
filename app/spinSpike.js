var SpinSpike = function(coord, spriteID, speed){
	this.coord = coord;
	this.origin = [coord[1]]
	this.sprite = document.getElementById(spriteID);
	this.gravity = .9;
	this.rate = speed;
	this.velocity = speed;
	this.rotate = 0;
}

SpinSpike.prototype.draw = function(ctx, offset){
	if (this.coord[1] <= this.origin){
		this.velocity = this.rate;
	}

	var w = this.sprite.width/2,
		h = this.sprite.height/2;

	
	ctx.save();

	ctx.translate(
		this.coord[0] + w - offset[0], 
		window.innerHeight - (this.coord[1] + h - offset[1])
	);

	ctx.rotate(this.rotate)
	ctx.translate(-w, -h)
	ctx.drawImage(this.sprite, 0, 0);

	ctx.restore();

	this.coord[1] += this.velocity;

	if (this.gravity > -10){
		this.velocity -= this.gravity;
	}

	this.rotate += 1;
}

SpinSpike.prototype.collide = function(pCoord, w, h){
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
				return {'status': true, 'info': 'kill'};

			}
		}

	return {'status': false}
}