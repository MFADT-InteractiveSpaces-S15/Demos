var sb, 
	app_name = "randomizer_client_"
	;

function setup (){
	// randomize app name
	var random_id = "0000" + Math.floor(Math.random() * 10000);
	app_name = app_name + ' ' + random_id.substring(random_id.length-4);

	// setup spacebrew
	sb = new Spacebrew.Client("spacebrew.robotconscience.com");  // create spacebrew client object

	sb.name(app_name);

    // create the spacebrew subscription channels
	sb.addPublish("register", "string", "");
	sb.addSubscribe("group", "json");
	sb.addSubscribe("random", "boolean");

	// configure the publication and subscription feeds
	sb.onStringMessage = onStringMessage;		
	sb.onCustomMessage = onCustomMessage;				
	sb.onBooleanMessage = onBooleanMessage;
	sb.onOpen = onOpen;

	// connect to spacebrew
	sb.connect();  

	var b = document.getElementById("submit");
	b.onmousedown = submitName;
}

var input,
	name;

function onOpen(){
	// create form
	input = document.getElementById("input");
	input.style.visibility = "visible";
	input.style.opacity = "1";
}

function submitName(){
	input = document.getElementById("input");
	input.style.opacity = "0";
	name = document.getElementById("name").value;
	window.setTimeout(function(){ input.style.visibility="hidden";}, 500);

	sb.send("register", "string", name);
}

function onStringMessage( name, value ){

}

var t = null;
var interval = null;
var timeout = null

function onBooleanMessage( name, value){
	window.clearInterval(interval);
	window.clearTimeout(timeout);
	if ( value == true ){
		timeout = setTimeout( function(){
			interval = setInterval(flipBackground, 200);
		}, 10 + Math.random() * 1000)
		
	}
}

var black = true;

function flipBackground(){
	black = !black;
	document.body.style.backgroundColor = black ? "black" : "white";
}

function onCustomMessage( routeName, value ){
	console.log( value );
	value = JSON.parse(value);
	document.body.style.backgroundColor = value[name].color;

	if ( t != null ){
		clearTimeout(t);
		window.clearTimeout(timeout);
	}
	t = window.setTimeout( function(){
		document.getElementById("container").innerHTML = "<strong>GROUP " + value[name].group + "</strong><br/>"+ value[name].place;
	}, 500);
}

window.onload = function(){
	setup();
}

window.onresize = function(){
	document.getElementById("input").style.fontSize = window.innerHeight/8 +"px";
	document.getElementById("container").style.fontSize = window.innerHeight/10 +"px";
}



