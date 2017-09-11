import '../scss/index.scss';
import '../json/channels.json';
import '../json/programms.json';

import './shared/object';
import './shared/html';

import DateAndTime from './components/dateAndTime';
import Days from './components/days';
import ChannelsProgrammsCommunicator from './components/communicator';


/* Логика приложение */
init();

/* Функции */
function init() {
	let date = initDate();
	createTimeEvent();
	initDays(date.absTime);
	initCommunicator();

	setListeners();
}

function setListeners() {
	document.getElementById('days')
		.addEventListener('changeDay', changeDay);
}

function changeDay(e) {
	initCommunicator();
}

function initCommunicator() {
	return new ChannelsProgrammsCommunicator();
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
		/* если изменить задержку, то можно увидеть
			явнее обновление времени */
}

function initDays(today) {
	return new Days(today);
}