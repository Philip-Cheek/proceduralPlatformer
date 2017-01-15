var ViewPort = function(walls){
	this.coord = [0, 0];
	this.walls =  walls;
}

ViewPort.prototype.offset = function(mPos, ctx){
	if (mPos[0] < this.coord[0] + this.walls[0]){
		this.coord[0] -= this.coord[0] + this.walls[0] - mPos[0];
	}else if (mPos[0] > this.coord[0] + this.walls[2]){
		this.coord[0] += mPos[0] - (this.coord[0] + this.walls[2]);
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