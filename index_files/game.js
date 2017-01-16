var Game = function(canvasID, background){
	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext('2d');
	this.background = document.getElementById(background);
	this.bCoord = [
		window.innerWidth/2 - this.background.width/2,
		window.innerHeight/2 + this.background.height/2
	]
	this.viewPort = new ViewPort([
		window.innerWidth * .1,
		window.innerHeight * .2,
		window.innerWidth * .5,
		window.innerHeight *.8
	]);

	this.player = new Player({
		'left': 'left',
		'right': 'right'
	});

	this.map = new Map(20);
}

Game.prototype.init = function(){
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
};

Game.prototype.start = function(){
	var self = this,
		b = this.background,
		ctx = self.context;

	this.player.listenForMovement();
	this.map.assemble([200, 200], 200, {
		'coord': [200, 50],
		'length': 100,
		'thick': 15
	});

	function animate(){
		window.requestAnimFrame(animate);
		var img = self.background;

		ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		var offset = self.viewPort.offset(self.player.mapPos, ctx);
		ctx.drawImage(background, self.bCoord[0] - offset[0], window.innerHeight - (self.bCoord[1] - offset[1]));
		self.map.draw(ctx, offset);
		var floor = self.map.findFloor(self.player.mapPos[0], self.player.mapPos[1], self.player.sprites.left.width * .5)
		console.log("FLOOR:",floor)
		self.player.update(ctx, floor, offset);

		ctx.beginPath();
		ctx.strokeStyle = 'rgba(255,255,255,1)';
		ctx.rect(window.innerWidth * .1, window.innerHeight * .2, window.innerWidth * .4, window.innerHeight * .6);
		ctx.stroke();
		ctx.closePath();
	}

	animate();
};