/*
* Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
* https://kekse.biz/ https://github.com/kekse1/v4/
*/

//
const capture = window.PointerCapture = {};
capture.MAP = new Map(); export default capture;

//
var ignoreEvents = false;

//
const push = (_id, _target = null) => {
	ignoreEvents = true;
	var stack;

	if(!capture.MAP.has(_id))
	{
		capture.MAP.set(_id, stack = []);
	}
	else
	{
		stack = capture.MAP.get(_id);
	}

	const prev = stack[stack.length - 1];

	if(prev)
	{
		prev.releasePointerCapture(_id);
	}

	stack.push(_target);
	ignoreEvents = false;
};

const pop = (_id, _target = null) => {
	if(!capture.MAP.has(_id))
	{
		return;
	}

	ignoreEvents = true;
	const stack = capture.MAP.get(_id);
	var remove, prev;
	
	if(_target)
	{
		remove = stack[stack.lastIndexOf(_target)];
	}
	else
	{
		remove = stack.pop();
	}

	if(remove)
	{
		remove.releasePointerCapture(_id);
		stack.remove(remove);
	}

	do
	{
		try
		{
			prev = stack[stack.length - 1];
			if(prev) prev.setPointerCapture(_id);
			else break;
		}
		catch(_err)
		{
			prev = stack.pop();
		}

		if(stack.length === 0)
		{
			break;
		}
	}
	while(true);
	
	if(stack.length === 0)
	{
		capture.MAP.delete(_id);
	}

	ignoreEvents = false;
};

//
const onGotPointerCapture = (_event) => {
	if(!ignoreEvents)
	{
		push(_event.pointerId,
			_event.target);
	}
};

const onLostPointerCapture = (_event) => {
	if(!ignoreEvents)
	{
		pop(_event.pointerId,
			_event.target);
	}
};

//
setTimeout(() => {
	window.on('gotpointercapture',
		onGotPointerCapture,
			{ passive: true });
	window.on('lostpointercapture',
		onLostPointerCapture,
			{ passive: true });
});

//

