var Game = function(canvasID, background){
	this.canvas = document.getElementById(canvasID);
	this.context = this.canvas.getContext('2d');
	this.viewPort = new ViewPort([
		window.innerWidth * .1,
		window.innerHeight * .18,
		window.innerWidth * .5,
		window.innerHeight *.6
	]);

	this.player = new Player({
		'left': 'left',
		'right': 'right',
		'crouch': 'crouch',
		'jumpRight': 'jumpRight',
		'jumpLeft': 'jumpLeft'
	});

	this.scale = 1;
	this.map = new Map(20);
	this.background = new Background('cloud');
	this.score = 0;
	this.healthBar = new HealthBar('assets/heart.png');
	this.menu = new Menu({
		'start': 'tutorial',
		'button': 'close'
	})
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
	this.menu.showStart();
	this.map.assemble([120, 190], 300, {
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
		self.background.draw(ctx, offset, self.scale);
		self.map.draw(ctx, offset, self.scale);
		self.determineUpdate(ctx, offset, self.scale);
	};

	animate();
};

Game.prototype.determineUpdate = function(ctx, offset){
	var dimen = this.player.dimen();
		w = dimen.w, h = dimen.h, 
		pos = [this.player.mapPos[0], this.player.mapPos[1]],
		collide = this.map.collide(pos, w, h),
		min = collide.min, incident = collide.incident,
		floor = collide.floor, health = collide.health;

	if (health){
		this.healthBar.newHealth();
	}

	if (incident && incident == 'defeat'){
		this.player.forceJump();
		this.quickScale();
	}else if (incident && incident == 'kill'){
		this.setBack();
	}


	var score = this.player.update(ctx, floor, offset);
	this.updateScore(score);
}

Game.prototype.quickScale = function(){
	// var rate = .1 * (8 - (1 - this.scale));
	// if this.quickScale = 8
}
Game.prototype.setBack = function(){
	var index = Math.floor(this.score * .8);
		setBack = this.map.setBack(index);

	this.healthBar.removeHealth();
	this.player.mapPos = setBack.coord;
	this.viewPort.setBack(this.player.mapPos);
	setBack.callback();
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