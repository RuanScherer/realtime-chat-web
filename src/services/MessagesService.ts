import api from '../common/api'

export interface Message {
	username: string
	content: string
}

class MessagesService {
	public getAll() {
		return api.get('messages')
	}

	public create(data: Message) {
		return api.post('messages', data)
	}
}

export default new MessagesService()