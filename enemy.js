var Enemy = function(config){
	this.sprite = {
		'left': document.getElementById(config.left),
		'right': document.getElementById(config.right)
	}

	this.coord = config.coord;
	this.update = {};

	if ('range' in config){
		this.update.range = config.range;
	}else{
		this.update.range = [500, 100]
	}

	this.update.origin = [config.coord[0], config.coord[1]];

	if ('speed' in config){
		this.speed = config.speed;
	}else{
		this.speed = [3, 3];
	}
	this.fall = 0;

}

Enemy.prototype.draw = function(ctx, offset){
	var u = this.update,
		sprite;

	if (this.fall == 0){
		for (var i = 0; i < 2; i++){
			if (Math.abs(this.coord[i] - u.origin[i]) > u.range[i]){
				this.speed[i] *= -1;
			}
		}
	}

	if (this.speed[0] < 0){
		sprite = this.sprite.left;
	}else{
		sprite = this.sprite.right;
	}

	var h = sprite.height;

	ctx.drawImage(sprite, this.coord[0]  - offset[0], window.innerHeight - h - (this.coord[1] - offset[1]));

	if (this.fall == 0){
		this.coord[0] += this.speed[0];
		this.coord[1] += this.speed[1];
	}else{
		this.coord[1] += this.fall;
		this.fall *= 1.05;
	}
};

Enemy.prototype.fallDown = function(){
	this.fall -= 1
}
Enemy.prototype.collide = function(pCoord, w, h){
	var sW = this.sprite.left.width,
		sH = this.sprite.left.height,
		c = this.coord,
		x = pCoord[0],
		y = pCoord[1],
		lLeft = x > c[0],
		lRight = x < c[0] + sW
		rLeft = x + w > c[0] ,
		rRight = x + w < c[0] + sW;

		if (lLeft && lRight || rLeft && rRight || !lLeft && !rRight){
			if (y > c[1] + sH * .85 && y < c[1] + sW * 1.03){
				this.fallDown();
				return 'defeat';
			}else if (y + h < c[1] + sH && y + h > c[1] ||
			 y > c[0] && y < c[1] + sH || y < c[1] && y + h > c[1] + sH){
				return 'kill'
			}
		}

}

