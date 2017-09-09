import Util from '../shared/util';

export default class {

	constructor(startTime, data) {
		this.pxPerMin = 8;
		this.data = data;
		this.array = this.prepareScaleArray(startTime);
		this.fragment = this.createScale(this.array);
		this.insertScale();

		this.initTimePoint(startTime);
		this.setListeners();
	}

	setListeners() {
		window.addEventListener('minute', () => this.nextMinute());
	}

	nextMinute() {
		let 
			timepoint = document.getElementById('timepoint'),
			left = parseFloat(timepoint.style.left)+this.pxPerMin;

		timepoint.style.left = `${left}px`;
	}

	initTimePoint(startTime) {
		let 
			start = Util.timeToArr(startTime),
			now = Util.timeToArr(document.
				getElementById('time').textContent),
			timepoint = document.getElementById('timepoint');

		//Вычитаем текущее время из стартового
		now[0] -= start[0]; //Часы
		now[1] -= start[1]; //Минуты

		let min = now[1]+(now[0]*60) //оставшиеся минуты и часы

		if (min < 0) timepoint.style.left = '-10px';

		timepoint.style.left = `${min*this.pxPerMin}px`;
	}

	insertScale() {
		document.getElementById('scale')
			.appendChild(this.fragment);
	}

	createScale(arr) {
		let frag = document.createDocumentFragment();

		arr.forEach(val => {
			let div = document.createElement('div');
			div.className = 'timestamp';
			div.textContent = val;
			div.style.width = `${30*this.pxPerMin}px`

			frag.appendChild(div);
		});

		return frag;
	}

	prepareScaleArray(startTime) {
		let 
			arr = [],
			/*  количество отрывков по полчаса 
				на временной шкале плюс один
				для завершающей отметки */
			count = (this.data.duration/(30*60))+1;

		for (var i = 0; i < count; i++) { 
			arr[i] = startTime;
			startTime = Util.plusMin(30, startTime);
		}

		return arr;
	}
}