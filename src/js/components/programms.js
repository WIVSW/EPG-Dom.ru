export default class {

	constructor(array) {
		this.pxPerMin = 8;
		this.grouped = array;
		this.unordered = this.getUnorderedArray(array);
		this.time = {start: this.findStart(), 
			end: null, duration: this.findDuration()};
		this.time.end = this.time.duration + this.time.start;
		/* Все время в секундах */

		this.fragment = this.createProgramms();

		this.insertProgramms();

	}

	insertProgramms() {
		document.getElementById('programms')
			.appendChild(this.fragment);
	}

	createProgramms() {
		let frag = document.createDocumentFragment();

		this.grouped.forEach(prog => {
			let programm = document.createElement('div');
			programm.className = 'programm';
			programm.id = prog.chan_id;

			prog.progs.forEach(show => {
				let 
					div = document.createElement('div'),
					left = ((show.start - this.time.start)/60)*this.pxPerMin,
					width = (show.duration/60)*this.pxPerMin;

				div.className = 'show';
				div.id = show.id;
				div.textContent = show.title;
				div.style.left = `${left}px`;
				div.style.width = `${width}px`;

				programm.appendChild(div);
			});

			frag.appendChild(programm);
		});

		return frag;
	}

	findDuration() {
		return this.grouped.map(a => a.progs
				.map(a => a.duration).reduce((a,b) => a+b))
			.reduce((a,b) => a > b ? a : b);
	}

	findStart() {
		return this.unordered.sort((a,b) => 
			a.start - b.start)[0].start;
	}

	getUnorderedArray(arr) {
		return arr.map(chan => chan.progs)
			.reduce((a,b) => a.concat(b))
	}

}