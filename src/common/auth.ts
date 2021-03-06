export interface Socket {
	disconnect(): void
}

export default class Auth {
	getTokenData() {
		const data = localStorage.getItem('accessToken')?.split('.')[1] as string
		return JSON.parse(atob(data))
	}

	logout(socket?: Socket) {
		if (socket) socket.disconnect()
		localStorage.removeItem("accessToken")
		window.location.replace("/")
	}
}