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
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	t.update(canvas);
	ctx.restore();
	ctx.save();
	t.applyToCanvas(ctx);
	clear();
	draw();
}
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

// Start code

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function randColor(X, Y, t) {
	var m = 5664;
	var v = ((X * 545425) ^ (Y * 85675)) % m;
	v /= m;
	return .5 + .5 * Math.cos(v * Math.PI * 2 + t);
	//var dx = (X - mouseX);
	//var dy = (Y - mouseY);
	//var r = .5 + .43 * Math.cos(Math.sqrt(dx * dx + dy * dy) / 10);
	//console.log(x, y, r);
	//return r;
}

function scaleColor(s, r0, g0, b0, r1, g1, b1) {
	if (s < 0) s = 0;
	if (s > 1) s = 1;
	//var r = (s * (r1 - r0) + r0) & 0xFF;
	//var g = (s * (g1 - g0) + g0) & 0xFF;
	//var b = (s * (b1 - b0) + b0) & 0xFF;
	var r = (s * 255) & 0xFF;
	var g = (s * 255) & 0xFF;
	var b = (s * 255) & 0xFF;
	return (r << 16) | (g << 8) | b;
}

var age = 0;

function draw() {
	clear();
	for (var xloc = 0; xloc < 100; xloc += 10) {
		for (var yloc = 0; yloc < 100; yloc += 10) {
			//if ((Math.floor(mouseX / 10) * 10) == x && y == (Math.floor(mouseY / 10) * 10)) ctx.fillStyle = "#08476D";
			//else ctx.fillStyle = "#2B2B2C";
			ctx.fillStyle = "#" + scaleColor(randColor(xloc, yloc, age * .1), 0x2B, 0x2B, 0x2C, 0x08, 0x47, 0x6D).toString(16);
			ctx.fillRect(xloc, yloc, 10.1, 10.1);
		}
	}
}

function mouseDetector(event) {
	var sx = event.clientX;     // Get the horizontal coordinate
	var sy = event.clientY;     // Get the vertical coordinate
	var p = t.fromScreen(sx, sy);
	mouseX = p.x;
	mouseY = p.y; 
	//draw();
}

function tick() {
	age++;
	draw();
}

var tickID = window.setInterval(tick, 100);