window.onload = function(){
	setup();
}

// Global vars

var sb,
	container;

var classList = [];
var classDivs = {};
var groupsize = 3;

var possible_assignments = [
	"Chelsea Market",
	"Time warner lobby",
	"Ace Hotel Lobby",
	"NY Public Library",
	"Lincoln Center Plaza",
	"High Line Park",
	"Grand Central - Main hall",
	"Staten Island Ferry Terminal"
];

function setup(){
	//todo: manual input of spaces
	if ( getQueryString("assignments") !== "" ){
	}

	// setup spacebrew
	// 
	sb = new Spacebrew.Client("spacebrew.robotconscience.com");
	  // create spacebrew client object

	sb.name("randomizer_master");

    // create the spacebrew subscription channels
	sb.addPublish("group", "json", "");
	sb.addPublish("random", "boolean", "");
	sb.addSubscribe("register", "string");

	// configure the publication and subscription feeds
	sb.onStringMessage = onStringMessage;		
	sb.onOpen = onOpen;

	// connect to spacbrew
	sb.connect();  

	container = document.getElementById("container");

	var b = document.getElementById("submit");
	b.onmousedown = randomize;
}

function onOpen(){

}

function onStringMessage( name, value ){
	if ( name == "register" ){
		addStudent(value);
	}
}

var divWidth = 200 + 30; // width + padding
var divTop = 60; // width + padding
var divHeight = 100 + 30; // width + padding
var margin = 10;
var randomized = false;

function addStudent( name ){
	var width = window.innerWidth;

	var div = document.createElement("div");
	div.className = "student";
	div.innerHTML = name;
	
	container.appendChild(div);

	classDivs[name] = {};
	classDivs[name].div = div;
	classList.push(name);

	window.onresize();
}

// from here: http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}


function getRandomNumberInt(max){
	return Math.floor(Math.random()*max);
}

function getRandomColor(max){
	var r = getRandomNumberInt(max)
	var g = getRandomNumberInt(max);
	var b = getRandomNumberInt(max);
	var css = "rgb("+r+","+g+","+b+")"
	return css;
}

var attempts = 0;

function randomize(){
	console.log('tes')

	sb.send("random", "boolean", "true");

	attempts = 0;
	shuffleList();

}

function shuffleList(){
	classList = shuffle(classList);
	possible_assignments = shuffle(possible_assignments);
	window.onresize();
	var sendDivs = {};

	for ( var i=0; i<classList.length; i+=groupsize){
		var color = getRandomColor(200);
		var group = i/groupsize;
		for ( var j=0; j<groupsize; j++){
			if ( i + j >= classList.length) break;
			var div = classDivs[classList[i+j]].div;
			div.innerHTML = "<strong>GROUP "+(1+group)+"</strong><br />" + possible_assignments[group] + "<br />" +classList[i+j];
			div.style.backgroundColor = color;
			div.style.color = "#fff";

			sendDivs[classList[i+j]] = {};
			sendDivs[classList[i+j]].group = 1+group;
			sendDivs[classList[i+j]].color = color;
			sendDivs[classList[i+j]].place = possible_assignments[group];
		}
	}

	attempts++;
	if ( attempts < 10){
		window.setTimeout( shuffleList, 250);
	} else {
		sb.send("random", "boolean", "false");
		sb.send("group", "json", JSON.stringify(sendDivs));
	}
}


window.onresize = function(){
	if ( randomized ) return;

	var width = window.innerWidth;
	var tx = margin;
	var ty = divTop;

	for ( var i=0; i<classList.length; i++){
		var div = classDivs[classList[i]].div;
		div.style.left = tx + "px";
		div.style.top = ty + "px";

		tx += divWidth;
		if ( tx + divWidth >= width ){
			ty += divHeight;
			tx = margin;
		}
	}
}


