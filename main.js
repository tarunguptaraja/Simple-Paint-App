var canvas;
var ctx;
var rectangle;
var drag;
var rect;
var toDraw;
var focusedRectangle;


class Rectangle {
    constructor(startX, startY, varX, varY, width, height, color) {
        this.startX = startX;
        this.startY = startY;
        this.varX = varX;
        this.varY = varY;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

var drawRectangle = function (context, x, y, fillcolor, width,height, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext) {
      draw(context, x, y, fillcolor, width,height, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext);
};

var draw = function (context, x, y, fillcolor, width,height, linewidth, strokestyle, fontcolor, textalign, fonttype, filltext) {
    context.beginPath();
    context.rect(x, y, width,height);
    context.fillStyle = fillcolor;
    context.fill();
    context.lineWidth = linewidth;
    context.strokeStyle = strokestyle;
    context.stroke();
};

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    rectangles = [];
    rect={};
    rectangle = {};
    toDraw=true;
    drag = false;
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
}


    init();


var clickCount = 0;

clear = function() {
    clickCount = 0;
    clearTimeout(singleClickTimer);
};

function mouseDown(e) {
    rectangle.startX = e.pageX - this.offsetLeft;
    rectangle.startY = e.pageY - this.offsetTop;
    toDraw=true;
    clickCount++;

    if(clickCount === 1) {
        singleClickTimer = setTimeout(function() {
        clickCount = 0;
    }, 400);

    } else if (clickCount === 2) {
        dblclick(rectangle.startX,rectangle.startY);
        clear();
    }

    var selectedRectangle = selectedRectanglePos(rectangle.startX,rectangle.startY);
    rectangle.color=getRandomColor();
    drag = true;

}


function mouseUp() {

    if(toDraw==true){
        rectangles.push(rect);
    }
    drag = false;
    toDraw=true;
}

function mouseMove(e) {
    if (drag==true && toDraw==true) {
        rectangle.varX = e.pageX - this.offsetLeft;
        rectangle.varY = e.pageY - this.offsetTop;
        rectangle.width = rectangle.varX - rectangle.startX;
        rectangle.height = rectangle.varY - rectangle.startY ;
        rect=new Rectangle(rectangle.startX,rectangle.startY,rectangle.varX,rectangle.varY,rectangle.width,rectangle.height, rectangle.color);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (i = 0; i < rectangles.length; i++) {
            drawIt(rectangles[i],i+1);
        }
        drawIt(rect,i+1);
    }
    if (drag==true && toDraw==false) {
        w = e.pageX - this.offsetLeft - rectangles[focusedRectangle].startX;
        h = e.pageY - this.offsetTop - rectangles[focusedRectangle].startY ;
        rectangles[focusedRectangle].varX = rectangles[focusedRectangle].varX +w;
        rectangles[focusedRectangle].varY = rectangles[focusedRectangle].varY +h;
        rectangles[focusedRectangle].startX = rectangles[focusedRectangle].startX +w;
        rectangles[focusedRectangle].startY = rectangles[focusedRectangle].startY +h;
        

        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (i = 0; i < rectangles.length; i++) {
            drawIt(rectangles[i],i+1);
        }
    }
}

function drawIt(c,pos) {
    drawRectangle(ctx, c.startX, c.startY, c.color, c.width,c.height, 3, "#000000", "white", "center", "bold 32px Arial", pos);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function reset(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    rectangle={};
    rectangles=[];
    rect={};
}
function selectedRectanglePos(xPos,yPos){

    var minDistFromX=999;
    var minDistFromY=999;

    for (i = 0; i < rectangles.length; i++) {
        distFromX=Math.abs(xPos-rectangles[i].startX);
        distFromY=Math.abs(yPos-rectangles[i].startY);

        if(Math.abs(rectangles[i].width)>=distFromX && Math.abs(rectangles[i].height)>=distFromY && minDistFromX>distFromX && minDistFromY>distFromY){
            toDraw=false;
           minDistFromX=distFromX;
            minDistFromY=distFromY;
            focusedRectangle=i;
            return (i+1);
        }

    }
    if(minDistFromX==999 && minDistFromY==999){
        return 0;
    }
}

function dblclick(posX,posY) {
    var selectedRectangle1 = selectedRectanglePos(posX,posY);
    if(selectedRectangle1>=0){
        rectangles.splice((selectedRectangle1-1),1);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (i = 0; i < rectangles.length; i++) {
            drawIt(rectangles[i],i+1);
        }
    }
}