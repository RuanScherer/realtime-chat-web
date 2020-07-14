import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import Auth, { Socket } from './auth'

export default class Server {
	protected connection: AxiosInstance
	protected auth: Auth
	protected socket?: Socket

	constructor(socket?: Socket) {
		this.connection = axios.create({ baseURL: "http://localhost:3333/" })
		this.auth = new Auth()
		
		if (socket) {
			this.socket = socket

			this.connection.interceptors.response.use((response: AxiosResponse) => {
				return response
			}, (error: AxiosError) => {
				const response = error.response as AxiosResponse
				if (response.status === 401) return this.auth.logout(socket)
				return Promise.reject(error)
			})
		}
	}
}
