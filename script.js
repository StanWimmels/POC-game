var myGamePiece;
var myRoof;
var myObstacles = [];
var myScore;
var myLeft;
var myRight;

function startGame() {
    myGameArea.start();
    myGamePiece = new component(40, 40, "blue", 640, 200);
    myRoof = new component(1280, 10, "red", 0, 0);
    myLeft = new component(10, 720, "red", 0, 0);
    myRight = new component(10, 720, "red", 0, 0);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 1;
    this.gravitySpeed = 0;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.collideWith(myObstacles[i])) {
                this.gravity = 0;
                this.gravitySpeed = 0;
                this.y -= 1;
            }
            else {
                this.gravity = 0.05;
                this.y += this.speedY + this.gravitySpeed;
            }
        }
        this.hitBottom();
    }
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        var leftbottom = 0;
        var rightbottom = myGameArea.canvas.width - this.width;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
        else if (this.x > rightbottom) {
            this.x = rightbottom;
        }
        else if (this.x <= leftbottom) {
            this.x = leftbottom;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.collideWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
function updateGameArea() {
    var x, width, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myRoof)) {
            myGameArea.stop();
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(70)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 1180;
        width = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 70;
        maxGap = 240;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(width, 10, "green", 0, 720));
        myObstacles.push(new component(x - width - gap, 10, "green", width + gap, 720));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += -1;
        myObstacles[i].update();
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -5; }
    if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 5; }
    myRoof.update();
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.update();
    myGamePiece.newPos();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}


