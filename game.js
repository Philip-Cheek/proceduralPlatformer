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
		window.innerHeight *.6
	]);

	this.player = new Player({
		'left': 'left',
		'right': 'right'
	});

	this.map = new Map(20);
	this.score = 0;
}

Game.prototype.init = function(){
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	generateScore();
};

Game.prototype.start = function(){
	var self = this,
		b = this.background,
		ctx = self.context;

	this.player.listenForMovement();
	this.map.assemble([300, 400], 200, {
		'coord': [300, 50],
		'length': 100,
		'thick': 15
	});

	function animate(){
		window.requestAnimFrame(animate);
		var img = self.background;

		ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		var offset = self.viewPort.offset(self.player.mapPos, ctx, self.player.jump.velocity == self.player.jump.rate);
		ctx.drawImage(background, self.bCoord[0] - offset[0], window.innerHeight - (self.bCoord[1] - offset[1]));
		self.map.draw(ctx, offset);
		var floor = self.map.findFloor(self.player.mapPos[0], self.player.mapPos[1], self.player.sprites.left.width * .5),
			score = self.player.update(ctx, floor, offset);

		self.updateScore(score);
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(255,255,255,1)';
		ctx.rect(window.innerWidth * .1, window.innerHeight * .2, window.innerWidth * .4, window.innerHeight * .6);
		ctx.stroke();
		ctx.closePath();
	}

	animate();
};

Game.prototype.updateScore =function updateScore(score){
	if (score && score > this.score){
		var sBoard= document.getElementById('score');
		sBoard.innerHTML = "<h1>Score: " + score.toString() + "</h1>";
		this.score = score;
	}
}

function generateScore(){
	var div = document.createElement('div');
		style = "position:absolute;";

	div.id = 'score';
	style += "top: 10%; left:10%"
	div.style.cssText = style;
	div.innerHTML = "<h1>Score: 0</h1>"
	document.body.append(div);
}