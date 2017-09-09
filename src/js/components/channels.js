export default class {
	/*
		Этот модуль отвечает за подгрузку
		каналов из json
	*/
	constructor(data) {
		this.array = data;
		this.createChannelsSidebar();
		this.channelsInsert();
	}

	channelsInsert() {
		document.getElementById('channels')
				.appendChild(this.fragment);
	}

	createChannelsSidebar() {
		this.fragment = document.createDocumentFragment();
		this.array.forEach(chan => {
			let 
				wrap = document.createElement('div'),
				lcn = document.createElement('div'),
				title = document.createElement('div'),
				desc = document.createElement('div');

			wrap.className = 'channel';
			wrap.id = chan.epg_channel_id;

			lcn.className = 'channel_lcn';
			lcn.textContent = chan.er_lcn;
			wrap.appendChild(lcn);

			title.className = 'channel_title';
			title.textContent = chan.title;
			wrap.appendChild(title);

			desc.className = 'channel_description';
			desc.textContent = chan.description;
			wrap.appendChild(desc);

			this.fragment.appendChild(wrap);
		});
	}

}