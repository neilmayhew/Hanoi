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

timerID = 0;
function resume()
{
	timerID = setInterval(animate, 50);
}
function pause()
{
	clearInterval(timerID);
}
function stop()
{
	pause();
}

function makeStacks()
{
	// Todo: any number of disks -- use a loop

	body = document.getElementById("body");
	disk1 = document.getElementById("disk1");
	disk2 = document.getElementById("disk2");
	disk3 = document.getElementById("disk3");
	if (disk1) body.removeChild(disk1);
	if (disk2) body.removeChild(disk2);
	if (disk3) body.removeChild(disk3);

	stacks = [[], [], []]

	disk3 = document.createElement("img");
	body.appendChild(disk3);
	stacks[0].push(disk3);
	disk3.id = "disk3";
	disk3.src = "disk.jpg";
	disk3.style.position = "absolute";
	disk3.style.width = 100 + "px";
	disk3.style.height = 19 + "px";
	disk3.style.left = Math.round(poles_mid[0] - parseInt(disk3.style.width) / 2) + "px";
	disk3.style.top = Math.round(poles_bot - stacks[0].length * 20) + "px";

	disk2 = document.createElement("img");
	body.appendChild(disk2);
	stacks[0].push(disk2);
	disk2.id = "disk2";
	disk2.src = "disk.jpg";
	disk2.style.position = "absolute";
	disk2.style.width = 90 + "px";
	disk2.style.height = 19 + "px";
	disk2.style.left = Math.round(poles_mid[0] - parseInt(disk2.style.width) / 2) + "px";
	disk2.style.top = Math.round(poles_bot - stacks[0].length * 20) + "px";

	disk1 = document.createElement("img");
	body.appendChild(disk1);
	stacks[0].push(disk1);
	disk1.id = "disk1";
	disk1.src = "disk.jpg";
	disk1.style.position = "absolute";
	disk1.style.width = 80 + "px";
	disk1.style.height = 19 + "px";
	disk1.style.left = Math.round(poles_mid[0] - parseInt(disk1.style.width) / 2) + "px";
	disk1.style.top = Math.round(poles_bot - stacks[0].length * 20) + "px";
}

function init()
{
	poles_mid = [0, 0, 0]
	poles_mid[0] = 150;
	poles_mid[1] = 350;
	poles_mid[2] = 550;
	poles_top = 150;
	poles_bot = 320;

	makeStacks();
}
window.onload = init;
