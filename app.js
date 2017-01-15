window.onload = function(){
	var game = new Game('canvas', 'background');
	game.init();
	game.start();
	// console.log('what?!')
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
          	window.setTimeout(callback, 1000 / 60);
          };
})();