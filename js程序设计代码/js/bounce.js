// A script that bounces a little rectangle around a webpage.

var Box = function (width, height) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.dx = 3;
    this.dy = 2;
    this.div = document.createElement("div");
    this.div.style.width = width + "px";
    this.div.style.height = height + "px";
    this.div.style.border = "4px solid black";
    this.div.style.position = "absolute";
    this.div.style.left = this.x + "px";
    this.div.style.top = this.y + "px";
    document.body.appendChild(this.div);
}

Box.prototype.move = function () {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0) {this.x = 0; this.dx = -this.dx;}
    if (this.x > window.innerWidth) {this.x = window.innerWidth - this.width; this.dx = -this.dx;}
    if (this.y < 0) {this.y = 0; this.dy = -this.dy;}
    if (this.y > window.innerHeight) {this.y = window.innerHeight - this.height; this.dy = -this.dy;}
    this.div.style.left = this.x + "px";
    this.div.style.top = this.y + "px";
}

onload = function () {
    var b = new Box(25, 30);
    setInterval((function () {b.move();}), 50);
}
