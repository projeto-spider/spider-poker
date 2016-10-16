export function addClass(selector, className) {
	const el = document.querySelector(selector);

	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
}

export function removeClass(selector, className) {
	const el = document.querySelector(selector);

	if (el.classList) {
		el.classList.remove(className);
	} else {
		el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
}

