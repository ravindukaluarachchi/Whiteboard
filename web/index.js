var context = document.getElementById('canvas').getContext("2d");
var txt = document.getElementById("txt");
var id = '';
var webSocket;
var coords = new Array();
var color = "black";
var paint;
var lastMessage;

$('#canvas').mousedown(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
});


$('#canvas').mousemove(function (e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    }
});

$('#canvas').mouseup(function (e) {
    paint = false;
});

$('#canvas').mouseleave(function (e) {
    paint = false;
});



function addClick(x, y, dragging)
{
    if (!isNaN(x) && !isNaN(y)) {
        var message = new Message(id, x, y, dragging, color);
        send(JSON.stringify(message));
    }

}


function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (var i = 0; i < coords.length; i++) {
        context.strokeStyle = coords[i].color;
        context.beginPath();
        if (coords[i].dragging && i) {
            context.moveTo(coords[i - 1].x, coords[i - 1].y);
        } else {
            context.moveTo(coords[i].x - 1, coords[i].y);
        }
        context.lineTo(coords[i].x, coords[i].y);
        context.closePath();
        context.stroke();
    }
}


function openSocket() {

    if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
        writeResponse("WebSocket is already opened.");
        return;
    }

    webSocket = new WebSocket("ws://localhost:8084/WhiteBoard/xy");

    webSocket.onopen = function (event) {
    
        if (event.data === undefined)
            return;
        id = event.data;
        writeResponse("connected. sesson :" + event.data);
    };

    webSocket.onmessage = function (event) {
        var message = JSON.parse(event.data);
  
        document.getElementById("ac").innerHTML = coords.length;

        context.lineJoin = "round";
        context.lineWidth = 5;
        context.strokeStyle = message.color;
        
        context.beginPath();
        if (message.dragging && lastMessage) {
            context.moveTo(lastMessage.x, lastMessage.y);
        } else {
            context.moveTo(message.x - 1, message.y);
        }
        context.lineTo(message.x, message.y);
        context.closePath();
        context.stroke();
        lastMessage = message;
    };

    webSocket.onclose = function (event) {
        writeResponse("Connection closed");
    };
}


function send(text) {

    webSocket.send(text);
}

function closeSocket() {
    webSocket.close();
}

function writeResponse(text) {
    document.getElementById("status").innerHTML = text;
}

function changeColor(c) {
    color = c;
    document.getElementById("ctd").style.backgroundColor = c;
}
function Message(id, x, y, dragging, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dragging = dragging;
    this.color = color;
}

function clear() {
    coords = new Array();
    redraw();
}

openSocket();        