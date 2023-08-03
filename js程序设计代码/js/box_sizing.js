onload = function () {
  var size = 10;
  var style = document.getElementById("box").style;
    style.border = "4px solid black";
    style.position = "absolute";
    style.left = "20px";
    style.right = "20px";
    var delta = 1;
    var resizeBox = function () {
      size += delta;
      if (size > 100) delta = -1;
      if (size < 10) delta = 1;
      style.width = size + "px";
      style.height = size + "px";
  }
  setInterval(resizeBox, 50);
}

