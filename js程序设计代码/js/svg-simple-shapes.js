var svgns = "http://www.w3.org/2000/svg";

var svg = document.createElementNS(svgns, "svg");
svg.setAttribute("version", "1.1");
svg.setAttribute("width", 256);
svg.setAttribute("height", 256);
svg.setAttribute("viewBox", "0 0 256 256");

var shape = document.createElementNS(svgns, "rect");
shape.setAttribute("x", 45);
shape.setAttribute("y", 32);
shape.setAttribute("width", 100);
shape.setAttribute("height", 60);
shape.setAttribute("rx", 10);
shape.setAttribute("ry", 5);
svg.appendChild(shape);

shape = document.createElementNS(svgns, "circle");
shape.setAttribute("cx", 45);
shape.setAttribute("cy", 122);
shape.setAttribute("r", 20);
svg.appendChild(shape);

shape = document.createElementNS(svgns, "ellipse");
shape.setAttribute("cx", 145);
shape.setAttribute("cy", 122);
shape.setAttribute("rx", 40);
shape.setAttribute("ry", 20);
svg.appendChild(shape);

shape = document.createElementNS(svgns, "line");
shape.setAttribute("x1", 67);
shape.setAttribute("y1", 142);
shape.setAttribute("x2", 103);
shape.setAttribute("y2", 102);
shape.setAttribute("stroke", "black");
svg.appendChild(shape);

document.body.appendChild(svg);
