var Game = function(canvasID, background){
	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext('2d');
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
	this.background = new Background('cloud');
	this.score = 0;
}

Game.prototype.init = function(){
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	generateScore();
};

Game.prototype.start = function(){
	var self = this,
		ctx = self.context;

	this.player.listenForMovement();
	this.map.assemble([200, 300], 300, {
		'coord': [300, 50],
		'length': 100,
		'thick': 12
	});
	this.background.assemble();

	function animate(){
		window.requestAnimFrame(animate);
		var img = self.background;

		ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		var offset = self.viewPort.offset(self.player.mapPos, ctx, self.player.jump.velocity == self.player.jump.rate);
		self.background.draw(ctx, offset);
		self.map.draw(ctx, offset);

		var collide = self.map.checkCollide(self.player.mapPos, self.player.sprites.left.width * .5, self.player.sprites.left.height * .5);

		if (collide && collide == 'defeat'){
			self.player.forceJump();
		}else if (collide && collide == 'kill'){
			self.reset();
		}

		var floor = self.map.findFloor(self.player.mapPos[0], self.player.mapPos[1], self.player.sprites.left.width * .5);
		if (floor && 'g' in floor && floor.g){
			self.reset();
		}else{
			var score = self.player.update(ctx, floor, offset);
			self.updateScore(score);
		}
	}

	animate();
};

Game.prototype.reset = function(){
	var p = this.map.platforms[this.score].coord;
	this.player.mapPos = [p[0], p[1] + 600];
}

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