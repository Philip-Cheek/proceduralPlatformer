var Background = function(spriteID){
	this.cSprite = document.getElementById(spriteID);
	this.clouds = [];
	this.check = false;
}

Background.prototype.assemble = function(){
	var lastCoord = [0, 0],	
		max = [window.innerWidth * .3, window.innerHeight * .3],
		min = [max[0] * .3, max[1] * .3],
		width = this.cSprite.width;


	for (var i = 0; i < 1000; i++){
		var scale = (Math.random() * (10 - 5) + 5) * .1,
			diff = [
				Math.random() * (max[0] - min[0]) + min[0],
				Math.random() * (max[1] - min[1]) + min[1]
			];

		for (var x = 0; x < diff.length; x++){
			if (Math.floor(Math.random() * 3) + 1 == 3 && diff[x] < lastCoord[x]){
				diff[x] *= -1;
			}
		}

		var cloud = {
			'coord': [
				lastCoord[0] + diff[0],
				lastCoord[1] + diff[1]
			], 'scale': scale
		}

		this.clouds.push(cloud);

		lastCoord = [
			cloud.coord[0] + (width * scale),
			cloud.coord[1]
		];
	}

	console.log(this.clouds);
}

Background.prototype.draw = function(ctx, offset){
	var pArr = [],
		sprite = this.cSprite,
		oSet = [offset[0] * .3, offset[1] * .3];

	for (var i = 0; i < this.clouds.length; i++){
		var cloud = this.clouds[i],
			c = cloud.coord,
			s = cloud.scale;

		if (c[0] > oSet[0] + (window.innerWidth * 1.2) &&
			c[1] > oSet[1] + (window.innerHeight * 1.2)){
			break;
		}else if (c[0] < oSet[0] - (window.innerWidth * .5) ||
			c[1] < oSet[1] - (window.innerHeight * .5)){
			pArr.push(i);
		}else{
			ctx.fill = "blue";
			ctx.fillRect(c - oSet[0], c - oSet[1], 50, 50);

			if (!this.check){
				console.log("c", c);
				console.log("s", s);
			}
		
			ctx.drawImage(sprite, c - oSet[0], window.innerHeight - (c - oSet[1]), s, s);
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