import Util from '../shared/util';

export default class {
	/* 
		Этот модуль отвечает за дату и время
		в верхнем левом углу приложения.
		Прямой необходимости для оформления его как
		класс нет, но мне ведь тоже нужно показать,
		что я могу писать на ES6 
	*/

	constructor(dateObj) {
		this.absTime = dateObj.getTime();
		this.time = this.parseTime(dateObj);
		this.date = this.parseDate(dateObj);
		this.elsDOM = {
			date: document.getElementById('date'),
			time: document.getElementById('time')
		}

		this.setListeners();
	}

	setListeners() {
		window.addEventListener('minute', () => this.nextMinute());
	}

	nextMinute() {
		let timeArr = this.time.split(':').map(str => parseFloat(str));

		if (++timeArr[1] === 60) timeArr[0]++, timeArr[1] = 0;
		if (timeArr[0] === 24) timeArr[0] = 0;

		this.time = this.normalizeTime(timeArr);

		this.time === '00:00' ? this.nextDay() : this.update();
	}

	nextDay() {
		let day = parseFloat(this.date.match(/\d{0,}/)[0]);
		this.date = this.date.replace(/\d{0,}/, `${++day}`);
		this.update();
	}

	update() {
		this.elsDOM.date.textContent = this.date;
		this.elsDOM.time.textContent = this.time;
	}

	parseTime(obj) {
		return this.normalizeTime([
			obj.getHours(),
			obj.getMinutes()
		]);
	}

	parseDate(obj) {
		let
			m = Util.getMonths()[obj.getMonth()],
			d = Util.getWeek()[obj.getDay()];
		return `${obj.getDate()} ${m}, ${d}`;
	}

	normalizeTime(arr) {
		if (arr[0] < 10) arr[0] = `0${arr[0]}`;
		if (arr[1] < 10) arr[1] = `0${arr[1]}`;
		return arr.join(':');
	}
}