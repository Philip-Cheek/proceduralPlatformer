var Menu = function(config){
	this.start = document.getElementById(config.start);
	this.setStart(config.button);
}


Menu.prototype.showStart = function(){
	var colorBank = ['26,188,156', '46,204,113', '52,152,219',
		'155,89,182', '52,73,94', '22,160,133', '39,174,96',
		'41,128,185', '142,68,173','44,62,80','241,196,15',
		'230,126,34','231,76,60','243,156,18','211,84,0',
		'192,57,43'], 
		cIdx = Math.floor(Math.random() * colorBank.length);
		color = 'rgba(' + colorBank[cIdx] + ',0.5)',

	this.start.style.background = color;
	this.start.style.display = 'initial';
}

Menu.prototype.setStart = function(button){
	var hide = document.getElementById(button),
		start = this.start;

	hide.onclick = function(){
		start.style.display = "none";
	}

}

function createLose(){
	var p = document.createElement('p');
		style = 'position:absolute;'

	p.id = 'lose';
	style += "top: 40%; left:40%;";
	style += 'font-size: 2em;';
	p.style.cssText = style;
	p.innerHTML = "YOU LOSE";
	p.style.display = 'none';
	p.style.opacity = 0;
	document.body.append(p);
}
