/*
* Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
* https://kekse.biz/ https://github.com/kekse1/v4/
*/

//
const MAP = new Map();
var ignoreEvents = false;

//
const push = (_id, _target) => {
	ignoreEvents = true;
	var stack;

	if(!MAP.has(_id))
	{
		MAP.set(_id, stack = []);
	}
	else
	{
		stack = MAP.get(_id);
	}

	if(stack[stack.length - 1] !== _target)
	{
		const prev = stack[stack.length - 1];

		if(prev)
		{
			prev.releasePointerCapture(_id);
		}

		stack.push(_target);
	}

	ignoreEvents = false;
};

const pop = (_id, _target) => {
	if(!MAP.has(_id))
	{
		return;
	}

	ignoreEvents = true;
	const stack = MAP.get(_id);
	var remove, prev, index;
	
	if(_target)
	{
		remove = stack[index = stack.indexOf(_target)];
	}
	else
	{
		remove = stack[index = (stack.length - 1)];
	}

	if(index > -1)
	{
		remove.releasePointerCapture(_id);
		stack.splice(index, 1);

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
		}
		while(true);
	
		if(stack.length === 0)
		{
			MAP.delete(_id);
		}
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
	window.addEventListener('gotpointercapture',
		onGotPointerCapture, { passive: true });
	window.addEventListener('lostpointercapture',
		onLostPointerCapture, { passive: true }); });

//

