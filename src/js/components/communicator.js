import Util from '../shared/util';
import Channels from './channels';
import Programms from './programms';
import Scale from './scale';

export default class {
	constructor() {
		this.data = {};
		this.getData()
			.then(() => this.init());
	}

	init() {
		this.prepareProgrammsArray();
		this.channels = new Channels(this.data.channels);
		this.programms = new Programms(this.data.programms);
		this.scale = new Scale('05:00', this.programms.time);

		this.setListeners();
	}

	setListeners() {
		//window.addEventListener('channelSelect',
		//	 (e) => this.changeChannel(e))
	}

	changeChannel(e) {
		console.log(e.detail);
	}

	createEvents() {
		document.getElementById('channels')
				.addEventListener('click', 
					e => this.channelSelect(e));
	}

	channelSelect(e) {
		if (e.target.id === 'channels') return false;

		let 
			target = e.target.className === 'channel' ? 
				e.target : e.target.parentNode,

			event = new CustomEvent('channelSelect', 
				{'detail': {'id': target.id}});

		window.dispatchEvent(event);
	}

	prepareProgrammsArray() {
		/* Конпануем програмы по каналам,
		   чтобы потом проще было вставлять 
		   в HTML */
		let arr = [];

		this.data.channels
			.map(chan => chan.epg_channel_id)

			.forEach(chanId => {
				let grouped = this.data.programms
					.filter(prog => 
						prog.channel_id === chanId);

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