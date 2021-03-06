import Server from '../common/api'
import { Socket } from '../common/auth'

export interface Message {
	from: {
		_id: string
		username: string
	},
	to?: string,
	content: string
}

export default class MessagesService extends Server {
	private config = {}

	constructor(socket: Socket) {
		super(socket)
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

	public show(receiver: string) {
		this.setRequestConfig()
		return this.connection.get(`messages/conversation/${receiver}`, this.config)
	}
}