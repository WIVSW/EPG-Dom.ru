Object.prototype.toArray = function() {
	return Object.keys(this).map(key => this[key]);
}