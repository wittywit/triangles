var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  W = window.innerWidth,
  H = window.innerHeight;

canvas.width = W;
canvas.height = H;

//helps prevent skewing and canvas resizing
window.onresize = function(event) {
  W = window.innerWidth,
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}
  
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('mousemove', onMouseStop, false);
canvas.addEventListener("touchmove", onTouch, true);
canvas.addEventListener('touchmove', onMouseStop, false);

var shapes = [];

var mouse = {},
    mouseMove = true,
    mouseStop = true,
    hasStopped = false,
    hasChanged = false;

var timeout;

var rePaint = function() {
  var grdBg = ctx.createLinearGradient(0, 0, W, H);
  grdBg.addColorStop(0, 'rgba(247, 81, 135, 0.6)'); //gradient
  grdBg.addColorStop(1, 'rgba(248, 251, 167, 0.6)');//gradient
  ctx.fillStyle = grdBg;
  ctx.fillRect(0, 0, W, H);
}

function Shape() {
  this.x;
  this.y;
  this.radius = 3;
  this.randNum;

  this.randPos = function() {
    var randi = Math.floor(Math.random() * 100 + 1);
    return randi;
  };

  this.randColor = function() {
    var color = Math.floor(Math.random() * 255 + 1);
    return color;
  };

  this.placeTriangle = function() {
    ctx.moveTo(this.x + this.randPos(), this.y + this.randPos());
    ctx.lineTo(this.x + this.randPos(), this.y + this.randPos());
    ctx.lineTo(this.x + this.randPos(), this.y + this.randPos());    
  };

  this.triangle = function(option) {
      var grd = ctx.createLinearGradient(0, 10, W, H);

      //solid / gradient
      ctx.beginPath();
      this.placeTriangle();
      ctx.shadowBlur = 15;
      grd.addColorStop(0, '#3ea1ab');
      grd.addColorStop(0.50, '#e1acaa');  
      grd.addColorStop(1, '#456085');
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.shadowColor="yellow"; //the background color
      ctx.shadowBlur = 10;
      ctx.closePath();

      //stroked
      ctx.beginPath();
      this.placeTriangle();
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      //solid white
      ctx.beginPath();
      this.placeTriangle();
      grd = ctx.createLinearGradient(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
  };

  this.draw = function() {
    this.triangle()
  };
};

var update = function () {
  rePaint();
  shapes.push(new Shape());

  for(i=0; i<shapes.length; i++) {
        //first item
        s1 = shapes[i];

        //second item
        s2 = shapes[i - 1];

    //attach Shape to mouse
    if(mouse.x && mouse.y) {
      shapes[shapes.length - 1].x = mouse.x;
      shapes[shapes.length - 1].y = mouse.y;
      s1.draw();
    }

    //velocity 
    if(i > 0) {
      s2.x += (s1.x - s2.x) * 0.7;
      s2.y += (s1.y - s2.y) * 0.7;
    }
    
    if(hasStopped) {
      shapes.pop();
    }     
  }

  //remove from array
  if (shapes.length > 8) {
    shapes.pop();
  }
};

//check mouse movement
function onMouseMove(e) {
  hasStopped = false;
  hasChanged = true;  
  mouse.x = e.pageX - 50;
  mouse.y = e.pageY - 50;
};

function onTouch(e) {
  hasStopped = false;
  hasChanged = true; 
  e.preventDefault();
  mouse.x = e.targetTouches[0].pageX - 50;
  mouse.y = e.targetTouches[0].pageY - 50;
};

var stopped = function() {
  hasChanged = false;
  hasStopped = true;
};

function onMouseStop() {
  clearTimeout(timeout);
  timeout = setTimeout( stopped , 50);
};

//loop
var interval = setInterval(update, 100);
