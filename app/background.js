var Background = function(spriteID){
	this.cSprite = document.getElementById(spriteID);
	this.clouds = [];
	this.check = false;
}

Background.prototype.assemble = function(){
	var column = 0, row = 0,
		max = [window.innerWidth * .7, window.innerHeight * .2],
		min = [max[0] * .3, max[1] * .3],
		width = this.cSprite.width, 
		height = this.cSprite.height;


	for (var i = 0; i < 10; i++){
		lastX = column;
		for (var x = 0; x < 60; x++){
			var scale = (Math.random() * (10 - 4) + 4) * .1,
				diff = [
					Math.random() * (max[0] - min[0]) + min[0],
				    Math.random() * (max[1] - min[1]) + min[1]
				];

			for (var d = 0; d < 2; d++){
				if (Math.floor(Math.random() * 2) + 1 == 2){
					diff[d] *= -1;
				}
			}

			var cloud = {
				'coord': [
					lastX + diff[0],
					row + diff[1]
				], 'scale': scale
			}

			this.clouds.push(cloud);
			if (lastX < cloud.coord[0]){
				lastX = cloud.coord[0];
			}

		}

		row += window.innerHeight * .5;

		if (i > 0 && i % 30 == 0){
			column += window.innerWidth;
		}
	}
		
	

	var min;

	for (var i = 0; i < this.clouds.length - 1; i++){
		var min = i,
			cM = this.clouds[min].coord,
			minVal = cM[0] + cM[1];

		for (var x = i + 1; x < this.clouds.length; x++){
			var c = this.clouds[x].coord,
				cVal = c[0] + c[1];
			if (min > cVal){
				min = i;
			}
		}

		if (min != i){
			var temp = this.clouds[i];
			this.clouds[i] = this.clouds[min],
			this.clounds[min] = temp;
		}
	}
}

Background.prototype.draw = function(ctx, offset){
	var pArr = [],
		sprite = this.cSprite;

	for (var i = 0; i < this.clouds.length; i++){
		var cloud = this.clouds[i],
			c = cloud.coord,
			s = cloud.scale,
			oSet = [
				offset[0] * (.35 * cloud.scale),
				offset[1] * (.35 * cloud.scale)
			];

		if (c[0] > oSet[0] + (window.innerWidth * 1.5) &&
			c[1] > oSet[1] + (window.innerHeight * 1.5)){
			break;
		}else if (c[0] < oSet[0] - (window.innerWidth * 1.1) ||
			c[1] < oSet[1] - (window.innerHeight * 1.1)){
			pArr.push(i);
		}else{
			
			ctx.drawImage(sprite, c[0] - oSet[0], window.innerHeight - (c[1] + sprite.height - oSet[1]), sprite.width * s, sprite.height * s);
		}
	}

	if (this.check == false){
		this.check = true;
	}

	this.prune(pArr);
}

Background.prototype.prune = function(p){
	for (var i = 0; i < p.length; i++){
		this.clouds.splice(p[i], 1);
	}
}