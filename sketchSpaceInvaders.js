let ship;
let aliens = [];

function preload(){
	alien1a = loadImage('img/alien1a.png');
	alien1b = loadImage('img/alien1b.png');
	alien2a = loadImage('img/alien2a.png');
	alien2b = loadImage('img/alien2b.png');
}

function setup(){
	createCanvas(600,400);
	frameRate(10);
	imageMode(CENTER);
	ship = new Ship();

	let startX = 80;
	let startY = 80;
	for (var i = 0; i < 6; i++){
		aliens[i] = new Alien(i * startX + 80, startY, alien1a, alien1b, 5);
	}
	startY = 40;
	let offset = 0;
	for (var j = 6; j < 12; j++){
		aliens[j] = new Alien(offset * startX + 80, startY, alien2a, alien2b, 10);
		offset++;
	}
}

function draw(){
	background(220)
	ship.show();
	ship.move();
}
//key event handlers
function keyReleased(){
	ship.setDir(0);
}

function keyPressed(){
	if (keyCode === RIGHT_ARROW){
		ship.setDir(1);
	} else if (keyCode === LEFT_ARROW){
		ship.setDir(-1);
	}
}