class Formaters {
	private separate(timestamp: string) {
		return timestamp.split("T")
	}

	public formatDate(timestamp: string) {
		let date = this.separate(timestamp)[0]
		const newDate = date.split("-")
		return `${newDate[2]}/${newDate[1]}/${newDate[0]}`
	}

	public formatTime(timestamp: string) {
		let time = this.separate(timestamp)[1]
		time = time.substr(0, 5)
		return time
	}
}

export default new Formaters()