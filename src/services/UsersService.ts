import Server from '../common/api'

export interface User {
	name?: string
	username: string
	password: string
}

export default class UsersService extends Server {
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
	
	public login(user: User) {
		return this.connection.post('users/auth', user)
	}

	public register(user: User) {
		return this.connection.post('users', user)
	}

	public search(username: string) {
		this.setRequestConfig()
		return this.connection.get(`users/search?search=${username}`, this.config)
	}

	public show(id: string) {
		this.setRequestConfig()
		return this.connection.get(`users/${id}`, this.config)
	}

	public update(id:string, username: string) {
		this.setRequestConfig()
		return this.connection.put(`users/${id}`, { username }, this.config)
	}
}