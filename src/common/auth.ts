class Auth {
	logout() {
		localStorage.removeItem("accessToken")
		window.location.replace("/")
	}
}

export default new Auth()