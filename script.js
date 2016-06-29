var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	draw();
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

// Start code

var w = 100;
var h = 100;

function setTransform(cx, cy, size, fit) {
	var relw = 1;
	var relh = 1;
	relh = canvas.height / canvas.width;
	if (fit != relh > 1) {
		relw = 1 / relh;
		relh = 1;
	}
	size /= 2;
	var minx = cx - size * relw;
	var maxx = cx + size * relw;
	var miny = cy - size * relh;
	var maxy = cy + size * relh;

	var scalex = canvas.width / (maxx - minx);
	var scaley = canvas.height / (maxy - miny);

	ctx.scale(scalex, scaley);
	ctx.translate(-minx, -miny);
}

function draw() {
	setTransform(50, 50, 110, true);
	for (var x = 0; x < 100; x += 10) {
		for (var y = 0; y <= x; y += 10) {
			
			if (((x + y) / 10) % 2 == 0) ctx.fillStyle = "#08476D";
			else ctx.fillStyle = "#2B2B2C";
			ctx.fillRect(x, y, 9.8, 9.8);
		}
	}

}