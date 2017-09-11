HTMLElement.prototype.insertAfter = function(frag) {
	let 
		parent = this.parentNode,
		next = this.nextSibling;

	return next ? 
		parent.insertBefore(frag, next) :
		parent.appendChild(frag);
}

HTMLElement.prototype.remove = function() {
    this.parentElement.removeChild(this);
}