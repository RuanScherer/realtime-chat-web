import Server from '../common/api'

export interface User {
	name?: string
	username: string
	password: string
}

export default class UsersService extends Server {
	public login(user: User) {
		return this.connection.post('users/auth', user)
	}

	public register(user: User) {
		return this.connection.post('users', user)
	}

	public search(username: string) {
		return this.connection.get(`users/search?search=${username}`)
	}
}