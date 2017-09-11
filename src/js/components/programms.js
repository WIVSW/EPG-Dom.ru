export default class {
	/*
		Этот модуль отвечает за парсинг
		программ и действиями с программами
	*/

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

	getShowDetails(id) {
		return this.unordered
			.filter(show => show.id === id)[0];
	}

	getProgramm(chanId) {
		return this.grouped.filter(prog => 
			prog.chan_id === parseFloat(chanId))
			.map(prog => prog.progs)[0];
	}

	findActiveShow(chanId) {
		let 
			progArr = this.getProgramm(chanId),
			time = this.checkIsProgrammOn(chanId);

		if (!time) return this.noneForChan(chanId);

		/*  Далее используем обычный цикл, т.к.
			он позволит вернуть первый же подходящий
			вариант без необходимости проходить весь
			цикл */

		//сохранение значения в переменную оптимизирует скорость цикла
		let length = progArr.length;

		for (let i = 0; i < length; i++) {
			let 
				id = progArr[i].id,
				show = document.querySelector(`.show[data-id="${id}"]`),
				start = parseFloat(show.style.left),
				end = parseFloat(show.style.width) + start;

			if (time >= start && time < end) 
				return {el: show, detail: progArr[i]};
		}

		/* Если происходит перерыв между программами
			сообщаем об этом пользователю */

		return this.noneForChan(chanId);
	}

	checkIsProgrammOn(chanId) {
		//Получаем текущее время, относительно начала врем шкалы
		let
			time = parseFloat(document
				.getElementById('timepoint').style.left),
			//Получаем начало и конец вещания канала
			prog = document.querySelector(`.programm[data-chan-id="${chanId}"]`),
			start = parseFloat(prog.firstChild.style.left),
			end = parseFloat(prog.lastChild.style.left) + 
				  parseFloat(prog.lastChild.style.width);

		/*  Если вещание еще не началось или уже кончилось,
			то возвращаем false иначе возвращаем текущее время*/
		return time < start || time > end ?
			false : time;
	}

	noneForChan(chanId) {
		let title = document
			.querySelector(`[data-chan-id="${chanId}"] .channel_title`)
			.textContent;

		alert(`${title} не в эфире`);
		return false;
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
			programm.setAttribute('data-chan-id', prog.chan_id);

			prog.progs.forEach(show => {
				let 
					div = document.createElement('div'),
					left = ((show.start - this.time.start)/60)*this.pxPerMin,
					width = (show.duration/60)*this.pxPerMin;

				div.className = 'show';
				div.setAttribute('data-id', show.id);
				div.textContent = show.title;
				div.style.left = `${left}px`;
				div.style.width = `${width}px`;

				programm.appendChild(div);
			});

			frag.appendChild(programm);
		});

		return frag;
	}

	createShowDetail(data) {
		let 
			wrap = document.createElement('div'),
			detail = document.createElement('div'),
			title = document.createElement('div'),
			genres = document.createElement('div'),
			desc = document.createElement('div'),
			genStr = data.program.genres
				.map(gen => gen.title).join(', '),
			posLeft = Math.abs(parseFloat(document
				.getElementById('programms_slider')
				.style.left));

		wrap.id = 'detail_wrap';

		detail.id = 'programm_detail';
		detail.style.left = `${posLeft}px`;

		title.className = 'programm_title';
		title.textContent = data.title;

		genres.className = 'programm_genre';
		genres.textContent = `Жанр: ${genStr}.`;

		desc.className = 'programm_desc';
		desc.textContent = data.program.description;

		detail.appendChild(title);
		detail.appendChild(genres);
		detail.appendChild(desc);

		wrap.appendChild(detail);

		return wrap;
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