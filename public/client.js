document.addEventListener('DOMContentLoaded', function () {
  var mouse = {
    click: false,
    move: false,
    pos: { x: 0, y: 0 },
    pos_prev: false,
  };

  var canvas = document.getElementById('drawing');
  var context = canvas.getContext('2d');
  var width = window.innerWidth;
  var height = window.innerHeight;
  var socket = io.connect();

  canvas.width = width;
  canvas.height = height;

  canvas.onmousedown = function (e) {
    mouse.click = true;
  };
  canvas.onmouseup = function (e) {
    mouse.click = false;
  };

  canvas.onmousemove = function (e) {
    mouse.pos.x = e.clientX / width;
    mouse.pos.y = e.clientY / height;
    mouse.move = true;
  };

  socket.on('draw_line', function (data) {
    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 3;
    var line = data.line;
    context.beginPath();
    context.moveTo(line[0].x * width, line[0].y * height);
    context.lineTo(line[1].x * width, line[1].y * height);
    context.stroke();
  });

  function mainLoop() {
    if (mouse.click && mouse.move && mouse.pos_prev) {
      socket.emit('draw_line', {
        line: [mouse.pos, mouse.pos_prev],
      });
      mouse.move = false;
    }
    console.log(context);
    mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
    setTimeout(mainLoop, 25);
  }
  mainLoop();
});
dragElement(document.getElementById('mydiv'));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + 'header')) {
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
