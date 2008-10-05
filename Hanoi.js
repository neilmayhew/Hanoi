/*
 *	Hanoi.js
 *
 *	Animate the Towers of Hanoi game
 *
 *	Neil & Dominic Mayhew - 2006-09-11
 *
 *	$Id$
 */

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
	if (legs.length == 0)
	{
		nextMove();
		leg_start_time = getTime();
	}
	if (legs.length == 0)
	{
		stop();
		return;
	}

	var leg = legs[0];

	var t = (getTime() - leg_start_time) / leg.duration;
	if (t > 1.0)
		t = 1.0;

	var cur_x = leg.start_x * (1 - t) + leg.end_x * t;
	var cur_y = leg.start_y * (1 - t) + leg.end_y * t;

	leg.element.style.left = Math.round(cur_x) + "px";
	leg.element.style.top  = Math.round(cur_y) + "px";

	if (t == 1.0)
	{
		legs.shift();
		leg_start_time = getTime();
	}
}

function makeLeg(element, start_x, start_y, end_x, end_y)
{
	var pixelSpeed = 400.0 * speed; // pixels/sec

	var duration_x = Math.abs(end_x - start_x) / pixelSpeed;
	var duration_y = Math.abs(end_y - start_y) / pixelSpeed;
	var duration = Math.max(duration_x, duration_y);

	var leg = new Object;
	leg.element = element;
	leg.start_x = start_x;
	leg.start_y = start_y;
	leg.end_x = end_x;
	leg.end_y = end_y;
	leg.duration = duration;

	return leg;
}

function nextMove()
{
	if (moves.length == 0)
	{
		window.status = "Finished";
		return;
	}

	window.status = moves.length + " moves remaining";

	var move = moves.shift();
	var disk = stacks[move.from].pop();
	stacks[move.to].push(disk);

	var start_x;
	var start_y;
	var end_x;
	var end_y;

	// Move up
	start_x = parseInt(disk.style.left);
	start_y = parseInt(disk.style.top);
	end_x = poles_mid[move.from] - parseInt(disk.style.width) / 2;
	end_y = poles_top - 50;
	legs.push(makeLeg(disk, start_x, start_y, end_x, end_y));

	// Move across
	start_x = end_x;
	start_y = end_y;
	end_x = poles_mid[move.to] - parseInt(disk.style.width) / 2;
	end_y = poles_top - 50;
	legs.push(makeLeg(disk, start_x, start_y, end_x, end_y));

	// Move down
	start_x = end_x;
	start_y = end_y;
	end_x = poles_mid[move.to] - parseInt(disk.style.width) / 2;
	end_y = poles_bot - stacks[move.to].length * 20;
	legs.push(makeLeg(disk, start_x, start_y, end_x, end_y));
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

function reset()
{
	moves = []
	legs = []
	leg_start_time = 0;

	makeStacks();
	moveStack(stacks[0].length, 0, 2);
}

function start()
{
	if (!timerID)
	{
		timerID = setInterval(animate, 50);
		leg_start_time += getTime();
	}
}
function stop()
{
	if (timerID)
	{
		clearInterval(timerID);
		leg_start_time -= getTime();
	}
	timerID = 0;
}

function setNumber()
{
	nDisks = parseInt(document.getElementById("number").value);
	reset();
}

function setSpeed()
{
	speed = parseFloat(document.getElementById("speed").value);
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

	var body = document.getElementById("body");

	var width = 190;

	for (var i = 0; i < nDisks && width > 20; i++)
	{
		var disk = document.createElement("img");
		body.appendChild(disk);
		stacks[0].push(disk);
		disk.src = "disk.jpg";
		disk.style.position = "absolute";
		disk.style.width = width + "px";
		disk.style.height = 19 + "px";
		disk.style.left = Math.round(poles_mid[0] - width / 2) + "px";
		disk.style.top = Math.round(poles_bot - stacks[0].length * 20) + "px";
		width -= 10;
	}
}

function makePoles()
{
	poles_mid = []
	poles_mid.push(150);
	poles_mid.push(350);
	poles_mid.push(550);
	poles_top = 150;
	poles_bot = poles_top + 20 * 13;

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
	base.style.left = poles_mid[0] - 100 + "px";
	base.style.width = poles_mid[2] - poles_mid[0] + 200 + "px";
	base.style.top = poles_bot + "px";
	base.src = "disk.jpg";
	body.appendChild(base);
}

function init()
{
	stacks = []
	timerID = 0;

	makePoles();

	setSpeed();
	setNumber();
}

window.onload = init;
