var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//
// Transforms
//

// center x, center y, world width, fit/fill screen and world
function Transform(cx, cy, size, fit) {
	this.cx = cx;
	this.cy = cy;
	this.radius = size / 2;
	this.fit = fit;
}
Transform.prototype.update = function(canvas) {
	if (!this.vals) this.vals = {};

	var relw = 1;
	var relh = 1;
	relh = canvas.height / canvas.width;
	if (this.fit != relh > 1) {
		relw = 1 / relh;
		relh = 1;
	}

	this.vals.minx = this.cx - this.radius * relw;
	this.vals.maxx = this.cx + this.radius * relw;
	this.vals.miny = this.cy - this.radius * relh;
	this.vals.maxy = this.cy + this.radius * relh;

	this.vals.scalex = canvas.width / (this.vals.maxx - this.vals.minx);
	this.vals.scaley = canvas.height / (this.vals.maxy - this.vals.miny);
}
Transform.prototype.applyToCanvas = function(ctx) {
	ctx.scale(this.vals.scalex, this.vals.scaley);
	ctx.translate(-this.vals.minx, -this.vals.miny);
}
Transform.prototype.fromScreen = function(sx, sy) {
	sx /= this.vals.scalex;
	sy /= this.vals.scaley;
	sx += this.vals.minx;
	sy += this.vals.miny;
	return {
		x: sx,
		y: sy
	}
}

//
//End
//

var t = new Transform(50, 50, 110, true);
var mouseX = 0;
var mouseY = 0;

ctx.save();

function resizeCanvas() {
	t.update(canvas);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	draw();
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

// Start code

function clear() {
	ctx.restore();
	ctx.save();
	t.applyToCanvas(ctx);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
	clear();
	for (var x = 0; x < 100; x += 10) {
		for (var y = 0; y < 100; y += 10) {
			
			if ((Math.floor(mouseX / 10) * 10) == x && y == (Math.floor(mouseY / 10) * 10)) ctx.fillStyle = "#08476D";
			else ctx.fillStyle = "#2B2B2C";
			ctx.fillRect(x, y, 9.8, 9.8);
		}
	}

}

function mouseDetector(event) {
	var sx = event.clientX;     // Get the horizontal coordinate
	var sy = event.clientY;     // Get the vertical coordinate
	var p = t.fromScreen(sx, sy);
	mouseX = p.x;
	mouseY = p.y; 
	draw();
}