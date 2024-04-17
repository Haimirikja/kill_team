class Deck {
    elements = [];

	constructor(elements) {
		if (!elements) this.elements = [];
		else {
			if (!Array.isArray(elements)) elements = [elements];
			elements.forEach(element => {
				this.elements.push(element);
			});
		}
	}

	shuffle = function() {
		if (!this.elements.length) return null;
		const shuffleTimesTable = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
		let shuffleTimes = shuffleTimesTable[Math.floor(Math.random() * shuffleTimesTable.length)];
		for (;shuffleTimes > 0; shuffleTimes--) {
			let idx, temp;
			for (let i = this.elements.length - 1; i > 0; i--) {
				idx = Math.floor(Math.random() * this.elements.length);
				temp = this.elements[i];
				this.elements[i] = this.elements[idx];
				this.elements[idx] = temp;
			}
		}
		return this.elements;
	}

	add = function(element) {
		this.elements.push(element);
		return this.elements;
	}

	draw = function(quantity = 1, remove = true) {
		quantity = parseInt(quantity);
		remove = remove ? true : false;
		if (isNaN(quantity) || !isFinite(quantity)) return [];
		if (quantity > this.elements.length) quantity = this.elements.length;
		if (remove) return this.elements.splice(0, quantity);
		else return this.elements.slice(0, quantity);
	}
}