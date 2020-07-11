import Server from '../common/api'

export interface Message {
	username: string
	content: string
}

class MessagesService extends Server {
	private config = {}

	constructor() {
		super()
		this.setRequestConfig()
	}

	private setRequestConfig() {
		this.config = {
			headers: {
				authorization: localStorage.getItem("accessToken") as string
			}
		}
	}

	public getAll() {
		this.setRequestConfig()
		return this.connection.get('messages', this.config)
	}

	public create(data: Message) {
		this.setRequestConfig()
		return this.connection.post('messages', data, this.config)
	}
}

export default new MessagesService()