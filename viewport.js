var ViewPort = function(walls){
	this.coord = [0, 0];
	this.walls =  walls;
	this.rate = .01;
}

ViewPort.prototype.offset = function(mPos, ctx, j){
	// if (mPos[0] < this.coord[0] + this.walls[0]){
	// 	this.coord[0] -= this.coord[0] + this.walls[0] - mPos[0];
	// }else 
	if (mPos[0] > this.coord[0] + this.walls[2]){
		this.coord[0] += mPos[0] - (this.coord[0] + this.walls[2]);
	}

	if (mPos[1] < this.coord[1] + this.walls[1]){
		this.coord[1] -= this.coord[1] + this.walls[1] - mPos[1];
	}else if(mPos[1] > this.coord[1] + this.walls[3]){
		this.coord[1] += mPos[1] - (this.coord[1] + this.walls[3]);
	}

	if (mPos[1] > this.coord[1] + this.walls[1]){
		if (j){
			this.coord[1]+= 3;
		}else{
			this.coord[1] += 1
		}
	}

	this.coord[0] += this.rate;
	this.rate += .0005;

	return [
		this.coord[0],
		this.coord[1]
	];
}