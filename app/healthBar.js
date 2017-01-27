var HealthBar = function(source){
	this.health = 0;
	this.bar = createBar();
	this.source = source;
}

HealthBar.prototype.newHealth = function(){
	this.health += 1;

	var html = "<img class = 'h' style = 'width:2em;' src = '";
		html += this.source + "'>";

	this.bar.innerHTML += html;

	if (this.health > 0 && this.health % 7 == 0){
		this.bar.innerHTML += "<br>";
		this.rows += 1;
	}
}

HealthBar.prototype.removeHealth = function(){
	if (this.health > 0){
		this.health -= 1;

		var hearts = document.getElementsByClassName("h"),
	        h = hearts[hearts.length - 1]

	    this.bar.removeChild(h);

	    if ((this.health + 1) % 7 == 0){
	    	var br = this.bar.lastElementChild;
	    	this.bar.removeChild(br);
	    }
	}
}

function createBar(){
	var div = document.createElement('div');
		style = "position:absolute;";

	div.id = 'bar';
	style += "top: 1em; right:1em;"
	div.style.cssText = style;
	document.body.append(div);

	return document.getElementById('bar');
}



