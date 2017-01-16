var Platform = function(pConfig){
	this.coord = pConfig.coord;
	this.length = pConfig.length;
	this.color = pConfig.color;
	this.thick = pConfig.thick;

}

Platform.prototype.draw = function(ctx, offset){
	var x = this.coord[0], y = this.coord[1];
	ctx.fillStyle = this.color
	ctx.fillRect(x - offset[0], window.innerHeight - (y - offset[1]), this.length, this.thick)
}