onload = function () {
    var canvas = document.getElementById("canvas");
    if (!canvas.getContext) {
        alert("Your browser doesn't support canvas drawing");
        return;
    }
    var ctx = canvas.getContext("2d");

    var x = 100, y = 140, dx = 3, dy = 2;
    var ballColor = "rgba(255, 0, 0, 0.2)";
    var grad = ctx.createLinearGradient(0,0,canvas.width, canvas.height);
    grad.addColorStop(0, '#00f');
    grad.addColorStop(1, '#f4f0d9');

    var drawBackground = function () {
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    var drawBall = function () {
        ctx.fillStyle = ballColor;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        x += dx;
        y += dy;
        if (x < 10) {x = 10; dx = -dx;}
        if (y < 10) {y = 10; dy = -dy;}
        if (x > canvas.width -10- dx) {x = canvas.width -10- dx; dx = -dx;}
        if (y > canvas.height -10- dy) {y = canvas.height -10- dy; dy = -dy;}
    }

    var drawFrame = function () {
        drawBackground();
        drawBall();
    }

    setInterval(drawFrame, 30);
}