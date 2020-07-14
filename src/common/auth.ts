class Auth {
	getTokenData() {
		const data = localStorage.getItem('accessToken')?.split('.')[1] as string
		return JSON.parse(atob(data))
	}

	logout() {
		localStorage.removeItem("accessToken")
		window.location.replace("/")
	}
}

export default new Auth()