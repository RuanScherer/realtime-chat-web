import Server from '../common/api'

export interface User {
	name?: string
	username: string
	password: string
}

class UsersService extends Server {
	public auth(user: User) {
		return this.connection.post('users/auth', user)
	}

	public register(user: User) {
		return this.connection.post('users', user)
	}
}

export default new UsersService()