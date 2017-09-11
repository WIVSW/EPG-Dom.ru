import Util from '../shared/util';
import Channels from './channels';
import Programms from './programms';
import Scale from './scale';

export default class {
	/*  Этот модуль отвечает за взаимодействие трех 
		других: Каналы, Программы и Временная шкала */

	constructor() {
		this.data = {};
		this.getData()
			.then(() => this.init());
	}

	init() {
		this.prepareProgrammsArray();
		this.channels = new Channels(this.data.channels);
		this.programms = new Programms(this.data.programms);
		this.scale = new Scale(this.programms.time);

		this.setListeners();

		this.preloaderOff();
	}

	preloaderOff() {
		document.getElementById('wrap')
			.classList.remove('loading');

		document.getElementById('content')
			.classList.remove('changing');
	}

	setListeners() {
		let that = this;
		window.moveToNow = moveToNow;
		window.onScrollChange = onScrollChange;


		document.getElementById('channels')
			.onclick = (e) => this.channelSelect(e);

		document.getElementById('move_to_now')
			.addEventListener('click', window.moveToNow);

		document.getElementById('scroll')
			.addEventListener('change', window.onScrollChange);

		document.getElementById('programms')
			.onclick = (e) => this.showSelect(e);

		document.getElementById('days')
			.addEventListener('changeDay', () => this.removeListeners());


		//Функции нужны для того, чтобы удалить обработчики позже
		function moveToNow() {return that.scale.moveToNow();}
		function onScrollChange(e) {return that.scale.onScrollChange(e);}
	}

	removeListeners() {
		document.getElementById('move_to_now')
			.removeEventListener('click', window.moveToNow);

		document.getElementById('scroll')
			.removeEventListener('change', window.onScrollChange);
	}

	showSelect(e) {
		if (!e.target.classList.contains('show') ||
			 e.target.classList.contains('active')) 
				return false;

		let 
			showId = parseFloat(e.target.getAttribute('data-id')),
			chanId = e.target.parentNode
				.getAttribute('data-chan-id'),
			channel = document
				.querySelector(`.channel[data-chan-id="${chanId}"]`),
			detail = this.programms.getShowDetails(showId),
			detailHTML = this.programms
				.createShowDetail(detail);

		this.removeActiveChansAndProgs();
		Util.addActiveClass(e.target, channel);
		e.target.parentNode.insertAfter(detailHTML);
	}

	channelSelect(e) {
		if (e.target.id === 'channels') return false;

		let 
			target = e.target.className === 'channel' ? 
					 e.target : e.target.parentNode,

			chanId = target.getAttribute('data-chan-id');

		if (target.classList.contains('active')) return false;

		if (!this.scale.isToday) {
			/* Если пользователь смотрит программу
			   не на сегодняшний день, то нет смысла
			   искать активную передачу */
			this.removeActiveChansAndProgs();
			Util.addActiveClass(target);

			document.querySelector(`.programm[data-chan-id="${chanId}"]`)
				.classList.add('big');

			return false;
		}

		let show = this.programms.findActiveShow(chanId);

		if (!show) return false;

		this.scale.moveToNow();

		this.removeActiveChansAndProgs();
		let showDetail = this.programms
			.createShowDetail(show.detail);

		Util.addActiveClass(target, show.el);
		show.el.parentNode.insertAfter(showDetail);
	}

	removeActiveChansAndProgs() {
		let 
			detail = document.getElementById('detail_wrap'),
			prog = document.getElementsByClassName('programm big')[0],
			arr = [
				document.getElementsByClassName('channel active')[0],
				document.getElementsByClassName('show active')[0]
			];

		if (prog) prog.classList.remove('big');

		if (detail) detail.remove();

		Util.removeActiveClass(...arr);
	}

	prepareProgrammsArray() {
		/* Конпануем програмы по каналам и 
		   и сортируем их, чтобы потом проще 
		   было вставлять в HTML */
		let arr = [];

		this.data.channels
			.map(chan => chan.epg_channel_id)

			.forEach(chanId => {
				let grouped = this.data.programms
					.filter(prog => 
						prog.channel_id === chanId)

					.sort((a,b) => a.start - b.start);

				arr.push({'chan_id': chanId, 'progs': grouped});
			});

		this.data.programms = arr;
	}

	getData() {
		return Promise.all([
			this.getChannels(), this.getProgramms()
		]);
	}

	getChannels() {
		return Util.sendXHR('/json/channels.json')
			.then(data => this.data.channels = data
				/*  Следующее действие опциональное, 
					но в тз рекомендовалось отсортировать
					каналы */
				.sort((a,b) => a.er_lcn - b.er_lcn))
			.catch(error => console.error(error));
	}

	getProgramms() {
		return Util.sendXHR('/json/programms.json')
			.then(data => this.data.programms = data)
			.catch(error => console.error(error));
	}
}