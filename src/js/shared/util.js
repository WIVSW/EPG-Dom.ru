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

	return {
		getMonths: getMonths,
		getWeek: getWeek
	}
}
export default Util();