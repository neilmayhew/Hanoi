// This function returns the time in seconds since the program started
base_time = 0;
function getTime()
{
	var now = (new Date).getTime();
	if (base_time == 0)
		base_time = now;
	return (now - base_time) / 1000.0;
}

function animate()
{
	var cur_time = getTime();
	var cur_x = leg.start_x + leg.speed_x * (cur_time - leg.start_time);
	var cur_y = leg.start_y + leg.speed_y * (cur_time - leg.start_time);
	if (cur_time >= leg.end_time)
	{
		cur_x = leg.end_x;
		cur_y = leg.end_y;
	}
	leg.element.style.left = Math.round(cur_x) + "px";
	leg.element.style.top  = Math.round(cur_y) + "px";
	if (cur_time >= leg.end_time)
		nextLeg();
}

legs = [];
function nextLeg()
{
	if (legs.length == 0)
		nextMove();
	if (legs.length == 0)
	{
		stop();
		return;
	}
	leg = legs.shift();
	leg.start_time = getTime();
	leg.end_time = leg.start_time + leg.duration;
	leg.start_x = parseInt(leg.element.style.left);
	leg.start_y = parseInt(leg.element.style.top);
	leg.speed_x = (leg.end_x - leg.start_x) / (leg.end_time - leg.start_time);
	leg.speed_y = (leg.end_y - leg.start_y) / (leg.end_time - leg.start_time);
}

function nextMove()
{
	if (moves.length == 0)
		return;

	var move = moves.shift();

	var disk = stacks[move.from].pop();
	stacks[move.to].push(disk);

	var leg;

	// Move up
	leg = new Object;
	leg.element = disk;
	leg.duration = 0.5;
	leg.end_x = poles_mid[move.from] - parseInt(disk.style.width) / 2;
	leg.end_y = poles_top - 50;
	legs.push(leg);

	// Move across
	leg = new Object;
	leg.element = disk;
	leg.duration = 0.5;
	leg.end_x = poles_mid[move.to] - parseInt(disk.style.width) / 2;
	leg.end_y = poles_top - 50;
	legs.push(leg);

	// Move down
	leg = new Object;
	leg.element = disk;
	leg.duration = 0.5;
	leg.end_x = poles_mid[move.to] - parseInt(disk.style.width) / 2;
	leg.end_y = poles_bot - stacks[move.to].length * 20;
	legs.push(leg);
}

function moveStack(n, from, to)
{
	var other = 3 - (from + to);
	
	if (n - 1 > 0) moveStack(n - 1, from, other);

	// Move a disk from => to;
	move = new Object;
	move.from = from;
	move.to = to;
	moves.push(move);

	if (n - 1 > 0) moveStack(n - 1, other, to);
}

function start()
{
	moves = []
	legs = []

	makeStacks();
	moveStack(stacks[0].length, 0, 2);

	nextLeg();
	resume();
}

function resume()
{
	if (!timerID)
		timerID = setInterval(animate, 50);
}
function pause()
{
	if (timerID)
		clearInterval(timerID);
	timerID = 0;
}
function stop()
{
	pause();
}

function makeStacks()
{
	// Todo: any number of disks -- use a loop

	for (var j in stacks)
	{
		var stack = stacks[j];
		for (var i in stack)
		{
			var disk = stack[i];
			disk.parentNode.removeChild(disk);
		}
	}

	stacks = [[], [], []]

	var width = 100;

	var body = document.getElementById("body");

	disk3 = document.createElement("img");
	body.appendChild(disk3);
	stacks[0].push(disk3);
	disk3.id = "disk3";
	disk3.src = "disk.jpg";
	disk3.style.position = "absolute";
	disk3.style.width = width + "px";
	disk3.style.height = 19 + "px";
	disk3.style.left = Math.round(poles_mid[0] - width / 2) + "px";
	disk3.style.top = Math.round(poles_bot - stacks[0].length * 20) + "px";
	width -= 10;

	disk2 = document.createElement("img");
	body.appendChild(disk2);
	stacks[0].push(disk2);
	disk2.id = "disk2";
	disk2.src = "disk.jpg";
	disk2.style.position = "absolute";
	disk2.style.width = width + "px";
	disk2.style.height = 19 + "px";
	disk2.style.left = Math.round(poles_mid[0] - width / 2) + "px";
	disk2.style.top = Math.round(poles_bot - stacks[0].length * 20) + "px";
	width -= 10;

	disk1 = document.createElement("img");
	body.appendChild(disk1);
	stacks[0].push(disk1);
	disk1.id = "disk1";
	disk1.src = "disk.jpg";
	disk1.style.position = "absolute";
	disk1.style.width = width + "px";
	disk1.style.height = 19 + "px";
	disk1.style.left = Math.round(poles_mid[0] - width / 2) + "px";
	disk1.style.top = Math.round(poles_bot - stacks[0].length * 20) + "px";
	width -= 10;
}

function makePoles()
{
	poles_mid = []
	poles_mid.push(150);
	poles_mid.push(350);
	poles_mid.push(550);
	poles_top = 150;
	poles_bot = poles_top + 170;

	var body = document.getElementById("body");

	var pole1 = document.createElement("img");
	pole1.style.position = "absolute";
	pole1.style.width = "20px";
	pole1.style.height = poles_bot - poles_top + "px";
	pole1.style.left = poles_mid[0] - 10 + "px";
	pole1.style.top = poles_top + "px";
	pole1.src = "disk.jpg";
	body.appendChild(pole1);

	var pole2 = document.createElement("img");
	pole2.style.position = "absolute";
	pole2.style.width = "20px";
	pole2.style.height = poles_bot - poles_top + "px";
	pole2.style.left = poles_mid[1] - 10 + "px";
	pole2.style.top = poles_top + "px";
	pole2.src = "disk.jpg";
	body.appendChild(pole2);

	var pole3 = document.createElement("img");
	pole3.style.position = "absolute";
	pole3.style.width = "20px";
	pole3.style.height = poles_bot - poles_top + "px";
	pole3.style.left = poles_mid[2] - 10 + "px";
	pole3.style.top = poles_top + "px";
	pole3.src = "disk.jpg";
	body.appendChild(pole3);

	var base = document.createElement("img");
	base.style.position = "absolute";
	base.style.height = "20px";
	base.style.left = poles_mid[0] - 70 + "px";
	base.style.width = poles_mid[2] - poles_mid[0] + 140 + "px";
	base.style.top = poles_bot + "px";
	base.src = "disk.jpg";
	body.appendChild(base);
}

function init()
{
	stacks = []
	timerID = 0;

	makePoles();
	makeStacks();
}

window.onload = init;
