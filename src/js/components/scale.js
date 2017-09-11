import Util from '../shared/util';

export default class {

	/*
		Этот модуль отвечает за создание
		временной шкалы
	*/

	constructor(data) {
		let day = document.getElementsByClassName('day active')[0];

		this.isToday = day.textContent.trim().toLowerCase() === 'сегодня';
		this.startTime = this.isToday ? '04:00' : this.generateTime();

		this.isToday ? this.showControls() : this.hideControls();

		this.pxPerMin = 8;
		this.data = data;
		
		this.array = this.prepareScaleArray(this.startTime);
		this.fragment = this.createScale(this.array);
		this.insertScale();

		this.initTimePoint(this.startTime);
		this.prepareProgrammScroll();
		this.initProgrammScroll();

		this.setListeners();
	}

	setListeners() {
		let that = this;
		window.nextMinute = nextMinute;


		window.addEventListener('minute', window.nextMinute);

		document.getElementById('days')
			.addEventListener('changeDay', () => this.removeListeners());


		function nextMinute() {return that.nextMinute();}
	}

	removeListeners() {
		window.removeEventListener('minute', window.nextMinute);
	}

	showControls() {
		document.getElementById('timepoint')
			.classList.remove('hide');
	
		document.getElementById('move_to_now')
			.classList.remove('hide');
	}
	
	hideControls() {
		document.getElementById('timepoint')
			.classList.add('hide');
			
		document.getElementById('move_to_now')
			.classList.add('hide');
	}

	generateTime() {
		let time = [];
		time[0] = Util.getRand(0, 23);
		time[1] = 30*Util.getRand(0, 1);
		return Util.normalizeTime(time);
	}

	moveToNow() {
		let
			timepoint = document.getElementById('timepoint'),
			timepointL = parseFloat(timepoint.style.left),
			to = this.calcScrollVal(timepointL);

		if (to < 0) to = 0;

		this.moveScroll(to);
	}

	initProgrammScroll() {
		let scroll = document.getElementById('scroll');

		scroll.min = this.min;
		scroll.max = this.max;
		scroll.step = this.step;
		this.moveScroll(this.initVal);
	}

	onScrollChange(e) {
		let that = e.target;
		this.moveScroll(parseFloat(that.value))
	}

	moveScroll(val) {
		let 
			scroll = document.getElementById('scroll'),
			slider = document.getElementById('programms_slider');

		scroll.value = val;
		slider.style.left = `-${val}px`;
	}

	prepareProgrammScroll() {
		let
			halfW = 30*this.pxPerMin,
			timepoint = document.getElementById('timepoint'),
			wrapW = halfW*4,
			timepointL = parseFloat(timepoint.style.left),
			scaleW = halfW*this.array.length;

		this.min = 0;
		this.max = scaleW - wrapW;
		this.step = halfW;
		this.width = scaleW;
		this.initVal = this.calcScrollVal(timepointL);
	}

	calcScrollVal(val) {
		if (!this.isToday) return 0;

		if (val < this.min || val > this.width) {
			alert('Сейчас ничего не идет!');
			return 0;
		}

		if (val > this.max ) return this.max;

		return (Math.round(val/this.step) - 2)*this.step;
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