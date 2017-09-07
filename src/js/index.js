import '../scss/index.scss';
import '../json/channels.json';
import '../json/programms.json';

import DateAndTime from './components/dateAndTime';
import Days from './components/days';


/* Логика приложение */
init();


/* Функции */
function init() {
	document.getElementById('wrap')
		.classList.remove('loading');

	prepareApp();
}
function prepareApp() {
	let date = initDate();
	createTimeEvent();
	initDays(date.absTime);
}

function initDate() {
	//Запускаем модуль отвечающий за дату и время

	let date = new DateAndTime(new Date());
	date.update();

	return date;
}

function createTimeEvent() {
	/* Создаем событие, которое 
		будет запускаться каждую минуту,
		для того чтобы отслеживать изменение
		времени */

	let event = new Event('minute');
	setInterval(() => 
		window.dispatchEvent(event), 60*1000);
}

function initDays(today) {
	let days = new Days(today);
}