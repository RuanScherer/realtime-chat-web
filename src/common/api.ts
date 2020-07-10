import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import auth from './auth'

export default class Server {
	protected connection: AxiosInstance

	constructor() {
		this.connection = axios.create({ baseURL: "http://localhost:3333/" })

		this.connection.interceptors.response.use((response: AxiosResponse) => {
			return response
		}, (error: AxiosError) => {
			const response = error.response as AxiosResponse
			if (response.status === 401) return auth.logout()
			return Promise.reject(error)
		})
	}
}
