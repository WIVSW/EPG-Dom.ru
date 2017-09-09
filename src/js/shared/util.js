function Util() {

	let getMonths = () => {
		return [
			'января', 'февраля', 'марта', 
			'апреля', 'мая', 'июня', 
			'июля', 'августа', 'сентября', 
			'октября', 'ноября', 'декабря'
		];
	}

	let getWeek = () => {
		return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
	}

	let sendXHR = url => 
		new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open('GET', url);

			xhr.onload = () => xhr.status === 200 ? 
				resolve(JSON.parse(xhr.response).collection) : 
				reject(xhr.statusText);

			xhr.onerror = error => reject(error);

			xhr.send();
		});

	let timeToArr = (time) => 
		time.split(':').map(str => parseFloat(str));

	let plusMin = (min, time) => {
		let timeArr = timeToArr(time);

		timeArr[1] += min;

		if (timeArr[1] === 60) timeArr[0]++, timeArr[1] = 0;
		if (timeArr[0] === 24) timeArr[0] = 0;

		return normalizeTime(timeArr);
	}

	let normalizeTime = (arr) => {
		if (arr[0] < 10) arr[0] = `0${arr[0]}`;
		if (arr[1] < 10) arr[1] = `0${arr[1]}`;
		return arr.join(':');
	}


	return {
		getMonths: getMonths,
		getWeek: getWeek,
		sendXHR: sendXHR,
		plusMin:plusMin,
		normalizeTime:normalizeTime,
		timeToArr: timeToArr
	}
}
export default Util();