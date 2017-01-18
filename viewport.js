var ViewPort = function(walls){
	this.coord = [0, 0];
	this.walls =  walls;
	this.rate = .01;
}

ViewPort.prototype.offset = function(mPos, ctx, j){
	// if (mPos[0] < this.coord[0] + this.walls[0]){
	// 	this.coord[0] -= this.coord[0] + this.walls[0] - mPos[0];
	// }else 

	this.coord[0] += this.rate;
	if (this.rate < 6){
		this.rate += .0002;
	}

	if (mPos[1] > this.coord[1] + this.walls[1]){
		if (j && this.coord[1] + 3 <= mPos[1]){
			this.coord[1]+= 3;
		}else if (this.coord[1] + 1 <= mPos[1]){
			this.coord[1] += 1
		}
	}

	if (mPos[0] > this.coord[0] + this.walls[2]){
		var rOffset = mPos[0] - (this.coord[0] + this.walls[2]);
		this.coord[0] += rOffset;
	}

	if (mPos[1] < this.coord[1] + this.walls[1]){
		this.coord[1] -= this.coord[1] + this.walls[1] - mPos[1];
	}else if(mPos[1] > this.coord[1] + this.walls[3]){
		this.coord[1] += mPos[1] - (this.coord[1] + this.walls[3]);
	}


	return [
		this.coord[0],
		this.coord[1]
	];
}