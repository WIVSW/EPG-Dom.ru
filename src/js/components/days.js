import Util from '../shared/util';

export default class {
	/*
		Этот модуль отвечает за создание
		панели с днями и за переключение 
		по дням
	*/
	constructor(today) {
		this.today = today;
		this.array = [];
		this.fragment = document.createDocumentFragment();
		this.event = new Event('changeDay');

		this.createDaysNavBar();

		document.getElementById('days')
			.appendChild(this.fragment);

		this.setListeners();
	}

	setListeners() {
		let
			prev = document.getElementById('prev_day'),
			next = document.getElementById('next_day');

		prev.onclick = () => this.prevDay();
		next.onclick = () => this.nextDay();
	}

	nextDay() {
		let content = document.getElementById('content');
	
		if (content.classList.contains('changing')) return false;

		content.classList.add('changing');

		let 
			active = document.getElementsByClassName('day active')[0],
			next = active.nextSibling,
			first = active.parentNode.firstChild;

		next ? this.changeDay(active, next) 
			 : this.changeDay(active, first);
	}

	prevDay() {
		let content = document.getElementById('content');
	
		if (content.classList.contains('changing')) return false;

		content.classList.add('changing');

		let 
			active = document.getElementsByClassName('day active')[0],
			prev = active.previousSibling,
			last = active.parentNode.lastChild;

		prev ? this.changeDay(active, prev) 
			 : this.changeDay(active, last);
	}

	changeDay(active, target) {
		Util.addActiveClass(target);
		Util.removeActiveClass(active);

		this.clearTemplate();

		target.parentNode.dispatchEvent(this.event);
	}

	clearTemplate() {
		document.getElementById('scale').innerHTML = '';
		document.getElementById('programms').innerHTML = '';
		document.getElementById('channels').innerHTML = '';
	}

	createDaysNavBar() {
		this.prepareArray();
		this.arrayToHTML();
	}

	arrayToHTML() {
		this.array.forEach(obj => {
			let btn = document.createElement('button');

			btn.textContent = obj.name;
			btn.setAttribute('data-date', obj.date);
			btn.className = obj.className ? 
				`day ${obj.className}` : 'day';

			this.fragment.appendChild(btn);
		});
	}

	prepareArray() {
		let 
			today = this.createObj(
				this.today, 'Сегодня', 'active'),

			tomorrow = this.createObj(
				this.today+(24*60*60*1000), 
					'Завтра', null);

		this.array.push(today, tomorrow);
		this.pushPrevDates(3);
		this.pushNextDates(6);
	}

	pushPrevDates(n) {
		for(let i = 1; i <= n; i++) {
			let date = this.today-(24*60*60*1000*i);

			this.array.unshift(
				this.createObj(date, null, null)
			);
		}
	}

	pushNextDates(n) {
		n++;
		for(let i = 2; i <= n; i++) {
			let date = this.today+(24*60*60*1000*i);

			this.array.push(
				this.createObj(date, null, null)
			);
		}
	}

	createObj(date, name, className) {
		let obj = {
			date: date, name:name, className: className
		};

		if (!name) {
			let day = new Date(date).getDay();
			obj.name = Util.getWeek()[day];
		}
		
		return obj;
	} 
}